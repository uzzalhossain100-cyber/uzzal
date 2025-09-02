import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid'; // For unique file names

interface Advertisement {
  id: string;
  row_index: number;
  col_index: number;
  image_url: string;
  created_at: string;
}

const ADS_PER_ROW = 4;
const MAX_FILE_SIZE_MB = 5; // Max file size for upload

const AdvertisementPage: React.FC = () => {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({}); // Track upload state per slot
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const isAdmin = profile?.email === 'uzzal@admin.com';

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        showError("আপনার এই পেজটি অ্যাক্সেস করার অনুমতি নেই।");
        navigate('/');
        return;
      }
      fetchAdvertisements();
    }
  }, [authLoading, isAdmin, navigate]);

  const fetchAdvertisements = async () => {
    setLoadingAds(true);
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('row_index', { ascending: true })
      .order('col_index', { ascending: true });

    if (error) {
      showError("বিজ্ঞাপন লোড করতে ব্যর্থ: " + error.message);
    } else {
      setAdvertisements(data || []);
      console.log("Fetched Advertisements:", data); // Debugging: Log fetched data
    }
    setLoadingAds(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
      showError("শুধুমাত্র JPG বা PNG ছবি আপলোড করা যাবে।");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showError(`ফাইলের আকার ${MAX_FILE_SIZE_MB}MB এর বেশি হতে পারবে না।`);
      return;
    }

    const slotKey = `${rowIndex}-${colIndex}`;
    setUploading(prev => ({ ...prev, [slotKey]: true }));

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `public/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('advertisement-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      showError("ছবি আপলোড করতে ব্যর্থ: " + uploadError.message);
      setUploading(prev => ({ ...prev, [slotKey]: false }));
      return;
    }

    const publicUrl = supabase.storage.from('advertisement-images').getPublicUrl(filePath).data.publicUrl;
    console.log("Generated public URL:", publicUrl); // Debugging: Log the public URL

    // Check if an ad already exists at this position
    const existingAd = advertisements.find(
      (ad) => ad.row_index === rowIndex && ad.col_index === colIndex
    );

    if (existingAd) {
      // If exists, update the image and delete old one from storage
      const oldFilePath = existingAd.image_url.split('advertisement-images/')[1];
      if (oldFilePath) {
        const { error: removeOldError } = await supabase.storage.from('advertisement-images').remove([oldFilePath]);
        if (removeOldError) {
          console.error("Error removing old image from storage:", removeOldError.message);
        }
      }

      const { error: updateError } = await supabase
        .from('advertisements')
        .update({ image_url: publicUrl })
        .eq('id', existingAd.id);

      if (updateError) {
        showError("বিজ্ঞাপন আপডেট করতে ব্যর্থ: " + updateError.message);
      } else {
        showSuccess("বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে!");
        await fetchAdvertisements(); // Await to ensure state is updated before next render
      }
    } else {
      // If not, insert new ad
      const { error: insertError } = await supabase.from('advertisements').insert({
        row_index: rowIndex,
        col_index: colIndex,
        image_url: publicUrl,
      });

      if (insertError) {
        showError("বিজ্ঞাপন যোগ করতে ব্যর্থ: " + insertError.message);
      } else {
        showSuccess("বিজ্ঞাপন সফলভাবে যোগ করা হয়েছে!");
        await fetchAdvertisements(); // Await to ensure state is updated before next render
      }
    }
    setUploading(prev => ({ ...prev, [slotKey]: false }));
    // Reset file input
    if (fileInputRefs.current[slotKey]) {
      fileInputRefs.current[slotKey]!.value = '';
    }
  };

  const handleRemoveImage = async (adId: string, imageUrl: string) => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিত যে এই বিজ্ঞাপনটি ডিলিট করতে চান?");
    if (!confirmDelete) return;

    const filePath = imageUrl.split('advertisement-images/')[1];
    if (!filePath) {
      showError("ফাইলের পাথ খুঁজে পাওয়া যায়নি।");
      return;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('advertisement-images')
      .remove([filePath]);

    if (storageError) {
      showError("ছবি স্টোরেজ থেকে ডিলিট করতে ব্যর্থ: " + storageError.message);
      return;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', adId);

    if (dbError) {
      showError("বিজ্ঞাপন ডিলিট করতে ব্যর্থ: " + dbError.message);
    } else {
      showSuccess("বিজ্ঞাপন সফলভাবে ডিলিট করা হয়েছে!");
      fetchAdvertisements();
    }
  };

  const getRows = () => {
    const rows: Advertisement[][] = [];
    advertisements.forEach(ad => {
      if (!rows[ad.row_index]) {
        rows[ad.row_index] = [];
      }
      rows[ad.row_index][ad.col_index] = ad;
    });
    return rows;
  };

  const rows = getRows();
  const maxRowIndex = rows.length > 0 ? Math.max(...rows.map((_, i) => i)) : -1;

  const handleAddRow = () => {
    // This function now just adds a visual placeholder row.
    // The actual database insertion happens when an image is uploaded to a slot in this new row.
    setAdvertisements(prev => {
      const newRowIndex = maxRowIndex + 1;
      const newAdsInRow: Advertisement[] = Array.from({ length: ADS_PER_ROW }).map((_, colIndex) => ({
        id: `temp-${newRowIndex}-${colIndex}`, // Temporary ID for empty slots
        row_index: newRowIndex,
        col_index: colIndex,
        image_url: '', // Empty URL
        created_at: new Date().toISOString(),
      }));
      return [...prev, ...newAdsInRow];
    });
  };

  if (authLoading || loadingAds) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground font-bold">বিজ্ঞাপন লোড হচ্ছে...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Should have been redirected by now, but as a fallback
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <ImageIcon className="h-7 w-7 mr-2" /> বিজ্ঞাপন ম্যানেজমেন্ট
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">বিজ্ঞাপন ছবি যোগ, আপডেট বা ডিলিট করুন</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-6 border p-4 rounded-lg bg-background/60 backdrop-blur-sm border-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-extrabold text-foreground">সারি {rowIndex + 1}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: ADS_PER_ROW }).map((_, colIndex) => {
                    const ad = row[colIndex];
                    const slotKey = `${rowIndex}-${colIndex}`;
                    const isUploading = uploading[slotKey];

                    return (
                      <div key={colIndex} className="relative border border-primary/20 rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-muted/30">
                        {ad && ad.image_url ? (
                          <>
                            <img src={ad.image_url} alt={`Ad ${rowIndex}-${colIndex}`} className="w-full h-full object-cover" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full"
                              onClick={() => handleRemoveImage(ad.id, ad.image_url)}
                              disabled={isUploading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                            {isUploading ? (
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : (
                              <ImageIcon className="h-8 w-8 mb-2" />
                            )}
                            <span className="text-sm text-center font-bold">
                              {isUploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন (JPG/PNG)"}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg, image/png"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, rowIndex, colIndex)}
                              disabled={isUploading}
                              ref={el => fileInputRefs.current[slotKey] = el}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <Button onClick={handleAddRow} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Plus className="h-4 w-4 mr-2" /> নতুন সারি যোগ করুন
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisementPage;
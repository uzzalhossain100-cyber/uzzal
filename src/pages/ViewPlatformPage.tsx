import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const ViewPlatformPage: React.FC = () => {
  const { encodedUrl, itemName } = useParams<{ encodedUrl: string; itemName: string }>();
  const navigate = useNavigate();
  const decodedUrl = encodedUrl ? decodeURIComponent(encodedUrl) : '';
  const decodedItemName = itemName ? decodeURIComponent(itemName) : 'ওয়েবসাইট';

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (category list)
  };

  const handleOpenInNewTab = () => {
    if (decodedUrl) {
      window.open(decodedUrl, '_blank');
    } else {
      toast.error("লিঙ্কটি খোলা যাচ্ছে না।");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-2xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {decodedItemName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <ExternalLink className="mr-2 h-4 w-4" /> নতুন ট্যাবে খুলুন
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {decodedUrl ? (
            <iframe
              src={decodedUrl}
              title={decodedItemName}
              className="w-full h-[calc(100vh-130px)] border-0 rounded-b-lg"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-presentation allow-same-origin"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg p-4">
              কোনো URL নির্বাচন করা হয়নি।
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewPlatformPage;
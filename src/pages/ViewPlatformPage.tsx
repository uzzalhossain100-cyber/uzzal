import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

const ViewPlatformPage: React.FC = () => {
  const { encodedUrl, itemName } = useParams<{ encodedUrl: string; itemName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation

  const decodedUrl = encodedUrl ? decodeURIComponent(encodedUrl) : '';
  const decodedItemName = itemName ? decodeURIComponent(itemName) : t("common.view_platform_page_title"); // Use translation for default

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (category list)
  };

  const handleOpenInNewTab = () => {
    if (decodedUrl) {
      window.open(decodedUrl, '_blank');
    } else {
      toast.error(t("common.failed_to_open_link"));
    }
  };

  // Calculate iframe height dynamically based on whether the sticker is present
  const iframeHeight = decodedItemName === t('item.all_in_one_tv') ? 'calc(100vh - 130px - 40px)' : 'calc(100vh - 130px)';

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-2xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {decodedItemName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
            <ExternalLink className="mr-2 h-4 w-4" /> {t("common.open_in_new_tab")}
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {decodedItemName === t('item.all_in_one_tv') && (
            <div className="flex items-center justify-center py-2 bg-gray-900 text-white text-lg font-extrabold">
              <span className="bg-green-500 px-2 py-1 rounded-md mr-1">Bright</span>
              <span>TV</span>
            </div>
          )}
          {decodedUrl ? (
            <iframe
              src={decodedUrl}
              title={decodedItemName}
              className="w-full border-0 rounded-b-lg"
              style={{ height: iframeHeight }} // Use dynamic height
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-presentation allow-same-origin"
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg p-4 font-bold">
              {t("common.no_url_selected_view")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewPlatformPage;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories'; // Import categories data
import { ArrowLeft } from 'lucide-react';

const AllInOnePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedItemUrl(null); // Reset selected item when a new category is chosen
    setSelectedItemName(null);
  };

  const handleItemClick = (item: CategoryItem) => {
    setSelectedItemUrl(item.url);
    setSelectedItemName(item.name);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItemUrl(null);
    setSelectedItemName(null);
  };

  const handleBackToCategoryItems = () => {
    setSelectedItemUrl(null);
    setSelectedItemName(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Card className="w-full lg:w-1/3 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedCategory ? (
              <Button variant="ghost" onClick={handleBackToCategories} className="p-0 h-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ক্যাটাগরি
              </Button>
            ) : (
              "ক্যাটাগরি"
            )}
          </CardTitle>
          {selectedCategory && selectedItemUrl && (
            <Button variant="ghost" onClick={handleBackToCategoryItems} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedCategory.name}
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
            {!selectedCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                {allInOneCategories.map((category) => (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center text-center p-2"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span className="font-semibold text-base">{category.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                {selectedCategory.items.map((item, index) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-left flex flex-col items-start h-auto py-2"
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="font-semibold text-base">{item.name}</span>
                    <span className="text-sm text-muted-foreground text-left truncate w-full">{item.url}</span>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle>{selectedItemName || (selectedCategory ? selectedCategory.name : "ওয়েবসাইট বিবরণ")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedItemUrl ? (
            <iframe
              src={selectedItemUrl}
              title={selectedItemName || "নির্বাচিত ওয়েবসাইট"}
              className="w-full h-[calc(100vh-200px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-presentation allow-orientation-lock"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {selectedCategory ? "একটি ওয়েবসাইট নির্বাচন করুন" : "একটি ক্যাটাগরি নির্বাচন করুন"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllInOnePage;
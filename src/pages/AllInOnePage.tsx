import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories';
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

  // State 1: Displaying Categories (Full Page)
  if (!selectedCategory && !selectedItemUrl) {
    return (
      <Card className="w-full flex flex-col h-full">
        <CardHeader>
          <CardTitle>ক্যাটাগরি</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-160px)] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // State 2: Displaying Items within a Category (Full Page)
  if (selectedCategory && !selectedItemUrl) {
    return (
      <Card className="w-full flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Button variant="ghost" onClick={handleBackToCategories} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedCategory.name}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-160px)] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {selectedCategory.items.map((item) => (
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
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // State 3: Displaying the Iframe Viewer (Full Page)
  if (selectedItemUrl) {
    return (
      <Card className="w-full flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Button variant="ghost" onClick={handleBackToCategoryItems} className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedItemName || "ওয়েবসাইট বিবরণ"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <iframe
            src={selectedItemUrl}
            title={selectedItemName || "নির্বাচিত ওয়েবসাইট"}
            className="w-full h-[calc(100vh-160px)] border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-presentation allow-orientation-lock"
          />
        </CardContent>
      </Card>
    );
  }

  return null; // Fallback, though should not be reached with current logic
};

export default AllInOnePage;
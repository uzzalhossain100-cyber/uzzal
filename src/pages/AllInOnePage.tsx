import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { allInOneCategories, Category, Item } from '@/data/all-in-one-data';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';

const AllInOnePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedItem(null); // Reset selected item when a new category is chosen
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const handleBackToItems = () => {
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-4">
      <Card className="w-full lg:w-1/3 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBackToCategories}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Categories</span>
              </Button>
              <CardTitle>{selectedCategory.name}</CardTitle>
            </div>
          ) : (
            <CardTitle>All In One</CardTitle>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-md border p-4">
            {selectedCategory ? (
              // Display items for the selected category
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedCategory.items.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-28 text-center p-2"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon ? <item.icon className="h-6 w-6 mb-2 text-primary" /> : <LinkIcon className="h-6 w-6 mb-2 text-primary" />}
                    <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">{item.description}</span>
                  </Button>
                ))}
              </div>
            ) : (
              // Display main categories
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allInOneCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-28 text-center p-2"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <category.icon className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-semibold text-sm line-clamp-2">{category.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{selectedItem ? selectedItem.name : "ওয়েবসাইট ভিউয়ার"}</CardTitle>
          {selectedItem && (
            <Button variant="ghost" size="sm" onClick={handleBackToItems}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              ফিরে যান
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedItem ? (
            <iframe
              src={selectedItem.url}
              title={selectedItem.name}
              className="w-full h-[calc(100vh-180px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-presentation allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
              বাম পাশ থেকে একটি ক্যাটাগরি এবং তারপর একটি আইটেম নির্বাচন করুন।
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllInOnePage;
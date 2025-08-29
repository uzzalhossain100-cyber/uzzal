import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories.ts';
import { ArrowLeft, ExternalLink } from 'lucide-react'; // Added ExternalLink icon

const AllInOnePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleItemClick = (item: CategoryItem) => {
    window.open(item.url, '_blank'); // Open link in a new tab
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // State 1: Displaying Categories
  if (!selectedCategory) {
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

  // State 2: Displaying Items within a Category
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
                <span className="text-sm text-muted-foreground text-left truncate w-full flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1" /> {item.url}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AllInOnePage;
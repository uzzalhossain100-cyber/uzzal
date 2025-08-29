import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories.ts';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCategoryClick = (category: Category) => {
    if (category.internalRoute) {
      navigate(category.internalRoute); // Navigate to internal route if specified
    } else {
      setSelectedCategory(category);
    }
  };

  const handleItemClick = (item: CategoryItem) => {
    window.open(item.url, '_blank');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // State 1: Displaying Categories
  if (!selectedCategory) {
    return (
      <Card className="w-full flex flex-col h-full bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-xl border-primary/20">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-center text-primary dark:text-primary-foreground">
            সমস্ত ক্যাটাগরি
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allInOneCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    className={cn(
                      "h-32 flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-md transition-all duration-200",
                      "bg-card text-foreground border-primary/30 hover:bg-primary/10 hover:border-primary",
                      "dark:bg-card dark:text-foreground dark:border-primary/50 dark:hover:bg-primary/20 dark:hover:border-primary"
                    )}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {Icon && <Icon className="h-12 w-12 mb-2 text-primary dark:text-primary-foreground" />}
                    <span className="font-bold text-lg">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // State 2: Displaying Items within a Category
  return (
    <Card className="w-full flex flex-col h-full bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-xl border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
          <Button variant="ghost" onClick={handleBackToCategories} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          {selectedCategory.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-6">
        <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {selectedCategory.items?.map((item) => ( // Use optional chaining for items
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left flex flex-col items-start h-auto py-3 px-4 rounded-lg shadow-sm transition-all duration-200",
                  "bg-card text-foreground border border-primary/20 hover:bg-primary/10 hover:border-primary",
                  "dark:bg-card dark:text-foreground dark:border-primary/30 dark:hover:bg-primary/20 dark:hover:border-primary"
                )}
                onClick={() => handleItemClick(item)}
              >
                <span className="font-semibold text-base flex items-center mb-1 text-primary dark:text-primary-foreground">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground text-left truncate w-full flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" /> <span className="truncate">{item.url}</span>
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Index;
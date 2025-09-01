import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories.ts';
import { ArrowLeft, ExternalLink, Newspaper as NewspaperIcon, Globe, Tv, GraduationCap, BookOpen, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a set of vibrant gradient colors for top-level categories
const categoryGradientColors = [
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-yellow-500 to-orange-600",
  "from-pink-500 to-red-600",
  "from-indigo-500 to-violet-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-fuchsia-600",
  "from-emerald-500 to-lime-600",
  "from-orange-500 to-red-700",
  "from-purple-500 to-pink-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-yellow-600",
  "from-teal-500 to-green-600",
  "from-red-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
];

// Define a set of slightly different gradient colors for sub-categories (countries) and items
const itemGradientColors = [
  "from-gray-700 to-gray-800", // Darker for contrast
  "from-blue-600 to-blue-700",
  "from-green-600 to-green-700",
  "from-yellow-600 to-yellow-700",
  "from-red-600 to-red-700",
  "from-purple-600 to-purple-700",
  "from-indigo-600 to-indigo-700",
  "from-pink-600 to-pink-700",
  "from-teal-600 to-teal-700",
  "from-orange-600 to-orange-700",
];


const Index: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory'); // For countries within News/Live TV/Education/Entertainment

  const currentCategory = categoryParam
    ? allInOneCategories.find(cat => cat.name === categoryParam)
    : null;

  const currentSubCategoryItems = (currentCategory?.name === "খবর" || currentCategory?.name === "লাইভ টিভি" || currentCategory?.name === "শিক্ষা" || currentCategory?.name === "বিনোদন") && subCategoryParam
    ? currentCategory.items?.find(item => item.name === subCategoryParam)?.subItems
    : null;

  const handleCategoryClick = (category: Category) => {
    if (category.internalRoute) {
      navigate(category.internalRoute);
    } else {
      setSearchParams({ category: category.name }); // Update URL param
    }
  };

  const handleItemClick = (item: CategoryItem) => {
    if ((currentCategory?.name === "খবর" || currentCategory?.name === "লাইভ টিভি" || currentCategory?.name === "শিক্ষা" || currentCategory?.name === "বিনোদন") && item.subItems) {
      // If it's a country within "খবর", "লাইভ টিভি", "শিক্ষা" or "বিনোদন" category
      setSearchParams({ category: currentCategory.name, subCategory: item.name });
    } else if (item.url) {
      // If it's a final item with a URL (e.g., a newspaper, TV channel, educational site, or entertainment site)
      const encodedUrl = encodeURIComponent(item.url);
      const encodedItemName = encodeURIComponent(item.name);
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
    }
  };

  const handleBack = () => {
    if (subCategoryParam) {
      // If currently viewing sub-items (newspapers/TV channels/educational sites/entertainment sites), go back to countries
      setSearchParams({ category: categoryParam || '' });
    } else if (categoryParam) {
      // If currently viewing countries or a regular category, go back to all categories
      setSearchParams({});
    }
  };

  // State 1: Displaying Top-Level Categories
  if (!currentCategory) {
    return (
      <Card className="w-full flex flex-col h-full shadow-xl border-primary/20"> {/* Removed bg-gradient-to-br classes */}
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-center text-primary dark:text-primary-foreground">
            সমস্ত ক্যাটাগরি
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allInOneCategories.map((category, index) => {
                const Icon = category.icon;
                const gradientClass = categoryGradientColors[index % categoryGradientColors.length];
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    className={cn(
                      "h-32 flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-md transition-all duration-200",
                      `bg-gradient-to-br ${gradientClass} text-white border-none hover:scale-105 transform`, // Apply gradient and white text
                      "hover:shadow-lg", // Add hover shadow
                    )}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {Icon && <Icon className="h-12 w-12 mb-2 text-white" />} {/* Icon color white */}
                    <span className="font-extrabold text-xl tracking-wide">{category.name}</span> {/* Attractive text style */}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // State 2: Displaying Countries for "খবর", "লাইভ টিভি", "শিক্ষা" or "বিনোদন"
  if ((currentCategory.name === "খবর" || currentCategory.name === "লাইভ টিভি" || currentCategory.name === "শিক্ষা" || currentCategory.name === "বিনোদন") && !subCategoryParam) {
    // Determine icon based on category
    let CountryIcon: React.ElementType;
    let titleSuffix: string;

    if (currentCategory.name === "খবর") {
      CountryIcon = Globe;
      titleSuffix = "দেশ নির্বাচন করুন";
    } else if (currentCategory.name === "লাইভ টিভি") {
      CountryIcon = Tv;
      titleSuffix = "দেশ নির্বাচন করুন";
    } else if (currentCategory.name === "শিক্ষা") {
      CountryIcon = GraduationCap;
      titleSuffix = "দেশ নির্বাচন করুন";
    } else { // currentCategory.name === "বিনোদন"
      CountryIcon = Film; // Specific icon for entertainment country selection
      titleSuffix = "দেশ নির্বাচন করুন";
    }

    return (
      <Card className="w-full flex flex-col h-full shadow-xl border-primary/20"> {/* Removed bg-gradient-to-br classes */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {currentCategory.name} - {titleSuffix}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentCategory.items?.map((country, index) => {
                const gradientClass = itemGradientColors[index % itemGradientColors.length]; // Use item colors
                return (
                  <Button
                    key={country.name}
                    variant="outline"
                    className={cn(
                      "h-32 flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-md transition-all duration-200",
                      `bg-gradient-to-br ${gradientClass} text-white border-none hover:scale-105 transform`, // Apply gradient and white text
                      "hover:shadow-lg", // Add hover shadow
                    )}
                    onClick={() => handleItemClick(country)}
                  >
                    <CountryIcon className="h-12 w-12 mb-2 text-white" /> {/* Icon color white */}
                    <span className="font-extrabold text-xl tracking-wide">{country.name}</span> {/* Attractive text style */}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // State 3: Displaying Newspapers/TV Channels/Educational Sites/Entertainment Sites for a selected country
  let itemsToDisplay: CategoryItem[] | undefined = [];

  if ((currentCategory.name === "খবর" || currentCategory.name === "লাইভ টিভি" || currentCategory.name === "শিক্ষা" || currentCategory.name === "বিনোদন") && subCategoryParam) {
    itemsToDisplay = currentSubCategoryItems;
    if (currentCategory.name === "লাইভ টিভি" && itemsToDisplay) {
      let allInOneTvUrl = "https://tv.garden/"; // Default URL
      if (subCategoryParam === "বাংলাদেশ") {
        allInOneTvUrl = "https://tv.garden/bd/NikPw9VKIQ0CfQ";
      } else if (subCategoryParam === "ভারত") {
        allInOneTvUrl = "https://tv.garden/in/A75lVEYwDx8Emp";
      } else if (subCategoryParam === "যুক্তরাজ্য") {
        allInOneTvUrl = "https://tv.garden/uk/g1kSsRGdu6pjqO";
      } else if (subCategoryParam === "যুক্তরাষ্ট্র") {
        allInOneTvUrl = "https://tv.garden/us/1vLEWY7mhnX4hE";
      } else if (subCategoryParam === "কানাডা") {
        allInOneTvUrl = "https://tv.garden/ca/uBUxokoZzvdGBC";
      } else if (subCategoryParam === "অস্ট্রেলিয়া") {
        allInOneTvUrl = "https://tv.garden/au/1U3UtAxYHSHl5p";
      }
      // Prepend "All In One TV" with the dynamic URL
      itemsToDisplay = [{ name: "All In One TV", url: allInOneTvUrl }, ...itemsToDisplay];
    }
  } else {
    itemsToDisplay = currentCategory.items;
  }

  let titleText: string;
  if (currentCategory.name === "খবর" && subCategoryParam) {
    titleText = `${subCategoryParam} - সংবাদপত্র`;
  } else if (currentCategory.name === "লাইভ টিভি" && subCategoryParam) {
    titleText = `${subCategoryParam} - টেলিভিশন`;
  } else if (currentCategory.name === "শিক্ষা" && subCategoryParam) {
    titleText = `${subCategoryParam} - শিক্ষা বিষয়ক ওয়েবসাইট`;
  } else if (currentCategory.name === "বিনোদন" && subCategoryParam) {
    titleText = `${subCategoryParam} - বিনোদন বিষয়ক ওয়েবসাইট`;
  } else {
    titleText = currentCategory.name;
  }

  return (
    <Card className="w-full flex flex-col h-full shadow-xl border-primary/20"> {/* Removed bg-gradient-to-br classes */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
          <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          {titleText}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-6">
        <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {itemsToDisplay?.map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left flex flex-col items-start h-auto py-3 px-4 rounded-lg shadow-sm transition-all duration-200",
                  `bg-gradient-to-br ${itemGradientColors[index % itemGradientColors.length]} text-white border-none hover:scale-105 transform`, // Apply gradient and white text
                  "hover:shadow-lg", // Add hover shadow
                )}
                onClick={() => handleItemClick(item)}
              >
                <span className="font-extrabold text-lg flex items-center mb-1 text-white"> {/* Attractive text style */}
                  {item.name}
                </span>
                {/* Removed the URL display */}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Index;
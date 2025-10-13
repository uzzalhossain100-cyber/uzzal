import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories.ts';
import { countryFlags } from '@/data/countryFlags'; // Import countryFlags
import { ArrowLeft, ExternalLink, Newspaper as NewspaperIcon, Globe, Tv, GraduationCap, BookOpen, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

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

// Define a new set of more vibrant, multi-color gradients for country selection buttons
const countryButtonGradients = [
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-cyan-500 to-green-500",
  "from-yellow-500 via-orange-500 to-red-500",
  "from-teal-500 via-emerald-500 to-blue-500",
  "from-indigo-500 via-violet-500 to-purple-500",
  "from-pink-500 via-rose-500 to-orange-500",
  "from-green-500 via-lime-500 to-yellow-500",
  "from-red-500 via-orange-500 to-yellow-500",
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-fuchsia-500 via-purple-500 to-pink-500",
  "from-lime-500 via-green-500 to-teal-500",
  "from-orange-400 via-amber-500 to-yellow-500",
  "from-sky-400 via-blue-400 to-indigo-400",
  "from-rose-400 via-pink-400 to-purple-400",
  "from-emerald-400 via-green-400 to-cyan-400",
];

// Define a set of slightly different gradient colors for sub-categories (items)
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
  const { t } = useTranslation(); // Initialize useTranslation

  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory'); // For countries within News/Live TV/Education/Entertainment

  const currentCategory = categoryParam
    ? allInOneCategories.find(cat => t(cat.name) === categoryParam) // Translate category name for comparison
    : null;

  const currentSubCategoryItems = (currentCategory?.name === "category.news" || currentCategory?.name === "category.live_tv" || currentCategory?.name === "category.education" || currentCategory?.name === "category.entertainment") && subCategoryParam
    ? currentCategory.items?.find(item => t(item.name) === subCategoryParam)?.subItems // Translate item name for comparison
    : null;

  const handleCategoryClick = (category: Category) => {
    if (category.internalRoute) {
      navigate(category.internalRoute);
    } else {
      setSearchParams({ category: t(category.name) }); // Update URL param with translated name
    }
  };

  const handleItemClick = (item: CategoryItem) => {
    if (item.internalRoute) { // Handle internal routes for sub-items first
      navigate(item.internalRoute);
    } else if ((currentCategory?.name === "category.news" || currentCategory?.name === "category.live_tv" || currentCategory?.name === "category.education" || currentCategory?.name === "category.entertainment") && item.subItems) {
      // If it's a country within "খবর", "লাইভ টিভি", "শিক্ষা" or "বিনোদন" category
      setSearchParams({ category: t(currentCategory.name), subCategory: t(item.name) }); // Update URL param with translated names
    } else if (item.url) {
      // If it's a final item with a URL (e.g., a newspaper, TV channel, educational site, or entertainment site)
      const encodedUrl = encodeURIComponent(item.url);
      const encodedItemName = encodeURIComponent(t(item.name)); // Translate item name for URL
      navigate(`/view/${encodedUrl}/${encodedItemName}`, {
        state: {
          fromCategory: categoryParam,
          fromSubCategory: subCategoryParam,
        }
      });
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
      <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-xl border-primary/20"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-center text-primary dark:text-primary-foreground">
            {t("common.all_categories")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Use a shallow copy here to prevent any potential mutation issues */}
              {[...allInOneCategories]
                .filter(category => category.name.startsWith("category.")) // Filter to ensure only actual categories are displayed
                .map((category, index) => {
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
                    {Icon && <Icon className="h-12 w-12 mb-2 text-white text-shadow-sm" />} {/* Icon color white */}
                    <span className="font-extrabold text-xl tracking-wide text-shadow-sm">{t(category.name)}</span> {/* Attractive text style */}
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
  if ((currentCategory.name === "category.news" || currentCategory.name === "category.live_tv" || currentCategory.name === "category.education" || currentCategory.name === "category.entertainment") && !subCategoryParam) {
    // Determine icon based on category
    let CountryIcon: React.ElementType;
    let titleSuffix: string;

    if (currentCategory.name === "category.news") {
      CountryIcon = Globe;
      titleSuffix = t("common.select_country");
    } else if (currentCategory.name === "category.live_tv") {
      CountryIcon = Tv;
      titleSuffix = t("common.select_country");
    } else if (currentCategory.name === "category.education") {
      CountryIcon = GraduationCap;
      titleSuffix = t("common.select_country");
    } else { // currentCategory.name === "category.entertainment"
      CountryIcon = Film; // Specific icon for entertainment country selection
      titleSuffix = t("common.select_country");
    }

    return (
      <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-xl border-primary/20"> {/* Added bg-background/80 backdrop-blur-sm */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {t(currentCategory.name)} - {titleSuffix}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentCategory.items?.map((country, index) => {
                const gradientClass = countryButtonGradients[index % countryButtonGradients.length]; // Use new vibrant gradients
                return (
                  <Button
                    key={country.name}
                    variant="outline"
                    className={cn(
                      "group h-32 flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-md transition-all duration-200 relative overflow-hidden",
                      "text-white border-none hover:scale-105 transform", // Apply white text
                      "hover:shadow-lg", // Add hover shadow
                      `bg-gradient-to-br ${gradientClass}`, // Always apply gradient
                    )}
                    onClick={() => handleItemClick(country)}
                  >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
                    <CountryIcon className="h-12 w-12 mb-2 text-white relative z-10 text-shadow-sm" /> {/* Icon color white */}
                    <span className="font-extrabold text-xl tracking-wide relative z-10 text-shadow-sm">{t(country.name)}</span> {/* Attractive text style */}
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

  if ((currentCategory.name === "category.news" || currentCategory.name === "category.live_tv" || currentCategory.name === "category.education" || currentCategory.name === "category.entertainment") && subCategoryParam) {
    itemsToDisplay = currentSubCategoryItems;
    if (currentCategory.name === "category.live_tv" && itemsToDisplay) {
      let allInOneTvUrl = "https://tv.garden/"; // Default URL
      if (subCategoryParam === t("country.bangladesh")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/bd/NikPw9VKIQ0CfQ";
      } else if (subCategoryParam === t("country.india")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/in/A75lVEYwDx8Emp";
      } else if (subCategoryParam === t("country.united_kingdom")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/uk/g1kSsRGdu6pjqO";
      } else if (subCategoryParam === t("country.united_states")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/us/1vLEWY7mhnX4hE";
      } else if (subCategoryParam === t("country.canada")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/ca/uBUxokoZzvdGBC";
      } else if (subCategoryParam === t("country.australia")) { // Compare with translated name
        allInOneTvUrl = "https://tv.garden/au/1U3UtAxYHSHl5p";
      }
      // Prepend "All In One TV" with the dynamic URL
      itemsToDisplay = [{ name: "item.all_in_one_tv", url: allInOneTvUrl }, ...itemsToDisplay];
    }
  } else {
    itemsToDisplay = currentCategory.items;
  }

  let titleText: string;
  if (currentCategory.name === "category.news" && subCategoryParam) {
    titleText = `${subCategoryParam} - ${t("common.newspapers")}`;
  } else if (currentCategory.name === "category.live_tv" && subCategoryParam) {
    titleText = `${subCategoryParam} - ${t("common.television")}`;
  } else if (currentCategory.name === "category.education" && subCategoryParam) {
    titleText = `${subCategoryParam} - ${t("common.educational_websites")}`;
  } else if (currentCategory.name === "category.entertainment" && subCategoryParam) {
    titleText = `${subCategoryParam} - ${t("common.entertainment_websites")}`;
  } else {
    titleText = t(currentCategory.name);
  }

  return (
    <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-xl border-primary/20"> {/* Added bg-background/80 backdrop-blur-sm */}
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
                <span className="font-extrabold text-lg flex items-center mb-1 text-white text-shadow-sm"> {/* Attractive text style */}
                  {t(item.name)}
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
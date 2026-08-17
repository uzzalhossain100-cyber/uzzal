import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allInOneCategories, Category, CategoryItem } from '@/data/categories.ts';
import { ArrowLeft, Globe, Tv, GraduationCap, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';
import { AppDownloadSection } from '@/components/AppDownloadSection';

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
  "from-gray-700 to-gray-800",
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
  const { t } = useTranslation();

  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const currentCategory = categoryParam
    ? allInOneCategories.find(cat => cat.name === categoryParam)
    : null;

  const currentSubCategoryItems = (currentCategory?.name === "category.news" || currentCategory?.name === "category.live_tv" || currentCategory?.name === "category.education" || currentCategory?.name === "category.entertainment") && subCategoryParam
    ? currentCategory.items?.find(item => item.name === subCategoryParam)?.subItems
    : null;

  const handleCategoryClick = (category: Category) => {
    if (category.internalRoute) {
      navigate(category.internalRoute);
    } else {
      setSearchParams({ category: category.name });
    }
  };

  const handleItemClick = (item: CategoryItem) => {
    if (item.internalRoute) {
      navigate(item.internalRoute);
    } else if ((currentCategory?.name === "category.news" || currentCategory?.name === "category.live_tv" || currentCategory?.name === "category.education" || currentCategory?.name === "category.entertainment") && item.subItems) {
      setSearchParams({ category: currentCategory.name, subCategory: item.name });
    } else if (item.url) {
      const encodedUrl = encodeURIComponent(item.url);
      const encodedItemName = encodeURIComponent(t(item.name));
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
      setSearchParams({ category: categoryParam || '' });
    } else if (categoryParam) {
      setSearchParams({});
    }
  };

  // State 1: Displaying Top-Level Categories (Home Page)
  if (!currentCategory) {
    return (
      <div className="flex flex-col gap-6 w-full pb-10">
        <Card className="w-full flex flex-col bg-background/80 backdrop-blur-sm shadow-xl border-primary/20">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-3xl font-extrabold text-center text-primary dark:text-primary-foreground">
              {t("common.all_categories")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {[...allInOneCategories]
                .filter(category => category.name.startsWith("category."))
                .map((category, index) => {
                  const Icon = category.icon;
                  const gradientClass = categoryGradientColors[index % categoryGradientColors.length];
                  return (
                    <Button
                      key={category.name}
                      variant="outline"
                      className={cn(
                        "h-28 sm:h-32 flex flex-col items-center justify-center text-center p-3 rounded-2xl shadow-md transition-all duration-200",
                        `bg-gradient-to-br ${gradientClass} text-white border-none hover:scale-105 transform`,
                        "hover:shadow-xl",
                      )}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {Icon && <Icon className="h-8 w-8 sm:h-10 sm:w-10 mb-1.5 text-white text-shadow-sm" />}
                      <span className="font-extrabold text-sm sm:text-base tracking-wide text-shadow-sm line-clamp-1">{t(category.name)}</span>
                    </Button>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Mobile App Download & QR Code Section at Bottom of Home Page */}
        <AppDownloadSection />
      </div>
    );
  }

  // State 2: Displaying Countries for "খবর", "লাইভ টিভি", "শিক্ষা" or "বিনোদন"
  if ((currentCategory.name === "category.news" || currentCategory.name === "category.live_tv" || currentCategory.name === "category.education" || currentCategory.name === "category.entertainment") && !subCategoryParam) {
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
    } else {
      CountryIcon = Film;
      titleSuffix = t("common.select_country");
    }

    return (
      <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-xl border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {t(currentCategory.name)} - {titleSuffix}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
          <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {currentCategory.items?.map((country, index) => {
                const gradientClass = countryButtonGradients[index % countryButtonGradients.length];
                return (
                  <Button
                    key={country.name}
                    variant="outline"
                    className={cn(
                      "group h-28 sm:h-32 flex flex-col items-center justify-center text-center p-3 rounded-2xl shadow-md transition-all duration-200 relative overflow-hidden",
                      "text-white border-none hover:scale-105 transform",
                      "hover:shadow-lg",
                      `bg-gradient-to-br ${gradientClass}`,
                    )}
                    onClick={() => handleItemClick(country)}
                  >
                    <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
                    <CountryIcon className="h-8 w-8 sm:h-10 sm:w-10 mb-1.5 text-white relative z-10 text-shadow-sm" />
                    <span className="font-extrabold text-sm sm:text-base tracking-wide relative z-10 text-shadow-sm">{t(country.name)}</span>
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
      let allInOneTvUrl = "https://tv.garden/";
      if (subCategoryParam === "country.bangladesh") {
        allInOneTvUrl = "https://tv.garden/bd/NikPw9VKIQ0CfQ";
      } else if (subCategoryParam === "country.india") {
        allInOneTvUrl = "https://tv.garden/in/A75lVEYwDx8Emp";
      } else if (subCategoryParam === "country.united_kingdom") {
        allInOneTvUrl = "https://tv.garden/uk/g1kSsRGdu6pjqO";
      } else if (subCategoryParam === "country.united_states") {
        allInOneTvUrl = "https://tv.garden/us/1vLEWY7mhnX4hE";
      } else if (subCategoryParam === "country.canada") {
        allInOneTvUrl = "https://tv.garden/ca/uBUxokoZzvdGBC";
      } else if (subCategoryParam === "country.australia") {
        allInOneTvUrl = "https://tv.garden/au/1U3UtAxYHSHl5p";
      }
      itemsToDisplay = [{ name: "item.all_in_one_tv", url: allInOneTvUrl }, ...itemsToDisplay];
    }
  } else {
    itemsToDisplay = currentCategory.items;
  }

  let titleText: string;
  if (currentCategory.name === "category.news" && subCategoryParam) {
    titleText = `${t(subCategoryParam)} - ${t("common.newspapers")}`;
  } else if (currentCategory.name === "category.live_tv" && subCategoryParam) {
    titleText = `${t(subCategoryParam)} - ${t("common.television")}`;
  } else if (currentCategory.name === "category.education" && subCategoryParam) {
    titleText = `${t(subCategoryParam)} - ${t("common.educational_websites")}`;
  } else if (currentCategory.name === "category.entertainment" && subCategoryParam) {
    titleText = `${t(subCategoryParam)} - ${t("common.entertainment_websites")}`;
  } else {
    titleText = t(currentCategory.name);
  }

  return (
    <Card className="w-full flex flex-col h-full bg-background/80 backdrop-blur-sm shadow-xl border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
          <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          {titleText}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
        <ScrollArea className="h-[calc(100vh-180px)] w-full rounded-xl border-2 border-primary/20 bg-background/80 p-4 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {itemsToDisplay?.map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left flex flex-col items-start h-auto py-3 px-4 rounded-xl shadow-sm transition-all duration-200",
                  `bg-gradient-to-br ${itemGradientColors[index % itemGradientColors.length]} text-white border-none hover:scale-105 transform`,
                  "hover:shadow-lg",
                )}
                onClick={() => handleItemClick(item)}
              >
                <span className="font-extrabold text-base flex items-center mb-1 text-white text-shadow-sm">
                  {t(item.name)}
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
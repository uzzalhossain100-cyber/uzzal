import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Ruler, Weight, Thermometer, Clock, DollarSign, Languages, FileText, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface ConverterType {
  id: string;
  nameKey: string; // Use translation key for name
  icon: React.ElementType;
  descriptionKey: string; // Use translation key for description
}

const ConverterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize useTranslation
  const [selectedConverter, setSelectedConverter] = useState<string | null>(null);

  const converterTypes: ConverterType[] = [
    { id: 'length', nameKey: 'common.length', icon: Ruler, descriptionKey: 'common.length_desc' },
    { id: 'weight', nameKey: 'common.weight', icon: Weight, descriptionKey: 'common.weight_desc' },
    { id: 'temperature', nameKey: 'common.temperature', icon: Thermometer, descriptionKey: 'common.temperature_desc' },
    { id: 'time', nameKey: 'common.time', icon: Clock, descriptionKey: 'common.time_desc' },
    { id: 'currency', nameKey: 'common.currency', icon: DollarSign, descriptionKey: 'common.currency' }, // Description can be same as name for external links
    { id: 'language', nameKey: 'common.language_converter', icon: Languages, descriptionKey: 'common.language_converter' },
    { id: 'unitConverter', nameKey: 'common.unit_converter', icon: Calculator, descriptionKey: 'common.unit_converter' },
    { id: 'fileFormat', nameKey: 'common.file_format_converter', icon: FileText, descriptionKey: 'common.file_format_converter' },
  ];

  // State for Length Converter
  const [lengthValue, setLengthValue] = useState<string>('');
  const [fromLengthUnit, setFromLengthUnit] = useState<string>('meter');
  const [toLengthUnit, setToLengthUnit] = useState<string>('foot');
  const [convertedLength, setConvertedLength] = useState<string>('');

  // State for Weight Converter
  const [weightValue, setWeightValue] = useState<string>('');
  const [fromWeightUnit, setFromWeightUnit] = useState<string>('kilogram');
  const [toWeightUnit, setToWeightUnit] = useState<string>('pound');
  const [convertedWeight, setConvertedWeight] = useState<string>('');

  // State for Temperature Converter
  const [tempValue, setTempValue] = useState<string>('');
  const [fromTempUnit, setFromTempUnit] = useState<string>('celsius');
  const [toTempUnit, setToTempUnit] = useState<string>('fahrenheit');
  const [convertedTemp, setConvertedTemp] = useState<string>('');

  // State for Time Converter
  const [timeValue, setTimeValue] = useState<string>('');
  const [fromTimeUnit, setFromTimeUnit] = useState<string>('second');
  const [toTimeUnit, setToTimeUnit] = useState<string>('minute');
  const [convertedTime, setConvertedTime] = useState<string>('');

  // Effect to handle navigation for external converters
  useEffect(() => {
    if (selectedConverter === 'currency') {
      const encodedUrl = encodeURIComponent("https://www.xe.com/currencyconverter/");
      const encodedItemName = encodeURIComponent(t("common.currency"));
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    } else if (selectedConverter === 'language') {
      const encodedUrl = encodeURIComponent("https://translate.google.com/");
      const encodedItemName = encodeURIComponent(t("common.language_converter"));
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    } else if (selectedConverter === 'unitConverter') {
      const encodedUrl = encodeURIComponent("https://www.unitconverters.net/");
      const encodedItemName = encodeURIComponent(t("common.unit_converter"));
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    } else if (selectedConverter === 'fileFormat') { // New handler for File Format Converter
      const encodedUrl = encodeURIComponent("https://www.pdf2go.com/");
      const encodedItemName = encodeURIComponent(t("common.file_format_converter"));
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    }
  }, [selectedConverter, navigate, t]);

  const handleBack = () => {
    if (selectedConverter) {
      setSelectedConverter(null); // Go back to converter selection
      // Reset individual converter states when going back to selection grid
      setLengthValue(''); setConvertedLength('');
      setWeightValue(''); setConvertedWeight('');
      setTempValue(''); setConvertedTemp('');
      setTimeValue(''); setConvertedTime('');
    } else {
      navigate(-1); // Go back to previous page (Index)
    }
  };

  // Conversion Logic
  const convertLength = () => {
    const value = parseFloat(lengthValue);
    if (isNaN(value)) {
      setConvertedLength(t('common.invalid_input'));
      return;
    }

    let meters = 0;
    if (fromLengthUnit === 'meter') meters = value;
    else if (fromLengthUnit === 'kilometer') meters = value * 1000;
    else if (fromLengthUnit === 'foot') meters = value * 0.3048;
    else if (fromLengthUnit === 'mile') meters = value * 1609.34;

    let result = 0;
    if (toLengthUnit === 'meter') result = meters;
    else if (toLengthUnit === 'kilometer') result = meters / 1000;
    else if (toLengthUnit === 'foot') result = meters / 0.3048;
    else if (toLengthUnit === 'mile') result = meters / 1609.34;

    setConvertedLength(result.toFixed(4));
  };

  const convertWeight = () => {
    const value = parseFloat(weightValue);
    if (isNaN(value)) {
      setConvertedWeight(t('common.invalid_input'));
      return;
    }

    let grams = 0;
    if (fromWeightUnit === 'kilogram') grams = value * 1000;
    else if (fromWeightUnit === 'gram') grams = value;
    else if (fromWeightUnit === 'pound') grams = value * 453.592;
    else if (fromWeightUnit === 'ounce') grams = value * 28.3495;

    let result = 0;
    if (toWeightUnit === 'kilogram') result = grams / 1000;
    else if (toWeightUnit === 'gram') result = grams;
    else if (toWeightUnit === 'pound') result = grams / 453.592;
    else if (toWeightUnit === 'ounce') result = grams / 28.3495;

    setConvertedWeight(result.toFixed(4));
  };

  const convertTemperature = () => {
    const value = parseFloat(tempValue);
    if (isNaN(value)) {
      setConvertedTemp(t('common.invalid_input'));
      return;
    }

    let result = 0;
    if (fromTempUnit === 'celsius' && toTempUnit === 'fahrenheit') {
      result = (value * 9 / 5) + 32;
    } else if (fromTempUnit === 'fahrenheit' && toTempUnit === 'celsius') {
      result = (value - 32) * 5 / 9;
    } else {
      result = value; // Same unit
    }
    setConvertedTemp(result.toFixed(2));
  };

  const convertTime = () => {
    const value = parseFloat(timeValue);
    if (isNaN(value)) {
      setConvertedTime(t('common.invalid_input'));
      return;
    }

    let seconds = 0;
    if (fromTimeUnit === 'second') seconds = value;
    else if (fromTimeUnit === 'minute') seconds = value * 60;
    else if (fromTimeUnit === 'hour') seconds = value * 3600;
    else if (fromTimeUnit === 'day') seconds = value * 86400;

    let result = 0;
    if (toTimeUnit === 'second') result = seconds;
    else if (toTimeUnit === 'minute') result = seconds / 60;
    else if (toTimeUnit === 'hour') result = seconds / 3600;
    else if (toTimeUnit === 'day') result = seconds / 86400;

    setConvertedTime(result.toFixed(4));
  };

  const getTranslatedUnit = (unit: string) => {
    switch (unit) {
      case 'meter': return t('common.meters');
      case 'kilometer': return t('common.kilometers');
      case 'foot': return t('common.feet');
      case 'mile': return t('common.miles');
      case 'kilogram': return t('common.kilograms');
      case 'gram': return t('common.grams');
      case 'pound': return t('common.pounds');
      case 'ounce': return t('common.ounces');
      case 'celsius': return t('common.celsius');
      case 'fahrenheit': return t('common.fahrenheit');
      case 'second': return t('common.seconds');
      case 'minute': return t('common.minutes');
      case 'hour': return t('common.hours');
      case 'day': return t('common.days');
      default: return unit;
    }
  };

  const renderConverter = () => {
    switch (selectedConverter) {
      case 'length':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Ruler className="h-5 w-5 mr-2" /> {t('common.length')}</CardTitle>
              <CardDescription>{t('common.length_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="length-value">{t('common.value')}</Label>
                  <Input
                    id="length-value"
                    type="number"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(e.target.value)}
                    placeholder={t('common.enter_value')}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-length-unit">{t('common.from')}</Label>
                  <Select value={fromLengthUnit} onValueChange={setFromLengthUnit}>
                    <SelectTrigger id="from-length-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meter">{t('common.meters')}</SelectItem>
                      <SelectItem value="kilometer">{t('common.kilometers')}</SelectItem>
                      <SelectItem value="foot">{t('common.feet')}</SelectItem>
                      <SelectItem value="mile">{t('common.miles')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-length-unit">{t('common.to')}</Label>
                  <Select value={toLengthUnit} onValueChange={setToLengthUnit}>
                    <SelectTrigger id="to-length-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meter">{t('common.meters')}</SelectItem>
                      <SelectItem value="kilometer">{t('common.kilometers')}</SelectItem>
                      <SelectItem value="foot">{t('common.feet')}</SelectItem>
                      <SelectItem value="mile">{t('common.miles')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertLength} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t('common.convert')}</Button>
              {convertedLength && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  {t('common.result')}: {convertedLength} {getTranslatedUnit(toLengthUnit)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'weight':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Weight className="h-5 w-5 mr-2" /> {t('common.weight')}</CardTitle>
              <CardDescription>{t('common.weight_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="weight-value">{t('common.value')}</Label>
                  <Input
                    id="weight-value"
                    type="number"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    placeholder={t('common.enter_value')}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-weight-unit">{t('common.from')}</Label>
                  <Select value={fromWeightUnit} onValueChange={setFromWeightUnit}>
                    <SelectTrigger id="from-weight-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilogram">{t('common.kilograms')}</SelectItem>
                      <SelectItem value="gram">{t('common.grams')}</SelectItem>
                      <SelectItem value="pound">{t('common.pounds')}</SelectItem>
                      <SelectItem value="ounce">{t('common.ounces')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-weight-unit">{t('common.to')}</Label>
                  <Select value={toWeightUnit} onValueChange={setToWeightUnit}>
                    <SelectTrigger id="to-weight-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilogram">{t('common.kilograms')}</SelectItem>
                      <SelectItem value="gram">{t('common.grams')}</SelectItem>
                      <SelectItem value="pound">{t('common.pounds')}</SelectItem>
                      <SelectItem value="ounce">{t('common.ounces')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertWeight} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t('common.convert')}</Button>
              {convertedWeight && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  {t('common.result')}: {convertedWeight} {getTranslatedUnit(toWeightUnit)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'temperature':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Thermometer className="h-5 w-5 mr-2" /> {t('common.temperature')}</CardTitle>
              <CardDescription>{t('common.temperature_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="temp-value">{t('common.value')}</Label>
                  <Input
                    id="temp-value"
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={t('common.enter_value')}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-temp-unit">{t('common.from')}</Label>
                  <Select value={fromTempUnit} onValueChange={setFromTempUnit}>
                    <SelectTrigger id="from-temp-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">{t('common.celsius')}</SelectItem>
                      <SelectItem value="fahrenheit">{t('common.fahrenheit')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-temp-unit">{t('common.to')}</Label>
                  <Select value={toTempUnit} onValueChange={setToTempUnit}>
                    <SelectTrigger id="to-temp-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">{t('common.celsius')}</SelectItem>
                      <SelectItem value="fahrenheit">{t('common.fahrenheit')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertTemperature} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t('common.convert')}</Button>
              {convertedTemp && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  {t('common.result')}: {convertedTemp} {getTranslatedUnit(toTempUnit)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'time':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Clock className="h-5 w-5 mr-2" /> {t('common.time')}</CardTitle>
              <CardDescription>{t('common.time_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="time-value">{t('common.value')}</Label>
                  <Input
                    id="time-value"
                    type="number"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    placeholder={t('common.enter_value')}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-time-unit">{t('common.from')}</Label>
                  <Select value={fromTimeUnit} onValueChange={setFromTimeUnit}>
                    <SelectTrigger id="from-time-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="second">{t('common.seconds')}</SelectItem>
                      <SelectItem value="minute">{t('common.minutes')}</SelectItem>
                      <SelectItem value="hour">{t('common.hours')}</SelectItem>
                      <SelectItem value="day">{t('common.days')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-time-unit">{t('common.to')}</Label>
                  <Select value={toTimeUnit} onValueChange={setToTimeUnit}>
                    <SelectTrigger id="to-time-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder={t('common.select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="second">{t('common.seconds')}</SelectItem>
                      <SelectItem value="minute">{t('common.minutes')}</SelectItem>
                      <SelectItem value="hour">{t('common.hours')}</SelectItem>
                      <SelectItem value="day">{t('common.days')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertTime} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t('common.convert')}</Button>
              {convertedTime && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  {t('common.result')}: {convertedTime} {getTranslatedUnit(toTimeUnit)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="w-full flex flex-col flex-1 bg-background/80 backdrop-blur-sm shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {t('common.converter_page_title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">{t('common.converter_page_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
            {!selectedConverter ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {converterTypes.map((converter, index) => {
                  const Icon = converter.icon;
                  const gradientColors = [
                    "from-blue-500 to-purple-600",
                    "from-green-500 to-teal-600",
                    "from-yellow-500 to-orange-600",
                    "from-pink-500 to-red-600",
                    "from-indigo-500 to-violet-600",
                    "from-cyan-500 to-blue-600",
                    "from-rose-500 to-fuchsia-600", // Added more gradients for variety
                  ];
                  const gradientClass = gradientColors[index % gradientColors.length];

                  return (
                    <Button
                      key={converter.id}
                      variant="outline"
                      className={cn(
                        "h-32 flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-md transition-all duration-200",
                        `bg-gradient-to-br ${gradientClass} text-white border-none hover:scale-105 transform`,
                        "hover:shadow-lg",
                      )}
                      onClick={() => setSelectedConverter(converter.id)}
                    >
                      {Icon && <Icon className="h-12 w-12 mb-2 text-white text-shadow-sm" />}
                      <span className="font-extrabold text-xl tracking-wide text-shadow-sm">{t(converter.nameKey)}</span>
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-6">
                {renderConverter()}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConverterPage;
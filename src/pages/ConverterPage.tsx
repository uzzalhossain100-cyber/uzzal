import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Ruler, Weight, Thermometer, Clock, DollarSign, Languages, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ConverterType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const converterTypes: ConverterType[] = [
  { id: 'length', name: 'দৈর্ঘ্য', icon: Ruler, description: 'মিটার, কিলোমিটার, ফুট, মাইল' },
  { id: 'weight', name: 'ওজন', icon: Weight, description: 'কিলোগ্রাম, গ্রাম, পাউন্ড, আউন্স' },
  { id: 'temperature', name: 'তাপমাত্রা', icon: Thermometer, description: 'সেলসিয়াস, ফারেনহাইট' },
  { id: 'time', name: 'সময়', icon: Clock, description: 'সেকেন্ড, মিনিট, ঘণ্টা, দিন' },
  { id: 'currency', name: 'মুদ্রা', icon: DollarSign, description: 'এক দেশের মুদ্রা থেকে অন্য দেশের মুদ্রায় রূপান্তর' },
  { id: 'language', name: 'ভাষা পরিবর্তন', icon: Languages, description: 'সকল দেশের ভাষা পরিবর্তন বা কনভার্ট করা যাবে' },
  { id: 'fileFormat', name: 'ফাইল ফরম্যাট কনভার্টার', icon: FileText, description: 'MP4, AVI, MKV, JPEG, PNG, DOCX, PDF' },
];

const ConverterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConverter, setSelectedConverter] = useState<string | null>(null);

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
      const encodedItemName = encodeURIComponent("মুদ্রা রূপান্তর");
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    } else if (selectedConverter === 'language') {
      const encodedUrl = encodeURIComponent("https://translate.google.com/");
      const encodedItemName = encodeURIComponent("ভাষা পরিবর্তন");
      navigate(`/view/${encodedUrl}/${encodedItemName}`);
      setSelectedConverter(null); // Reset to show grid when returning
    }
  }, [selectedConverter, navigate]);

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
      setConvertedLength('অবৈধ ইনপুট');
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
      setConvertedWeight('অবৈধ ইনপুট');
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
      setConvertedTemp('অবৈধ ইনপুট');
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
      setConvertedTime('অবৈধ ইনপুট');
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

  const handleFileFormatConversion = () => {
    toast.info("ফাইল ফরম্যাট রূপান্তরের জন্য একটি ব্যাকএন্ড পরিষেবা প্রয়োজন। এই ফিচারটি বর্তমানে উপলব্ধ নয়।");
  };

  const renderConverter = () => {
    switch (selectedConverter) {
      case 'length':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Ruler className="h-5 w-5 mr-2" /> দৈর্ঘ্য</CardTitle>
              <CardDescription>মিটার, কিলোমিটার, ফুট, মাইল</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="length-value">মান</Label>
                  <Input
                    id="length-value"
                    type="number"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(e.target.value)}
                    placeholder="মান লিখুন"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-length-unit">থেকে</Label>
                  <Select value={fromLengthUnit} onValueChange={setFromLengthUnit}>
                    <SelectTrigger id="from-length-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meter">মিটার</SelectItem>
                      <SelectItem value="kilometer">কিলোমিটার</SelectItem>
                      <SelectItem value="foot">ফুট</SelectItem>
                      <SelectItem value="mile">মাইল</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-length-unit">তে</Label>
                  <Select value={toLengthUnit} onValueChange={setToLengthUnit}>
                    <SelectTrigger id="to-length-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meter">মিটার</SelectItem>
                      <SelectItem value="kilometer">কিলোমিটার</SelectItem>
                      <SelectItem value="foot">ফুট</SelectItem>
                      <SelectItem value="mile">মাইল</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertLength} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">রূপান্তর করুন</Button>
              {convertedLength && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  ফল: {convertedLength} {toLengthUnit === 'meter' ? 'মিটার' : toLengthUnit === 'kilometer' ? 'কিলোমিটার' : toLengthUnit === 'foot' ? 'ফুট' : 'মাইল'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'weight':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Weight className="h-5 w-5 mr-2" /> ওজন</CardTitle>
              <CardDescription>কিলোগ্রাম, গ্রাম, পাউন্ড, আউন্স</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="weight-value">মান</Label>
                  <Input
                    id="weight-value"
                    type="number"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    placeholder="মান লিখুন"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-weight-unit">থেকে</Label>
                  <Select value={fromWeightUnit} onValueChange={setFromWeightUnit}>
                    <SelectTrigger id="from-weight-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilogram">কিলোগ্রাম</SelectItem>
                      <SelectItem value="gram">গ্রাম</SelectItem>
                      <SelectItem value="pound">পাউন্ড</SelectItem>
                      <SelectItem value="ounce">আউন্স</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-weight-unit">তে</Label>
                  <Select value={toWeightUnit} onValueChange={setToWeightUnit}>
                    <SelectTrigger id="to-weight-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilogram">কিলোগ্রাম</SelectItem>
                      <SelectItem value="gram">গ্রাম</SelectItem>
                      <SelectItem value="pound">পাউন্ড</SelectItem>
                      <SelectItem value="ounce">আউন্স</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertWeight} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">রূপান্তর করুন</Button>
              {convertedWeight && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  ফল: {convertedWeight} {toWeightUnit === 'kilogram' ? 'কিলোগ্রাম' : toWeightUnit === 'gram' ? 'গ্রাম' : toWeightUnit === 'pound' ? 'পাউন্ড' : 'আউন্স'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'temperature':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Thermometer className="h-5 w-5 mr-2" /> তাপমাত্রা</CardTitle>
              <CardDescription>সেলসিয়াস, ফারেনহাইট</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="temp-value">মান</Label>
                  <Input
                    id="temp-value"
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="মান লিখুন"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-temp-unit">থেকে</Label>
                  <Select value={fromTempUnit} onValueChange={setFromTempUnit}>
                    <SelectTrigger id="from-temp-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">সেলসিয়াস</SelectItem>
                      <SelectItem value="fahrenheit">ফারেনহাইট</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-temp-unit">তে</Label>
                  <Select value={toTempUnit} onValueChange={setToTempUnit}>
                    <SelectTrigger id="to-temp-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">সেলসিয়াস</SelectItem>
                      <SelectItem value="fahrenheit">ফারেনহাইট</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertTemperature} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">রূপান্তর করুন</Button>
              {convertedTemp && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  ফল: {convertedTemp} {toTempUnit === 'celsius' ? 'সেলসিয়াস' : 'ফারেনহাইট'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'time':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><Clock className="h-5 w-5 mr-2" /> সময়</CardTitle>
              <CardDescription>সেকেন্ড, মিনিট, ঘণ্টা, দিন</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="time-value">মান</Label>
                  <Input
                    id="time-value"
                    type="number"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    placeholder="মান লিখুন"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-time-unit">থেকে</Label>
                  <Select value={fromTimeUnit} onValueChange={setFromTimeUnit}>
                    <SelectTrigger id="from-time-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="second">সেকেন্ড</SelectItem>
                      <SelectItem value="minute">মিনিট</SelectItem>
                      <SelectItem value="hour">ঘণ্টা</SelectItem>
                      <SelectItem value="day">দিন</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-time-unit">তে</Label>
                  <Select value={toTimeUnit} onValueChange={setToTimeUnit}>
                    <SelectTrigger id="to-time-unit" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ইউনিট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="second">সেকেন্ড</SelectItem>
                      <SelectItem value="minute">মিনিট</SelectItem>
                      <SelectItem value="hour">ঘণ্টা</SelectItem>
                      <SelectItem value="day">দিন</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertTime} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">রূপান্তর করুন</Button>
              {convertedTime && (
                <div className="mt-2 text-center text-lg font-extrabold text-foreground">
                  ফল: {convertedTime} {toTimeUnit === 'second' ? 'সেকেন্ড' : toTimeUnit === 'minute' ? 'মিনিট' : toTimeUnit === 'hour' ? 'ঘণ্টা' : 'দিন'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'fileFormat':
        return (
          <Card className="bg-background/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-extrabold flex items-center"><FileText className="h-5 w-5 mr-2" /> ফাইল ফরম্যাট কনভার্টার</CardTitle>
              <CardDescription>MP4, AVI, MKV, JPEG, PNG, DOCX, PDF</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="file-upload">ফাইল আপলোড করুন</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="border-primary/30 focus-visible:ring-primary"
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-file-format">থেকে</Label>
                  <Select disabled>
                    <SelectTrigger id="from-file-format" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ফরম্যাট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                      <SelectItem value="mkv">MKV</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-file-format">তে</Label>
                  <Select disabled>
                    <SelectTrigger id="to-file-format" className="border-primary/30 focus-visible:ring-primary">
                      <SelectValue placeholder="ফরম্যাট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                      <SelectItem value="mkv">MKV</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleFileFormatConversion} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold" disabled>রূপান্তর করুন</Button>
              <p className="text-sm text-muted-foreground text-center font-bold">
                দ্রষ্টব্য: ফাইল ফরম্যাট রূপান্তরের জন্য একটি ব্যাকএন্ড পরিষেবা প্রয়োজন।
              </p>
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
            কনভার্টার
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">বিভিন্ন ইউনিট এবং ফরম্যাট রূপান্তর করুন</CardDescription>
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
                      <span className="font-extrabold text-xl tracking-wide text-shadow-sm">{converter.name}</span>
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
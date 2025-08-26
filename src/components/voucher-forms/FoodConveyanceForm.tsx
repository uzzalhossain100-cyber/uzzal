import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FoodConveyanceVoucher, VoucherType } from '@/types/voucher';
import { PlusIcon, MinusIcon } from 'lucide-react';

const foodConveyanceDetailSchema = z.object({
  foodDate: z.string().optional(),
  travelDate: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  description: z.string().optional(),
  purpose: z.string().min(1, { message: "উদ্দেশ্য লিখুন।" }),
  vehicle: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "সঠিক টাকার পরিমাণ লিখুন।" }).transform(Number),
});

const formSchema = z.object({
  organization: z.string().min(1, { message: "প্রতিষ্ঠান নির্বাচন করুন।" }),
  forWhom: z.string().min(1, { message: "কাহার জন্য নির্বাচন করুন।" }),
  pinName: z.string().min(1, { message: "পিন ও নাম লিখুন।" }),
  details: z.array(foodConveyanceDetailSchema).min(1, { message: "কমপক্ষে একটি বিবরণ যোগ করুন।" }),
});

interface FoodConveyanceFormProps {
  voucherType: 'খাওয়া দাওয়া ভাউচার' | 'যাতায়াত ভাউচার';
  onSubmit: (data: Omit<FoodConveyanceVoucher, 'voucherNumber' | 'submissionDate' | 'status' | 'type' | 'creatorInfo'>) => void;
  onCancel: () => void;
}

const FoodConveyanceForm: React.FC<FoodConveyanceFormProps> = ({ voucherType, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      forWhom: "",
      pinName: "",
      details: [{ amount: 0, purpose: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const forWhom = form.watch("forWhom");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const totalAmount = values.details.reduce((sum, detail) => sum + detail.amount, 0);
    onSubmit({
      organization: values.organization,
      branch: 'N/A', // Hidden in original, default to N/A
      forWhom: values.forWhom,
      pinName: values.pinName,
      details: values.details,
      amount: totalAmount.toFixed(2),
    });
  };

  const getDetailFields = (index: number) => {
    if (voucherType === 'খাওয়া দাওয়া ভাউচার') {
      return (
        <>
          <FormField
            control={form.control}
            name={`details.${index}.foodDate`}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel className="text-black">খাওয়া-দাওয়ার তারিখ:</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel className="text-black">বিবরণ:</FormLabel>
                <FormControl>
                  <Input placeholder="বিবরণ লিখুন" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.purpose`}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel className="text-black">উদ্দেশ্য:</FormLabel>
                <FormControl>
                  <Input placeholder="উদ্দেশ্য লিখুন" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-0.5 min-w-[100px]">
                <FormLabel className="text-black">টাকার পরিমাণ:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="টাকার পরিমাণ"
                    className="bg-white text-black"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    } else { // Conveyance Voucher
      return (
        <>
          <FormField
            control={form.control}
            name={`details.${index}.travelDate`}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel className="text-black">ভ্রমণের তারিখ:</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.from`}
            render={({ field }) => (
              <FormItem className="flex-0.6 min-w-[100px]">
                <FormLabel className="text-black">হইতে:</FormLabel>
                <FormControl>
                  <Input placeholder="কোথায় থেকে" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.to`}
            render={({ field }) => (
              <FormItem className="flex-0.6 min-w-[100px]">
                <FormLabel className="text-black">পর্যন্ত:</FormLabel>
                <FormControl>
                  <Input placeholder="কোথায় পর্যন্ত" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.purpose`}
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel className="text-black">উদ্দেশ্য:</FormLabel>
                <FormControl>
                  <Input placeholder="উদ্দেশ্য লিখুন" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.vehicle`}
            render={({ field }) => (
              <FormItem className="flex-0.6 min-w-[100px]">
                <FormLabel className="text-black">বাহন:</FormLabel>
                <FormControl>
                  <Input placeholder="বাহনের নাম" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-0.1 min-w-[80px]">
                <FormLabel className="text-black">টাকার পরিমাণ:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="টাকার পরিমাণ"
                    className="bg-white text-black"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">প্রতিষ্ঠান নির্বাচন করুন:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="প্রতিষ্ঠানের নাম নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="বগুড়া উদ্ভাস">বগুড়া উদ্ভাস</SelectItem>
                  <SelectItem value="বগুড়া উন্মেষ">বগুড়া উন্মেষ</SelectItem>
                  <SelectItem value="উত্তরণ">উত্তরণ</SelectItem>
                  <SelectItem value="অনলাইন কেয়ার">অনলাইন কেয়ার</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="forWhom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">কাহার জন্য:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="পদ নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="স্টাফ">স্টাফ</SelectItem>
                    <SelectItem value="টিচার">টিচার</SelectItem>
                    <SelectItem value="পরিচালক">পরিচালক</SelectItem>
                    <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pinName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  {forWhom === 'অন্যান্য' ? 'নাম লিখুন:' : 'পিন ও নাম দিন:'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={forWhom === 'অন্যান্য' ? 'নাম লিখুন' : 'পিন ও নাম লিখুন'}
                    className="bg-white text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-black text-lg font-semibold">বিস্তারিত বিবরণ:</Label>
          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-wrap gap-4 items-end border-t pt-4 border-gray-300">
              {getDetailFields(index)}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => append({ amount: 0, purpose: "" })}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-200 text-black hover:bg-gray-300">
            বাতিল করুন
          </Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
            সাবমিট
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FoodConveyanceForm;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditVoucher } from '@/types/voucher';

const formSchema = z.object({
  organization: z.string().min(1, { message: "প্রতিষ্ঠান নির্বাচন করুন।" }),
  creditDate: z.string().min(1, { message: "তারিখ নির্বাচন করুন।" }),
  fromWhom: z.string().min(1, { message: "কাহার নিকট হতে লিখুন।" }),
  creditAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "সঠিক টাকার পরিমাণ লিখুন।" }).transform(Number),
  description: z.string().min(1, { message: "বিস্তারিত বিবরণ লিখুন।" }),
  paymentOption: z.enum(['cash', 'bank'], { message: "পেমেন্ট অপশন নির্বাচন করুন।" }),
  bankName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentOption === 'bank' && !data.bankName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ব্যাংক নির্বাচন করুন।",
      path: ['bankName'],
    });
  }
});

interface CreditVoucherFormProps {
  onSubmit: (data: Omit<CreditVoucher, 'voucherNumber' | 'submissionDate' | 'status' | 'type' | 'creatorInfo' | 'amount'> & { amount: number }) => void;
  onCancel: () => void;
}

const CreditVoucherForm: React.FC<CreditVoucherFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      creditDate: "",
      fromWhom: "",
      creditAmount: 0,
      description: "",
      paymentOption: undefined,
      bankName: "",
    },
  });

  const paymentOption = form.watch("paymentOption");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      organization: values.organization,
      branch: 'N/A', // Hidden in original, default to N/A
      date: values.creditDate,
      fromWhom: values.fromWhom,
      amount: values.creditAmount,
      description: values.description,
      paymentOption: values.paymentOption,
      bankName: values.paymentOption === 'bank' ? values.bankName : undefined,
    });
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="creditDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">তারিখ:</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fromWhom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">কাহার নিকট হতে:</FormLabel>
                <FormControl>
                  <Input placeholder="কাহার নিকট হতে" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditAmount"
            render={({ field }) => (
              <FormItem>
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">বিস্তারিত বিবরণ লিখুন:</FormLabel>
              <FormControl>
                <Textarea placeholder="বিস্তারিত বিবরণ লিখুন..." rows={6} className="bg-white text-black resize-y" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentOption"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-black">পেমেন্ট অপশন:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4 credit-payment-options"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="cash" id="payment-cash-option" className="accent-gray-500 data-[state=checked]:accent-green-500" />
                    </FormControl>
                    <FormLabel htmlFor="payment-cash-option" className="font-normal text-black data-[state=checked]:text-green-500 data-[state=checked]:font-bold">
                      ক্যাশ
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="bank" id="payment-bank-option" className="accent-gray-500 data-[state=checked]:accent-green-500" />
                    </FormControl>
                    <FormLabel htmlFor="payment-bank-option" className="font-normal text-black data-[state=checked]:text-green-500 data-[state=checked]:font-bold">
                      ব্যাংক
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentOption === 'bank' && (
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">ব্যাংক নির্বাচন করুন:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white text-black">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="উদ্ভাস সাউথইস্ট ব্যাংক">উদ্ভাস সাউথইস্ট ব্যাংক</SelectItem>
                    <SelectItem value="উন্মেষ সাউথইস্ট ব্যাংক">উন্মেষ সাউথইস্ট ব্যাংক</SelectItem>
                    <SelectItem value="উদ্ভাস ইসলামী ব্যাংক">উদ্ভাস ইসলামী ব্যাংক</SelectItem>
                    <SelectItem value="উন্মেষ ইসলামী ব্যাংক">উন্মেষ ইসলামী ব্যাংক</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

export default CreditVoucherForm;
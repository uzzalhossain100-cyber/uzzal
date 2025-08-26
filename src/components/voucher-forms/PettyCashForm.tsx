import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PettyCashVoucher } from '@/types/voucher';

const formSchema = z.object({
  organization: z.string().min(1, { message: "প্রতিষ্ঠান নির্বাচন করুন।" }),
  pettyCashAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "সঠিক টাকার পরিমাণ লিখুন।" }).transform(Number),
  pettyCashReason: z.string().min(1, { message: "পেটিক্যাশ নেওয়ার কারণ লিখুন।" }),
  reconciliationDate: z.string().min(1, { message: "সমন্বয়ের সম্ভব্য তারিখ নির্বাচন করুন।" }),
});

interface PettyCashFormProps {
  onSubmit: (data: Omit<PettyCashVoucher, 'voucherNumber' | 'submissionDate' | 'status' | 'type' | 'creatorInfo' | 'amount'> & { amount: number }) => void;
  onCancel: () => void;
}

const PettyCashForm: React.FC<PettyCashFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      pettyCashAmount: 0,
      pettyCashReason: "",
      reconciliationDate: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      organization: values.organization,
      branch: 'N/A', // Hidden in original, default to N/A
      reason: values.pettyCashReason,
      reconciliationDate: values.reconciliationDate,
      amount: values.pettyCashAmount,
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

        {/* Branch selection is hidden in original, keeping it out for now */}
        {/* <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel className="text-black">শাখা নির্বাচন করুন:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="শাখার নাম নির্বাচন করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="ফার্মগেট">ফার্মগেট</SelectItem>
                  <SelectItem value="মতিঝিল">মতিঝিল</SelectItem>
                  <SelectItem value="শান্তিনগর">শান্তিনগর</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="pettyCashAmount"
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

        <FormField
          control={form.control}
          name="pettyCashReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">পেটিক্যাশ নেওয়ার কারণ:</FormLabel>
              <FormControl>
                <Input placeholder="কারণ লিখুন" className="bg-white text-black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reconciliationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">পেটিক্যাশ সমন্বয়ের সম্ভব্য তারিখ:</FormLabel>
              <FormControl>
                <Input type="date" className="bg-white text-black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default PettyCashForm;
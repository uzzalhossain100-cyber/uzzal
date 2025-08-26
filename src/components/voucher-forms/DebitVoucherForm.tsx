import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DebitVoucher } from '@/types/voucher';
import { PlusIcon, MinusIcon } from 'lucide-react';

const formSchema = z.object({
  organization: z.string().min(1, { message: "প্রতিষ্ঠান নির্বাচন করুন।" }),
  expenseDate: z.string().min(1, { message: "ব্যয়ের তারিখ নির্বাচন করুন।" }),
  paidTo: z.string().min(1, { message: "Paid To লিখুন।" }),
  debitVoucherAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "সঠিক টাকার পরিমাণ লিখুন।" }).transform(Number),
  details: z.array(
    z.object({
      description: z.string().min(1, { message: "বিবরণ লিখুন।" }),
      purpose: z.string().min(1, { message: "উদ্দেশ্য লিখুন।" }),
    })
  ).min(1, { message: "কমপক্ষে একটি বিবরণ ও উদ্দেশ্য যোগ করুন।" }),
});

interface DebitVoucherFormProps {
  onSubmit: (data: Omit<DebitVoucher, 'voucherNumber' | 'submissionDate' | 'status' | 'type' | 'creatorInfo' | 'amount'> & { amount: number }) => void;
  onCancel: () => void;
}

const DebitVoucherForm: React.FC<DebitVoucherFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      expenseDate: "",
      paidTo: "",
      debitVoucherAmount: 0,
      details: [{ description: "", purpose: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      organization: values.organization,
      branch: 'N/A', // Hidden in original, default to N/A
      paidTo: values.paidTo,
      details: values.details.map(detail => ({ ...detail, expenseDate: values.expenseDate })), // Add expenseDate to each detail
      amount: values.debitVoucherAmount,
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
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">ব্যয়ের তারিখ:</FormLabel>
                <FormControl>
                  <Input type="date" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paidTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Paid To:</FormLabel>
                <FormControl>
                  <Input placeholder="Paid To" className="bg-white text-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="debitVoucherAmount"
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

        <div className="space-y-4">
          <Label className="text-black text-lg font-semibold">বিবরণ ও উদ্দেশ্য:</Label>
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-t pt-4 border-gray-300">
              <FormField
                control={form.control}
                name={`details.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">বিবরণ লিখুন:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="বিবরণ লিখুন" rows={4} className="bg-white text-black resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`details.${index}.purpose`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">উদ্দেশ্য লিখুন:</FormLabel>
                    <FormControl>
                      <Textarea placeholder="উদ্দেশ্য লিখুন" rows={4} className="bg-white text-black resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-full flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => append({ description: "", purpose: "" })}
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

export default DebitVoucherForm;
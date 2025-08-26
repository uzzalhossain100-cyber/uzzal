import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVoucherColorClass, getVoucherColor } from '@/lib/voucher-utils';
import { VoucherType } from '@/types/voucher';
import PettyCashForm from '@/components/voucher-forms/PettyCashForm';
import CreditVoucherForm from '@/components/voucher-forms/CreditVoucherForm';
import DebitVoucherForm from '@/components/voucher-forms/DebitVoucherForm';
import FoodConveyanceForm from '@/components/voucher-forms/FoodConveyanceForm';
import { useVouchers } from '@/hooks/useVouchers';

const voucherTypes: VoucherType[] = [
  'খাওয়া দাওয়া ভাউচার',
  'যাতায়াত ভাউচার',
  'ডেবিট ভাউচার',
  'পেটিক্যাশ স্লিপ',
  'ক্রেডিট ভাউচার',
  'জার্নাল ভাউচার',
  'কন্ট্রা ভাউচার',
];

const VoucherEntryPage = () => {
  const [selectedVoucherType, setSelectedVoucherType] = useState<VoucherType | null>(null);
  const { addVoucher, loggedInUser } = useVouchers();

  const renderVoucherForm = () => {
    if (!selectedVoucherType) return null;

    const commonProps = {
      onSubmit: (data: any) => {
        addVoucher(data, selectedVoucherType, loggedInUser);
        setSelectedVoucherType(null); // Reset form after submission
      },
      onCancel: () => setSelectedVoucherType(null),
    };

    switch (selectedVoucherType) {
      case 'পেটিক্যাশ স্লিপ':
        return <PettyCashForm {...commonProps} />;
      case 'ক্রেডিট ভাউচার':
        return <CreditVoucherForm {...commonProps} />;
      case 'ডেবিট ভাউচার':
        return <DebitVoucherForm {...commonProps} />;
      case 'খাওয়া দাওয়া ভাউচার':
      case 'যাতায়াত ভাউচার':
        return <FoodConveyanceForm voucherType={selectedVoucherType} {...commonProps} />;
      case 'জার্নাল ভাউচার':
      case 'কন্ট্রা ভাউচার':
        return (
          <div className="text-center p-8 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700">
              {selectedVoucherType} এর জন্য ফর্ম এখনো তৈরি হয়নি।
            </h3>
            <Button onClick={() => setSelectedVoucherType(null)} className="mt-4">
              অন্য ভাউচার নির্বাচন করুন
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!selectedVoucherType && (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md mb-8">
          {voucherTypes.map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedVoucherType(type)}
              className={cn(
                "px-6 py-3 text-base font-bold border rounded-md transition-colors",
                getVoucherColorClass(type)
              )}
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      {selectedVoucherType && (
        <div
          className="w-full max-w-3xl p-6 rounded-lg shadow-xl text-black"
          style={{ backgroundColor: getVoucherColor(selectedVoucherType) }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {selectedVoucherType}
          </h2>
          {renderVoucherForm()}
        </div>
      )}
    </div>
  );
};

export default VoucherEntryPage;
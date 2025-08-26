import { useState, useEffect, useCallback } from 'react';
import { getVouchers, saveVouchers, generateVoucherNumber, getTodayDate } from '@/lib/voucher-utils';
import { Voucher, VoucherStatus, VoucherType, UserInfo } from '@/types/voucher';
import { toast } from 'sonner';

interface UseVouchersReturn {
  vouchers: Voucher[];
  addVoucher: (newVoucher: Omit<Voucher, 'voucherNumber' | 'submissionDate' | 'status'>, type: VoucherType, creatorInfo: UserInfo) => void;
  updateVoucherStatus: (voucherNumber: string, newStatus: VoucherStatus, reason?: string, paymentDetails?: { cashAmount: number; pettyCashAmount: number; paymentBranch: string }) => void;
  getVoucherByNumber: (voucherNumber: string) => Voucher | undefined;
  loggedInUser: UserInfo;
  voucherCreator: UserInfo; // Example data, replace with actual user data
}

export const useVouchers = (): UseVouchersReturn => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // Example hardcoded user data
  const loggedInUser: UserInfo = {
    name: 'আব্দুর রহিম',
    pin: '12345',
    designation: 'অ্যাকাউন্টস অফিসার',
    organization: 'ফার্মগেট উদ্ভাস',
  };

  const voucherCreator: UserInfo = {
    name: 'আবু তাহের',
    pin: '2222',
    designation: 'শাখা হিসাবরক্ষক',
    organization: 'বগুড়া উদ্ভাস',
  };

  useEffect(() => {
    setVouchers(getVouchers());
  }, []);

  const addVoucher = useCallback((
    newVoucherData: Omit<Voucher, 'voucherNumber' | 'submissionDate' | 'status' | 'creatorInfo'>,
    type: VoucherType,
    creatorInfo: UserInfo
  ) => {
    const voucherNumber = generateVoucherNumber(type);
    const submissionDate = getTodayDate();
    const status: VoucherStatus = 'submitted';

    const fullVoucher: Voucher = {
      ...newVoucherData,
      voucherNumber,
      submissionDate,
      type,
      status,
      creatorInfo,
      amount: parseFloat(newVoucherData.amount).toFixed(2), // Ensure amount is formatted
    } as Voucher; // Type assertion for now, will refine with specific types later

    setVouchers((prevVouchers) => {
      const updatedVouchers = [...prevVouchers, fullVoucher];
      saveVouchers(updatedVouchers);
      return updatedVouchers;
    });
    toast.success(`ভাউচার ${voucherNumber} সফলভাবে সাবমিট করা হয়েছে!`);
  }, []);

  const updateVoucherStatus = useCallback((
    voucherNumber: string,
    newStatus: VoucherStatus,
    reason?: string,
    paymentDetails?: { cashAmount: number; pettyCashAmount: number; paymentBranch: string }
  ) => {
    setVouchers((prevVouchers) => {
      const voucherIndex = prevVouchers.findIndex((v) => v.voucherNumber === voucherNumber);
      if (voucherIndex === -1) {
        toast.error('ভাউচার খুঁজে পাওয়া যায়নি!');
        return prevVouchers;
      }

      const updatedVouchers = [...prevVouchers];
      const voucherToUpdate = { ...updatedVouchers[voucherIndex] };

      if (newStatus === 'rejected' || newStatus === 'reverted') {
        if (!reason) {
          toast.error('কারণ না লিখলে এই অ্যাকশন সম্পন্ন করা যাবে না।');
          return prevVouchers;
        }
        toast.info(`ভাউচার ${voucherNumber} ${newStatus === 'rejected' ? 'প্রত্যাখ্যান' : 'ফিরিয়ে আনা'} হয়েছে। কারণ: ${reason}`);
        // For demo, remove rejected/reverted vouchers
        updatedVouchers.splice(voucherIndex, 1);
      } else {
        voucherToUpdate.status = newStatus;
        if (newStatus === 'approved_1st') {
          voucherToUpdate.approverInfo = loggedInUser; // Assign current user as approver
          toast.success(`ভাউচার ${voucherNumber} সফলভাবে প্রথম অ্যাপ্রুভ করা হয়েছে এবং পেমেন্টের জন্য পাঠানো হয়েছে।`);
        } else if (newStatus === 'approved_check') {
          voucherToUpdate.approverInfo = loggedInUser; // Assign current user as approver
          if (paymentDetails) {
            Object.assign(voucherToUpdate, paymentDetails); // Add payment details
          }
          toast.success(`ভাউচার ${voucherNumber} সফলভাবে অ্যাপ্রুভ করা হয়েছে।`);
        } else if (newStatus === 'paid') {
          voucherToUpdate.payerInfo = loggedInUser; // Assign current user as payer
          if (paymentDetails) {
            Object.assign(voucherToUpdate, paymentDetails); // Add payment details
          }
          toast.success(`ভাউচার ${voucherNumber} সফলভাবে পেমেন্ট করা হয়েছে।`);
        } else if (newStatus === 'forwarded') {
          toast.info(`ভাউচার ${voucherNumber} সফলভাবে ফরওয়ার্ড করা হয়েছে এবং পরবর্তী প্রক্রিয়ার জন্য বন্ধ করা হয়েছে।`);
          // For demo, remove forwarded vouchers from active lists
          updatedVouchers.splice(voucherIndex, 1);
        }
        updatedVouchers[voucherIndex] = voucherToUpdate;
      }

      saveVouchers(updatedVouchers);
      return updatedVouchers;
    });
  }, [loggedInUser]);

  const getVoucherByNumber = useCallback((voucherNumber: string): Voucher | undefined => {
    return vouchers.find((v) => v.voucherNumber === voucherNumber);
  }, [vouchers]);

  return {
    vouchers,
    addVoucher,
    updateVoucherStatus,
    getVoucherByNumber,
    loggedInUser,
    voucherCreator,
  };
};
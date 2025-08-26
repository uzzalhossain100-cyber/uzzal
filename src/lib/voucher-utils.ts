import { Voucher, VoucherStatus, VoucherType } from "@/types/voucher";

const VOUCHER_STORAGE_KEY = 'vouchers';

export const getVouchers = (): Voucher[] => {
  try {
    const storedVouchers = localStorage.getItem(VOUCHER_STORAGE_KEY);
    return storedVouchers ? JSON.parse(storedVouchers) : [];
  } catch (error) {
    console.error("Failed to parse vouchers from localStorage", error);
    return [];
  }
};

export const saveVouchers = (vouchers: Voucher[]): void => {
  try {
    localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(vouchers));
  } catch (error) {
    console.error("Failed to save vouchers to localStorage", error);
  }
};

export const generateVoucherNumber = (type: VoucherType): string => {
  const vouchers = getVouchers();
  const lastVoucher = vouchers.length > 0 ? vouchers[vouchers.length - 1] : null;
  const lastNumber = lastVoucher ? parseInt(lastVoucher.voucherNumber.split('-')[1]) : 0;
  const newNumber = lastNumber + 1;

  let prefix = "VOU";
  switch (type) {
    case 'পেটিক্যাশ স্লিপ':
      prefix = "PET";
      break;
    case 'ক্রেডিট ভাউচার':
      prefix = "CR";
      break;
    case 'ডেবিট ভাউচার':
      prefix = "DB";
      break;
    case 'খাওয়া দাওয়া ভাউচার':
      prefix = "FD";
      break;
    case 'যাতায়াত ভাউচার':
      prefix = "TR";
      break;
    case 'জার্নাল ভাউচার':
      prefix = "JR";
      break;
    case 'কন্ট্রা ভাউচার':
      prefix = "CT";
      break;
  }
  return `${prefix}-${String(newNumber).padStart(4, '0')}`;
};

export const getVoucherColorClass = (type: VoucherType): string => {
  switch (type) {
    case 'খাওয়া দাওয়া ভাউচার':
      return 'bg-blue-500 text-white';
    case 'যাতায়াত ভাউচার':
      return 'bg-yellow-500 text-black';
    case 'ডেবিট ভাউচার':
      return 'bg-white text-black border border-gray-300';
    case 'পেটিক্যাশ স্লিপ':
      return 'bg-orange-500 text-white';
    case 'ক্রেডিট ভাউচার':
    case 'জার্নাল ভাউচার':
    case 'কন্ট্রা ভাউচার':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-200 text-black';
  }
};

export const getVoucherColor = (type: VoucherType): string => {
  switch (type) {
    case 'খাওয়া দাওয়া ভাউচার':
      return '#007bff';
    case 'যাতায়াত ভাউচার':
      return '#ffc107';
    case 'ডেবিট ভাউচার':
      return '#ffffff';
    case 'পেটিক্যাশ স্লিপ':
      return '#ff5722';
    default:
      return '#6c757d';
  }
};

export const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};
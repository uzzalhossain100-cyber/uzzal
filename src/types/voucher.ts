export type VoucherStatus = 'submitted' | 'approved_1st' | 'approved_check' | 'paid' | 'rejected' | 'reverted' | 'forwarded';
export type VoucherType = 
  | 'খাওয়া দাওয়া ভাউচার' 
  | 'যাতায়াত ভাউচার' 
  | 'ডেবিট ভাউচার' 
  | 'পেটিক্যাশ স্লিপ' 
  | 'ক্রেডিট ভাউচার' 
  | 'জার্নাল ভাউচার' 
  | 'কন্ট্রা ভাউচার';

export interface BaseVoucher {
  voucherNumber: string;
  submissionDate: string;
  organization: string;
  branch: string;
  type: VoucherType;
  amount: string;
  status: VoucherStatus;
  creatorInfo?: {
    name: string;
    pin: string;
    designation: string;
    organization: string;
  };
  approverInfo?: {
    name: string;
    pin: string;
    designation: string;
    organization: string;
  };
  payerInfo?: {
    name: string;
    pin: string;
    designation: string;
    organization: string;
  };
}

export interface PettyCashVoucher extends BaseVoucher {
  type: 'পেটিক্যাশ স্লিপ';
  reason: string;
  reconciliationDate: string;
}

export interface FoodConveyanceDetail {
  foodDate?: string;
  travelDate?: string;
  from?: string;
  to?: string;
  purpose: string;
  description?: string;
  vehicle?: string;
  amount: number;
}

export interface FoodConveyanceVoucher extends BaseVoucher {
  type: 'খাওয়া দাওয়া ভাউচার' | 'যাতায়াত ভাউচার';
  forWhom: string;
  pinName: string;
  details: FoodConveyanceDetail[];
}

export interface DebitVoucherDetail {
  expenseDate: string;
  description: string;
  purpose: string;
}

export interface DebitVoucher extends BaseVoucher {
  type: 'ডেবিট ভাউচার';
  paidTo: string;
  details: DebitVoucherDetail[];
}

export interface CreditVoucher extends BaseVoucher {
  type: 'ক্রেডিট ভাউচার';
  date: string;
  fromWhom: string;
  description: string;
  paymentOption: 'cash' | 'bank';
  bankName?: string;
}

export type Voucher = PettyCashVoucher | FoodConveyanceVoucher | DebitVoucher | CreditVoucher;

export interface UserInfo {
  name: string;
  pin: string;
  designation: string;
  organization: string;
}
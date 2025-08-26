import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getVoucherColor } from '@/lib/voucher-utils';
import { CreditVoucher, DebitVoucher, FoodConveyanceVoucher, PettyCashVoucher, Voucher, UserInfo } from '@/types/voucher';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher;
  onProcessPayment: (
    action: 'approve' | 'reject' | 'revert',
    reason?: string,
    paymentDetails?: { cashAmount: number; pettyCashAmount: number; paymentBranch: string }
  ) => void;
  loggedInUser: UserInfo;
  voucherCreator: UserInfo;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onProcessPayment,
  loggedInUser,
  voucherCreator,
}) => {
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [pettyCashAmount, setPettyCashAmount] = useState<number>(0);
  const [paymentBranch, setPaymentBranch] = useState<string>('');

  React.useEffect(() => {
    if (voucher.type === 'পেটিক্যাশ স্লিপ') {
      setCashAmount(parseFloat(voucher.amount));
      setPettyCashAmount(0);
    } else {
      setCashAmount(0);
      setPettyCashAmount(0);
    }
    setPaymentBranch('');
  }, [voucher]);

  const handleAction = (action: 'approve' | 'reject' | 'revert') => {
    if (action === 'approve') {
      const totalVoucherAmount = parseFloat(voucher.amount);
      const totalPaymentAmount = cashAmount + pettyCashAmount;

      if (!paymentBranch) {
        toast.error('অনুগ্রহ করে শাখা নির্বাচন করুন।');
        return;
      }

      if (totalPaymentAmount.toFixed(2) !== totalVoucherAmount.toFixed(2)) {
        toast.error(`ক্যাশ এবং পেটিক্যাশ বাবদ মোট টাকার পরিমাণ (${totalPaymentAmount.toFixed(2)}) ভাউচারের মোট টাকার পরিমাণ (${totalVoucherAmount.toFixed(2)}) এর সমান হতে হবে।`);
        return;
      }

      onProcessPayment('approve', undefined, { cashAmount, pettyCashAmount, paymentBranch });
    } else {
      const reason = prompt('কারণ লিখুন:');
      if (reason) {
        onProcessPayment(action, reason);
      } else {
        toast.error('কারণ না লিখলে এই অ্যাকশন সম্পন্ন করা যাবে না।');
      }
    }
  };

  const renderVoucherDetails = () => {
    const commonFields = (
      <>
        <div className="form-column read-only">
          <Label>প্রতিষ্ঠানের নাম:</Label>
          <Input type="text" value={voucher.organization} readOnly />
        </div>
        <div className="form-column read-only hidden"> {/* Branch is hidden */}
          <Label>শাখার নাম:</Label>
          <Input type="text" value={voucher.branch} readOnly />
        </div>
      </>
    );

    switch (voucher.type) {
      case 'পেটিক্যাশ স্লিপ':
        const pettyCashVoucher = voucher as PettyCashVoucher;
        return (
          <>
            {commonFields}
            <div className="form-column read-only">
              <Label>পেটিক্যাশ নেওয়ার কারণ:</Label>
              <Input type="text" value={pettyCashVoucher.reason} readOnly />
            </div>
            <div className="form-column read-only">
              <Label>সমন্বয়ের সম্ভব্য তারিখ:</Label>
              <Input type="date" value={pettyCashVoucher.reconciliationDate} readOnly />
            </div>
          </>
        );
      case 'ক্রেডিট ভাউচার': // Credit vouchers should not appear on payment page
        return <p>এই ভাউচারের ধরন পেমেন্ট পেজে প্রদর্শিত হবে না।</p>;
      case 'ডেবিট ভাউচার':
        const debitVoucher = voucher as DebitVoucher;
        return (
          <>
            {commonFields}
            <div className="form-column read-only">
              <Label>ব্যয়ের তারিখ:</Label>
              <Input type="date" value={debitVoucher.details[0]?.expenseDate || ''} readOnly />
            </div>
            <div className="form-column read-only">
              <Label>Paid To:</Label>
              <Input type="text" value={debitVoucher.paidTo} readOnly />
            </div>
            {debitVoucher.details.map((detail, index) => (
              <React.Fragment key={index}>
                <div className="form-column full-width read-only">
                  <Label>বিবরণ {index + 1}:</Label>
                  <Textarea rows={4} readOnly value={detail.description} />
                </div>
                <div className="form-column full-width read-only">
                  <Label>উদ্দেশ্য {index + 1}:</Label>
                  <Textarea rows={4} readOnly value={detail.purpose} />
                </div>
              </React.Fragment>
            ))}
          </>
        );
      case 'খাওয়া দাওয়া ভাউচার':
      case 'যাতায়াত ভাউচার':
        const fcVoucher = voucher as FoodConveyanceVoucher;
        return (
          <>
            {commonFields}
            <div className="form-column read-only">
              <Label>কাহার জন্য:</Label>
              <Input type="text" value={fcVoucher.forWhom} readOnly />
            </div>
            <div className="form-column read-only">
              <Label>পিন ও নাম:</Label>
              <Input type="text" value={fcVoucher.pinName} readOnly />
            </div>
            {fcVoucher.details.map((detail, index) => (
              <React.Fragment key={index}>
                <div className="form-column read-only">
                  <Label>{voucher.type === 'খাওয়া দাওয়া ভাউচার' ? 'খাওয়া-দাওয়ার তারিখ:' : 'ভ্রমণের তারিখ:'}</Label>
                  <Input type="date" value={detail.foodDate || detail.travelDate || ''} readOnly />
                </div>
                {voucher.type === 'যাতায়াত ভাউচার' && (
                  <>
                    <div className="form-column read-only">
                      <Label>হইতে:</Label>
                      <Input type="text" value={detail.from || ''} readOnly />
                    </div>
                    <div className="form-column read-only">
                      <Label>পর্যন্ত:</Label>
                      <Input type="text" value={detail.to || ''} readOnly />
                    </div>
                  </>
                )}
                <div className="form-column read-only">
                  <Label>উদ্দেশ্য:</Label>
                  <Input type="text" value={detail.purpose} readOnly />
                </div>
                {voucher.type === 'খাওয়া দাওয়া ভাউচার' && (
                  <div className="form-column read-only">
                    <Label>বিবরণ:</Label>
                    <Input type="text" value={detail.description || ''} readOnly />
                  </div>
                )}
                {voucher.type === 'যাতায়াত ভাউচার' && (
                  <div className="form-column read-only">
                    <Label>বাহন:</Label>
                    <Input type="text" value={detail.vehicle || ''} readOnly />
                  </div>
                )}
                <div className="form-column read-only">
                  <Label>টাকার পরিমাণ:</Label>
                  <Input type="number" value={detail.amount} readOnly />
                </div>
              </React.Fragment>
            ))}
          </>
        );
      default:
        return <p>এই ভাউচারের ধরন সমর্থিত নয়।</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <div
          className="p-6 rounded-lg text-black"
          style={{ backgroundColor: getVoucherColor(voucher.type) }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              {voucher.type} - {voucher.voucherNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderVoucherDetails()}
            </div>
            <div className="form-column read-only full-width">
              <Label>মোট টাকার পরিমাণ:</Label>
              <Input type="text" value={voucher.amount} readOnly />
            </div>

            <div className="flex justify-between items-center p-2 border rounded-md bg-gray-50 text-gray-800 text-sm">
              <div>
                <p className="font-bold">ভাউচার প্রস্তুতকারক</p>
                <p>নাম: {voucherCreator.name}</p>
                <p>পিন: {voucherCreator.pin}</p>
                <p>পদবী: {voucherCreator.designation}</p>
                <p>প্রতিষ্ঠান: {voucherCreator.organization}</p>
              </div>
              <div>
                <p className="font-bold">অনুমোদনকারী</p>
                <p>নাম: {voucher.approverInfo?.name || 'N/A'}</p>
                <p>পিন: {voucher.approverInfo?.pin || 'N/A'}</p>
                <p>পদবী: {voucher.approverInfo?.designation || 'N/A'}</p>
                <p>প্রতিষ্ঠান: {voucher.approverInfo?.organization || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-column">
                <Label htmlFor="cash-amount">ক্যাশ:</Label>
                <Input
                  id="cash-amount"
                  type="number"
                  placeholder="ক্যাশের পরিমাণ"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  readOnly={voucher.type === 'পেটিক্যাশ স্লিপ'}
                  className="bg-white text-black"
                />
              </div>
              {voucher.type !== 'পেটিক্যাশ স্লিপ' && (
                <div className="form-column">
                  <Label htmlFor="petty-cash-amount">পেটিক্যাশ:</Label>
                  <Input
                    id="petty-cash-amount"
                    type="number"
                    placeholder="পেটিক্যাশের পরিমাণ"
                    value={pettyCashAmount}
                    onChange={(e) => setPettyCashAmount(parseFloat(e.target.value) || 0)}
                    className="bg-white text-black"
                  />
                </div>
              )}
            </div>
            <div className="form-column">
              <Label htmlFor="payment-branch-select">শাখা নির্বাচন করুন:</Label>
              <Select onValueChange={setPaymentBranch} value={paymentBranch}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="শাখা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="বগুড়া উদ্ভাস">বগুড়া উদ্ভাস</SelectItem>
                  <SelectItem value="বগুড়া উন্মেষ">বগুড়া উন্মেষ</SelectItem>
                  <SelectItem value="ফার্মগেট উদ্ভাস">ফার্মগেট উদ্ভাস</SelectItem>
                  <SelectItem value="মতিঝিল উদ্ভাস">মতিঝিল উদ্ভাস</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('approve')}>
              Payment Done
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleAction('reject')}>
              Reject
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => handleAction('revert')}>
              Revert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
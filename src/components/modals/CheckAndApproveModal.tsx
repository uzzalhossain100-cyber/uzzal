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

interface CheckAndApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher;
  onProcessCheckApproval: (action: 'approve' | 'reject' | 'revert', reason?: string) => void;
  loggedInUser: UserInfo;
  voucherCreator: UserInfo;
}

export const CheckAndApproveModal: React.FC<CheckAndApproveModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onProcessCheckApproval,
  loggedInUser,
  voucherCreator,
}) => {
  const [headSelect, setHeadSelect] = useState<string>('');
  const [accountSelect, setAccountSelect] = useState<string>('');

  React.useEffect(() => {
    setHeadSelect('');
    setAccountSelect('');
  }, [voucher]);

  const handleAction = (action: 'approve' | 'reject' | 'revert') => {
    if (action === 'approve') {
      if (!headSelect) {
        toast.error('অনুগ্রহ করে হেড নির্বাচন করুন।');
        return;
      }
      if (!accountSelect) {
        toast.error('অনুগ্রহ করে অ্যাকাউন্ট নির্বাচন করুন।');
        return;
      }
      onProcessCheckApproval('approve');
    } else {
      const reason = prompt('কারণ লিখুন:');
      if (reason) {
        onProcessCheckApproval(action, reason);
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
      case 'ক্রেডিট ভাউচার':
        const creditVoucher = voucher as CreditVoucher;
        return (
          <>
            {commonFields}
            <div className="form-column read-only">
              <Label>তারিখ:</Label>
              <Input type="date" value={creditVoucher.date} readOnly />
            </div>
            <div className="form-column read-only">
              <Label>কাহার নিকট হতে:</Label>
              <Input type="text" value={creditVoucher.fromWhom} readOnly />
            </div>
            <div className="form-column full-width read-only">
              <Label>বিস্তারিত বিবরণ:</Label>
              <Textarea rows={6} readOnly value={creditVoucher.description} />
            </div>
            <div className="form-column">
              <Label>পেমেন্ট অপশন:</Label>
              <Input type="text" value={creditVoucher.paymentOption === 'cash' ? 'ক্যাশ' : 'ব্যাংক'} readOnly />
            </div>
            {creditVoucher.paymentOption === 'bank' && (
              <div className="form-column">
                <Label>নির্বাচিত ব্যাংক:</Label>
                <Input type="text" value={creditVoucher.bankName || 'N/A'} readOnly />
              </div>
            )}
          </>
        );
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
                    </div >
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

            {voucher.type !== 'ক্রেডিট ভাউচার' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-column read-only">
                  <Label>ক্যাশ:</Label>
                  <Input type="number" value={(voucher as any).cashAmount || 0} readOnly />
                </div>
                <div className="form-column read-only">
                  <Label>পেটিক্যাশ:</Label>
                  <Input type="number" value={(voucher as any).pettyCashAmount || 0} readOnly />
                </div>
              </div>
            )}

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
              {voucher.type !== 'ক্রেডিট ভাউচার' && (
                <div>
                  <p className="font-bold">পরিশোধকারী</p>
                  <p>নাম: {(voucher as any).payerInfo?.name || 'N/A'}</p>
                  <p>পিন: {(voucher as any).payerInfo?.pin || 'N/A'}</p>
                  <p>পদবী: {(voucher as any).payerInfo?.designation || 'N/A'}</p>
                  <p>প্রতিষ্ঠান: {(voucher as any).paymentBranch || 'N/A'}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-column">
                <Label htmlFor="head-select">{voucher.type === 'ক্রেডিট ভাউচার' ? 'ক্রেডিট হেড নির্বাচন করুন:' : 'ডেবিট হেড নির্বাচন করুন:'}</Label>
                <Select onValueChange={setHeadSelect} value={headSelect}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="হেড নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="15-05 Branch Loan">15-05 Branch Loan</SelectItem>
                    <SelectItem value="15-07 Other Loan">15-07 Other Loan</SelectItem>
                    <SelectItem value="15-014 Trade Debtors">15-014 Trade Debtors</SelectItem>
                    <SelectItem value="20-002 Exam Guard Honorarium">20-002 Exam Guard Honorarium</SelectItem>
                    <SelectItem value="20-003 Salary & Allowance">20-003 Salary & Allowance</SelectItem>
                    <SelectItem value="20-005 Conveyance">20-005 Conveyance</SelectItem>
                    <SelectItem value="20-006-001 Entertainment (Teachers)">20-006-001 Entertainment (Teachers)</SelectItem>
                    <SelectItem value="20-006-002 Entertainment (Staff)">20-006-002 Entertainment (Staff)</SelectItem>
                    <SelectItem value="20-006-003 Entertainment (Director & Guest)">20-006-003 Entertainment (Director & Guest)</SelectItem>
                    <SelectItem value="20-006-004 Entertainment (Drinking Water)">20-006-004 Entertainment (Drinking Water)</SelectItem>
                    <SelectItem value="20-006-005 Entertainment (Others)">20-006-005 Entertainment (Others)</SelectItem>
                    <SelectItem value="20-006-006 Entertainment (Joint Expenses)">20-006-006 Entertainment (Joint Expenses)</SelectItem>
                    <SelectItem value="20-007 Photocopy Bill">20-007 Photocopy Bill</SelectItem>
                    <SelectItem value="20-008-001 Varsity Admission Printing Charge">20-008-001 Varsity Admission Printing Charge</SelectItem>
                    <SelectItem value="20-008-002 SSC Model Test Printing Charge">20-008-002 SSC Model Test Printing Charge</SelectItem>
                    <SelectItem value="20-008-003 HSC Model Test Printing Charge">20-008-003 HSC Model Test Printing Charge</SelectItem>
                    <SelectItem value="20-008-004 JSC Model Test Printing Charge">20-008-004 JSC Model Test Printing Charge</SelectItem>
                    <SelectItem value="20-008-005 Engineering Admission Printing Charge">20-008-005 Engineering Admission Printing Charge</SelectItem>
                    <SelectItem value="20-008-006 College Admission Printing Charge">20-008-006 College Admission Printing Charge</SelectItem>
                    <SelectItem value="20-008-007 Science Foundation Printing Charge">20-008-007 Science Foundation Printing Charge</SelectItem>
                    <SelectItem value="20-008-008 Printing Charge (Udvash-Unmesh Joint Expense)">20-008-008 Printing Charge (Udvash-Unmesh Joint Expense)</SelectItem>
                    <SelectItem value="20-009 Electricity Bill">20-009 Electricity Bill</SelectItem>
                    <SelectItem value="20-010 Telephone & Mobile Bill">20-010 Telephone & Mobile Bill</SelectItem>
                    <SelectItem value="20-011 Office Rent">20-011 Office Rent</SelectItem>
                    <SelectItem value="20-012 Stationary">20-012 Stationary</SelectItem>
                    <SelectItem value="20-013 Paper & Periodicals">20-013 Paper & Periodicals</SelectItem>
                    <SelectItem value="20-014 VAT & Income Tax">20-014 VAT & Income Tax</SelectItem>
                    <SelectItem value="20-015 Fuel & Oil">20-015 Fuel & Oil</SelectItem>
                    <SelectItem value="20-016 Repair & Maintenance">20-016 Repair & Maintenance</SelectItem>
                    <SelectItem value="20-017 Donation & Subscription">20-017 Donation & Subscription</SelectItem>
                    <SelectItem value="20-018 Festival Bonus">20-018 Festival Bonus</SelectItem>
                    <SelectItem value="20-019 Business Promotion">20-019 Business Promotion</SelectItem>
                    <SelectItem value="20-020 Miscellaneous Expense">20-020 Miscellaneous Expense</SelectItem>
                    <SelectItem value="20-021 Depreciation">20-021 Depreciation</SelectItem>
                    <SelectItem value="20-022 Farewell">20-022 Farewell</SelectItem>
                    <SelectItem value="20-023 Software Maintains">20-023 Software Maintains</SelectItem>
                    <SelectItem value="20-024 Bad Debts">20-024 Bad Debts</SelectItem>
                    <SelectItem value="20-025 Wasa Bill">20-025 Wasa Bill</SelectItem>
                    <SelectItem value="20-026 Transportation Fee">20-026 Transportation Fee</SelectItem>
                    <SelectItem value="20-027 Holder Allowance">20-027 Holder Allowance</SelectItem>
                    <SelectItem value="20-028 Hotel Rent">20-028 Hotel Rent</SelectItem>
                    <SelectItem value="20-029 Guard Bill & Cleaner Bill">20-029 Guard Bill & Cleaner Bill</SelectItem>
                    <SelectItem value="20-030 Labour Charge">20-030 Labour Charge</SelectItem>
                    <SelectItem value="20-031 Legal Fees">20-031 Legal Fees</SelectItem>
                    <SelectItem value="20-032 Special Allowance">20-032 Special Allowance</SelectItem>
                    <SelectItem value="20-033 Renewal & Registration">20-033 Renewal & Registration</SelectItem>
                    <SelectItem value="20-034 Extra. Space Rent">20-034 Extra. Space Rent</SelectItem>
                    <SelectItem value="20-035 Employee Beneficiary Expense">20-035 Employee Beneficiary Expense</SelectItem>
                    <SelectItem value="20-036 Internet Bill">20-036 Internet Bill</SelectItem>
                    <SelectItem value="20-037 Bank Charge">20-037 Bank Charge</SelectItem>
                    <SelectItem value="20-038 Fine & Penalty">20-038 Fine & Penalty</SelectItem>
                    <SelectItem value="20-039 Incentive">20-039 Incentive</SelectItem>
                    <SelectItem value="20-040 E.L Entishment">20-040 E.L Entishment</SelectItem>
                    <SelectItem value="20-041 Children Allowance">20-041 Children Allowance</SelectItem>
                    <SelectItem value="20-042 Gas Bill">20-042 Gas Bill</SelectItem>
                    <SelectItem value="20-043 Medical Expense">20-043 Medical Expense</SelectItem>
                    <SelectItem value="20-044 Daily Allowance">20-044 Daily Allowance</SelectItem>
                    <SelectItem value="20-045 Seminar & Orientation">20-045 Seminar & Orientation</SelectItem>
                    <SelectItem value="20-046 Children Educational Allowance">20-046 Children Educational Allowance</SelectItem>
                    <SelectItem value="20-047 Book Purchase">20-047 Book Purchase</SelectItem>
                    <SelectItem value="20-048 Office Maintenance">20-048 Office Maintenance</SelectItem>
                    <SelectItem value="20-049 Prize Bond">20-049 Prize Bond</SelectItem>
                    <SelectItem value="20-050 Others Maintenance">20-050 Others Maintenance</SelectItem>
                    <SelectItem value="20-051 Abnormal Loss">20-051 Abnormal Loss</SelectItem>
                    <SelectItem value="20-052 Recruitement & Traning Expense">20-052 Recruitement & Traning Expense</SelectItem>
                    <SelectItem value="20-053 Occasional Gift">20-053 Occasional Gift</SelectItem>
                    <SelectItem value="20-054 Promotinal Program Expense">20-054 UPromotinal Program Expense</SelectItem>
                    <SelectItem value="20-055 Safety and Security">20-055 Safety and Security</SelectItem>
                    <SelectItem value="20-080 Admission Form Purchase">20-080 Admission Form Purchase</SelectItem>
                    <SelectItem value="20-081 Exam Paper">20-081 Exam Paper</SelectItem>
                    <SelectItem value="21-001 Campaign">21-001 Campaign</SelectItem>
                    <SelectItem value="21-002 Digital Marketing">21-002 Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-column">
                <Label htmlFor="account-select">অ্যাকাউন্ট নির্বাচন করুন:</Label>
                <Select onValueChange={setAccountSelect} value={accountSelect}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="অ্যাকাউন্ট নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('approve')}>
              Check & Approve
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
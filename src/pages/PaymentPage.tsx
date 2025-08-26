import React, { useState } from 'react';
import { useVouchers } from '@/hooks/useVouchers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { Voucher } from '@/types/voucher';

const PaymentPage = () => {
  const { vouchers, updateVoucherStatus, loggedInUser, voucherCreator } = useVouchers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const vouchersForPayment = vouchers.filter((v) => v.status === 'approved_1st');

  const handleViewVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleProcessPayment = (
    action: 'approve' | 'reject' | 'revert',
    reason?: string,
    paymentDetails?: { cashAmount: number; pettyCashAmount: number; paymentBranch: string }
  ) => {
    if (!selectedVoucher) return;

    let newStatus;
    if (action === 'approve') {
      newStatus = selectedVoucher.type === 'পেটিক্যাশ স্লিপ' ? 'paid' : 'approved_check';
    } else if (action === 'reject') {
      newStatus = 'rejected';
    } else if (action === 'revert') {
      newStatus = 'reverted';
    } else {
      return;
    }

    updateVoucherStatus(selectedVoucher.voucherNumber, newStatus, reason, paymentDetails);
    handleCloseModal();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">পেমেন্টের জন্য</h2>
        {vouchersForPayment.length === 0 ? (
          <p className="text-center text-gray-600">পেমেন্টের জন্য কোনো ভাউচার নেই।</p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-800 text-white">
                  <TableHead className="text-white">ভাউচার নাম্বার</TableHead>
                  <TableHead className="text-white">ভাউচার জমাদানের তারিখ</TableHead>
                  <TableHead className="text-white">প্রতিষ্ঠানের নাম</TableHead>
                  <TableHead className="text-white">ভাউচারের ধরন</TableHead>
                  <TableHead className="text-white">মোট টাকার পরিমাণ</TableHead>
                  <TableHead className="text-white">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchersForPayment.map((voucher) => (
                  <TableRow key={voucher.voucherNumber} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{voucher.voucherNumber}</TableCell>
                    <TableCell>{voucher.submissionDate}</TableCell>
                    <TableCell>{voucher.organization}</TableCell>
                    <TableCell>{voucher.type}</TableCell>
                    <TableCell>{voucher.amount}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() => handleViewVoucher(voucher)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {selectedVoucher && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          voucher={selectedVoucher}
          onProcessPayment={handleProcessPayment}
          loggedInUser={loggedInUser}
          voucherCreator={voucherCreator}
        />
      )}
    </div>
  );
};

export default PaymentPage;
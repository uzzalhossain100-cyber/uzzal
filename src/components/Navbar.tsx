import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [showVoucherButtons, setShowVoucherButtons] = useState(false);
  const navigate = useNavigate();

  const handleVoucherEntryClick = () => {
    setShowVoucherButtons(!showVoucherButtons);
    if (!showVoucherButtons) {
      navigate('/voucher-entry'); // Navigate to voucher entry page when buttons are shown
    } else {
      navigate('/'); // Navigate back to home if buttons are hidden
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-center items-center shadow-md">
        <Link to="/" className="px-4 py-2 hover:bg-gray-700 rounded-md transition-colors">
          Home Page
        </Link>
        <Button
          variant="ghost"
          onClick={handleVoucherEntryClick}
          className={cn(
            "px-4 py-2 hover:bg-gray-700 rounded-md transition-colors text-white",
            showVoucherButtons && "bg-gray-700"
          )}
        >
          Voucher Entry
        </Button>
        <Link to="/first-approval" className="px-4 py-2 hover:bg-gray-700 rounded-md transition-colors">
          1st Approval
        </Link>
        <Link to="/payment" className="px-4 py-2 hover:bg-gray-700 rounded-md transition-colors">
          Payment
        </Link>
        <Link to="/check-and-approve" className="px-4 py-2 hover:bg-gray-700 rounded-md transition-colors">
          Check & Approve
        </Link>
        <Link to="/report" className="px-4 py-2 hover:bg-gray-700 rounded-md transition-colors">
          Report
        </Link>
      </nav>
    </>
  );
};
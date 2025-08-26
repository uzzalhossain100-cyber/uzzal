import React from "react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold mb-6">
        আমাদের সাথে যোগ দেওয়ার জন্য আপনাকে অসংখ্য ধন্যবাদ। স্বাগতম!
      </h1>
    </div>
  );
};

export default Dashboard;
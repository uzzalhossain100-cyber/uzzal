import React from "react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold mb-4 text-primary dark:text-primary-foreground leading-tight">
        আমাদের সাথে যোগ দেওয়ার জন্য আপনাকে অসংখ্য ধন্যবাদ।
      </h1>
      <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        স্বাগতম, <span className="text-primary dark:text-primary-foreground">{user?.email || "ব্যবহারকারী"}</span>!
      </p>
      <p className="mt-4 text-lg text-muted-foreground">
        আপনার ড্যাশবোর্ডে নতুন কিছু অন্বেষণ করুন।
      </p>
    </div>
  );
};

export default Dashboard;
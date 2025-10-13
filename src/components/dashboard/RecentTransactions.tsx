import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const transactions: Transaction[] = [
  {
    id: "TRN001",
    date: "2023-10-26",
    description: "Online Store Purchase",
    amount: "$150.00",
    status: "Completed",
  },
  {
    id: "TRN002",
    date: "2023-10-25",
    description: "Subscription Renewal",
    amount: "$49.99",
    status: "Pending",
  },
  {
    id: "TRN003",
    date: "2023-10-24",
    description: "Office Supplies",
    amount: "$75.50",
    status: "Completed",
  },
  {
    id: "TRN004",
    date: "2023-10-23",
    description: "Software License",
    amount: "$299.00",
    status: "Completed",
  },
  {
    id: "TRN005",
    date: "2023-10-22",
    description: "Consulting Fee",
    amount: "$1200.00",
    status: "Pending",
  },
];

export function RecentTransactions() {
  const { t, currentLanguage } = useTranslation(); // Initialize useTranslation and get currentLanguage

  return (
    <Card className="bg-background/80 backdrop-blur-sm"> {/* Added bg-background/80 backdrop-blur-sm */}
      <CardHeader>
        <CardTitle className="font-extrabold">{t("dashboard.recent_transactions")}</CardTitle> {/* Translate title */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">{t("dashboard.transaction_id")}</TableHead> {/* Translate header */}
              <TableHead className="font-bold">{t("dashboard.transaction_date")}</TableHead> {/* Translate header */}
              <TableHead className="font-bold">{t("dashboard.transaction_description")}</TableHead> {/* Translate header */}
              <TableHead className="font-bold">{t("dashboard.transaction_amount")}</TableHead> {/* Translate header */}
              <TableHead className="font-bold">{t("dashboard.transaction_status")}</TableHead> {/* Translate header */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-semibold">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="font-semibold">{transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "Completed"
                        ? "default"
                        : transaction.status === "Pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="font-bold"
                  >
                    {t(`dashboard.status_${transaction.status.toLowerCase()}`)} {/* Translate status */}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
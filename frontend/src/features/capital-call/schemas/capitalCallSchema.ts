//Generate code for capital call schema Zod schema with all validation rules
// Implement form state management with React Hook Form
// Dynamic breakdown calculation on total amount change
// Percentage validation (total ≤ 100%)
// Date range validation (≤ 365 days)
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialog";
import Button from "../../../components/ui/Button";

export const capitalCallSchema = z.object({
  totalAmount: z.number().positive("Total amount must be greater than 0"),
  breakdown: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        amount: z.number().positive("Amount must be greater than 0"),
        percentage: z
          .number()
          .min(0, "Percentage must be at least 0")
          .max(100, "Percentage cannot exceed 100"),
      }),
    )
    .refine(
      (breakdown) => {
        const totalPercentage = breakdown.reduce(
          (sum, item) => sum + item.percentage,
          0,
        );
        return totalPercentage <= 100;
      },
      { message: "Total percentage cannot exceed 100%", path: ["breakdown"] },
    )
    .refine(
      (breakdown) => {
        const totalAmount = breakdown.reduce(
          (sum, item) => sum + item.amount,
          0,
        );
        return (
          totalAmount <=
          capitalCallSchema.shape.totalAmount._def.checks[0].value
        );
      },
      {
        message: "Total amount in breakdown cannot exceed total amount",
        path: ["breakdown"],
      },
    ),
  dateRange: z.object({ fromDate: z.date(), toDate: z.date() }).refine(
    (data) => {
      const diffInDays =
        (data.toDate.getTime() - data.fromDate.getTime()) /
        (1000 * 60 * 60 * 24);
      return diffInDays <= 365;
    },
    { message: "Date range cannot exceed 365 days", path: ["dateRange"] },
  ),
});

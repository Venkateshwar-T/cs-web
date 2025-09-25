// @/lib/charts.ts
import type { ChartConfig } from '@/components/ui/chart';

export const chartConfig = {
  status: {
    label: 'Status',
    colors: {
      "Completed": "hsl(var(--chart-2))", // Green
      "In Progress": "hsl(var(--chart-4))", // Blue
      "Order Requested": "hsl(var(--chart-1))", // Yellow
      "Cancelled": "hsl(var(--chart-5))", // Red
    }
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

import type { NextRequest } from "next/server";

export type TimeWindow = "7d" | "30d" | "90d" | "custom";

type PriceHistory = {
  productId: string;
  timestamp: string;
  price: number;
};

type Sale = {
  orderId: string;
  timestamp: string;
  units: number;
  revenue: number;
};

type DemandSnapshot = {
  productId: string;
  timestamp: string;
  demandIndex: number;
  availableInventory: number;
};

type ResolvedWindow = {
  window: TimeWindow;
  start: Date;
  end: Date;
  label: string;
};

type SeriesPoint = {
  timestamp: string;
  value: number;
};

const now = new Date("2026-03-22T00:00:00.000Z");

const priceHistory: PriceHistory[] = Array.from({ length: 45 }, (_, index) => {
  const date = new Date(now);
  date.setUTCDate(now.getUTCDate() - (44 - index));

  return {
    productId: `sku-${(index % 4) + 1}`,
    timestamp: date.toISOString(),
    price: Number((92 + Math.sin(index / 4) * 8 + index * 0.35).toFixed(2)),
  };
});

const sales: Sale[] = Array.from({ length: 45 }, (_, index) => {
  const date = new Date(now);
  date.setUTCDate(now.getUTCDate() - (44 - index));
  const units = 30 + (index % 7) * 4 + Math.round(Math.cos(index / 3) * 3);
  const averageOrderValue = 98 + (index % 5) * 6;

  return {
    orderId: `ord-${index + 1}`,
    timestamp: date.toISOString(),
    units,
    revenue: Number((units * averageOrderValue).toFixed(2)),
  };
});

const demandSnapshots: DemandSnapshot[] = Array.from({ length: 45 }, (_, index) => {
  const date = new Date(now);
  date.setUTCDate(now.getUTCDate() - (44 - index));

  return {
    productId: `sku-${(index % 4) + 1}`,
    timestamp: date.toISOString(),
    demandIndex: Number((58 + Math.sin(index / 5) * 16 + (index % 6) * 1.4).toFixed(2)),
    availableInventory: 210 - index * 2 + (index % 4) * 5,
  };
});

function getDateFromSearchParams(value: string | null, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export function resolveTimeWindow(searchParams: URLSearchParams): ResolvedWindow {
  const requestedWindow = searchParams.get("window") as TimeWindow | null;
  const fallbackWindow: TimeWindow = "7d";
  const effectiveWindow = requestedWindow ?? fallbackWindow;

  if (effectiveWindow === "custom") {
    const end = getDateFromSearchParams(searchParams.get("endDate"), now);
    const start = getDateFromSearchParams(
      searchParams.get("startDate"),
      new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000),
    );

    return {
      window: "custom",
      start,
      end,
      label: `${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)}`,
    };
  }

  const days = effectiveWindow === "30d" ? 30 : effectiveWindow === "90d" ? 90 : 7;
  const end = new Date(now);
  const start = new Date(now);
  start.setUTCDate(end.getUTCDate() - (days - 1));

  return {
    window: effectiveWindow,
    start,
    end,
    label: `Last ${days} days`,
  };
}

function isWithinWindow(timestamp: string, range: ResolvedWindow): boolean {
  const date = new Date(timestamp);
  return date >= range.start && date <= range.end;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function getPriceTrends(range: ResolvedWindow) {
  const filtered = priceHistory.filter((entry) => isWithinWindow(entry.timestamp, range));
  const series: SeriesPoint[] = filtered.map((entry) => ({
    timestamp: entry.timestamp,
    value: entry.price,
  }));
  const prices = filtered.map((entry) => entry.price);
  const firstPrice = prices[0] ?? 0;
  const lastPrice = prices.at(-1) ?? 0;
  const change = Number((lastPrice - firstPrice).toFixed(2));
  const changePercent = firstPrice === 0 ? 0 : Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2));

  return {
    meta: {
      metric: "price",
      granularity: "day",
      window: range.window,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
      label: range.label,
    },
    summary: {
      averagePrice: Number(average(prices).toFixed(2)),
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      priceChange: change,
      priceChangePercent: changePercent,
    },
    series,
  };
}

export function getSalesInsights(range: ResolvedWindow) {
  const filtered = sales.filter((entry) => isWithinWindow(entry.timestamp, range));
  const revenueSeries: SeriesPoint[] = filtered.map((entry) => ({
    timestamp: entry.timestamp,
    value: entry.revenue,
  }));
  const unitsSeries: SeriesPoint[] = filtered.map((entry) => ({
    timestamp: entry.timestamp,
    value: entry.units,
  }));
  const totalRevenue = sum(filtered.map((entry) => entry.revenue));
  const totalUnits = sum(filtered.map((entry) => entry.units));

  return {
    meta: {
      metric: "sales",
      granularity: "day",
      window: range.window,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
      label: range.label,
    },
    summary: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalUnits,
      averageOrderValue: totalUnits === 0 ? 0 : Number((totalRevenue / totalUnits).toFixed(2)),
      peakRevenueDay: revenueSeries.reduce<SeriesPoint | null>((peak, point) => {
        if (!peak || point.value > peak.value) {
          return point;
        }
        return peak;
      }, null),
    },
    series: {
      revenue: revenueSeries,
      units: unitsSeries,
    },
  };
}

export function getDemandFluctuations(range: ResolvedWindow) {
  const filtered = demandSnapshots.filter((entry) => isWithinWindow(entry.timestamp, range));
  const demandSeries: SeriesPoint[] = filtered.map((entry) => ({
    timestamp: entry.timestamp,
    value: entry.demandIndex,
  }));
  const inventorySeries: SeriesPoint[] = filtered.map((entry) => ({
    timestamp: entry.timestamp,
    value: entry.availableInventory,
  }));
  const demandValues = filtered.map((entry) => entry.demandIndex);

  return {
    meta: {
      metric: "demand",
      granularity: "day",
      window: range.window,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
      label: range.label,
    },
    summary: {
      averageDemandIndex: Number(average(demandValues).toFixed(2)),
      maxDemandIndex: demandValues.length ? Math.max(...demandValues) : 0,
      minDemandIndex: demandValues.length ? Math.min(...demandValues) : 0,
      latestInventory: inventorySeries.at(-1)?.value ?? 0,
      demandVolatility: Number((Math.max(...demandValues, 0) - Math.min(...demandValues, 0)).toFixed(2)),
    },
    series: {
      demandIndex: demandSeries,
      inventory: inventorySeries,
    },
  };
}

export function getAnalyticsContext(request: NextRequest) {
  const range = resolveTimeWindow(request.nextUrl.searchParams);

  return {
    range,
    appliedFilters: {
      window: range.window,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
    },
  };
}

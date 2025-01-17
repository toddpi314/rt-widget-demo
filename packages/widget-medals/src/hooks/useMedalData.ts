import { useState, useMemo } from "react";

interface MedalData {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  flagKey: string;
}

// Sample data
const initialData: MedalData[] = [
  { code: "USA", gold: 9, silver: 7, bronze: 12, flagKey: "usa" },
  { code: "NOR", gold: 11, silver: 5, bronze: 10, flagKey: "nor" },
  { code: "RUS", gold: 13, silver: 11, bronze: 9, flagKey: "rus" },
  { code: "NED", gold: 8, silver: 7, bronze: 9, flagKey: "ned" },
  { code: "FRA", gold: 4, silver: 4, bronze: 7, flagKey: "fra" },
  { code: "SWE", gold: 2, silver: 7, bronze: 6, flagKey: "swe" },
  { code: "ITA", gold: 0, silver: 2, bronze: 6, flagKey: "ita" },
  { code: "CAN", gold: 10, silver: 10, bronze: 5, flagKey: "can" },
  { code: "SUI", gold: 6, silver: 3, bronze: 2, flagKey: "sui" },
  { code: "BLR", gold: 5, silver: 0, bronze: 1, flagKey: "blr" },
  { code: "GER", gold: 8, silver: 6, bronze: 5, flagKey: "ger" },
  { code: "AUT", gold: 4, silver: 8, bronze: 5, flagKey: "aut" },
  { code: "CHN", gold: 3, silver: 4, bronze: 2, flagKey: "chn" },
];

export type SortField = "total" | "gold" | "silver" | "bronze";
type SortOrder = "asc" | "desc";

export const useMedalData = () => {
  const [data, setData] = useState<MedalData[]>(initialData);
  const [sortField, setSortField] = useState<SortField>("total");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const calculateTotalMedals = (item: MedalData): number => item.gold + item.silver + item.bronze;

  // Sorting logic based on rules
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        if (sortField === "total") {
          const totalA = calculateTotalMedals(a);
          const totalB = calculateTotalMedals(b);
          if (totalA !== totalB) return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
          return sortOrder === "asc" ? b.gold - a.gold : a.gold - b.gold; // Tie-breaker
        } else if (sortField === "gold") {
          if (a.gold !== b.gold) return sortOrder === "asc" ? a.gold - b.gold : b.gold - a.gold;
          return sortOrder === "asc" ? b.silver - a.silver : a.silver - b.silver; // Tie-breaker
        } else if (sortField === "silver") {
          if (a.silver !== b.silver) return sortOrder === "asc" ? a.silver - b.silver : b.silver - a.silver;
          return sortOrder === "asc" ? b.gold - a.gold : a.gold - b.gold; // Tie-breaker
        } else if (sortField === "bronze") {
          if (a.bronze !== b.bronze) return sortOrder === "asc" ? a.bronze - b.bronze : b.bronze - a.bronze;
          return sortOrder === "asc" ? b.gold - a.gold : a.gold - b.gold; // Tie-breaker
        }
        return 0;
      })
      .slice(0, 10); // Limit to top 10 results
  }, [data, sortField, sortOrder]);

  // Toggle sorting
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return { data: sortedData, toggleSort, sortField, sortOrder };
};
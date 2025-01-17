import { useState, useMemo, useEffect } from "react";
import { medalsDataEndpoint } from "../app.config";

interface MedalData {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  flagKey: string;
}

export type SortField = "total" | "gold" | "silver" | "bronze";
type SortOrder = "asc" | "desc";

interface UseMedalDataOptions {
  refreshInterval?: number;
  initialSort?: SortField;
}

export const useMedalData = ({ refreshInterval = 10000, initialSort = 'gold' }: UseMedalDataOptions = {}) => {
  const [data, setData] = useState<MedalData[]>([]);
  const [sortField, setSortField] = useState<SortField>(initialSort);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchData = () => {
    fetch(medalsDataEndpoint)
      .then(response => response.json())
      .then(jsonData => {
        const dataWithFlagKey = jsonData.map((item: any) => ({
          ...item,
          flagKey: item.code.toLowerCase()
        }));
        setData(dataWithFlagKey);
      })
      .catch(error => {
        console.error('Error loading medal data:', error);
        setData([]); // Set empty array on error
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for refreshing data
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refreshInterval]);

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
          if (a.silver !== b.silver) return sortOrder === "asc" ? a.silver - b.silver : b.silver - a.silver; // Tie-breaker
          return sortOrder === "asc" ? a.bronze - b.bronze : b.bronze - a.bronze; // Second tie-breaker
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
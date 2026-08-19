import { create } from "zustand"
import type { AlertPriority, AlertStatus } from "@/types"

interface FilterState {
  searchQuery: string
  statusFilter: AlertStatus | "all"
  priorityFilter: AlertPriority | "all"
  dateRange: "today" | "week" | "month" | "all"

  setSearchQuery: (query: string) => void
  setStatusFilter: (status: AlertStatus | "all") => void
  setPriorityFilter: (priority: AlertPriority | "all") => void
  setDateRange: (range: "today" | "week" | "month" | "all") => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  priorityFilter: "all",
  dateRange: "all",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  setDateRange: (dateRange) => set({ dateRange }),
  resetFilters: () =>
    set({
      searchQuery: "",
      statusFilter: "all",
      priorityFilter: "all",
      dateRange: "all",
    }),
}))

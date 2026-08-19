"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi, adminApi } from "@/lib/api";
import type { StaffMember, StaffCreateInput, StaffRole } from "@/types/auth";
import type { Agency } from "@/types";
import { toast } from "sonner";

// 1. Fetch Station Team Members
export function useGetAgencyTeam() {
  return useQuery<StaffMember[]>({
    queryKey: ["agency", "team"],
    queryFn: async () => {
      return await teamApi.getTeam();
    },
    staleTime: 15 * 1000,
  });
}
export const useGetTeam = useGetAgencyTeam;


// 2. Add New Team Member
export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StaffCreateInput) => {
      return await teamApi.addMember(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "team"] });
      toast.success("Team member successfully added");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Failed to add team member";
      toast.error(msg);
    },
  });
}

// 3. Update Team Member Role
export function useUpdateStaffRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staffId, role }: { staffId: string; role: StaffRole }) => {
      return await teamApi.updateRole(staffId, role);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agency", "team"] });
      toast.success(`Role updated to ${variables.role}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update role");
    },
  });
}

// 4. Update Team Member Status (Active / Suspended)
export function useUpdateStaffStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ staffId, isActive }: { staffId: string; isActive: boolean }) => {
      return await teamApi.updateStatus(staffId, isActive);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["agency", "team"] });
      toast.success(variables.isActive ? "Access activated" : "Access revoked");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update status");
    },
  });
}

// 5. Super Admin: Fetch All Agencies
export function useGetAllAgencies() {
  return useQuery<Agency[]>({
    queryKey: ["admin", "agencies"],
    queryFn: async () => {
      return await adminApi.getAgencies();
    },
    staleTime: 30 * 1000,
  });
}

// 6. Super Admin: Verify / Suspend Agency
export function useVerifyAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agencyId, isVerified }: { agencyId: string; isVerified: boolean }) => {
      return await adminApi.verifyAgency(agencyId, isVerified);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agencies"] });
      toast.success(variables.isVerified ? "Station approved & verified" : "Station verification revoked");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update station status");
    },
  });
}

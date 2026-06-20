import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { ServiceEntry, CreateServiceEntryDto, UpdateServiceEntryDto } from "./types";

export function useVehicleHistory(vehicleId: number | null) {
  return useQuery<ServiceEntry[], Error>({
    queryKey: ["service-entries", vehicleId],
    queryFn: async () => {
      return await invoke<ServiceEntry[]>("get_vehicle_history_command", { vehicleId });
    },
    enabled: vehicleId !== null, 
  });
}

export function useCreateServiceEntry() {
  const queryClient = useQueryClient();

  return useMutation<ServiceEntry, Error, CreateServiceEntryDto>({
    mutationFn: async (dto) => {
      return await invoke<ServiceEntry>("create_service_entry_command", { dto });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-entries", variables.vehicle_id] });
    },
  });
}

export function useUpdateServiceEntry(vehicleId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; dto: UpdateServiceEntryDto }>({
    mutationFn: async ({ id, dto }) => {
      return await invoke<void>("update_service_entry_command", { id, dto });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-entries", vehicleId] });
    },
  });
}

export function useDeleteServiceEntry(vehicleId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      return await invoke<void>("delete_service_entry_command", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-entries", vehicleId] });
    },
  });
}
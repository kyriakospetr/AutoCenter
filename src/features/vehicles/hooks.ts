import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from "./types";

export function useVehicles(searchQuery = "") {
  return useQuery<Vehicle[], Error>({
    queryKey: ["vehicles", searchQuery],
    queryFn: async () => {
      return await invoke<Vehicle[]>("search_vehicles_command", { query: searchQuery });
    },
  });
}

export function useVehicle(id: number | null) {
  return useQuery<Vehicle, Error>({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      return await invoke<Vehicle>("get_vehicle_by_id_command", { id });
    },
    enabled: id !== null, 
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<Vehicle, Error, CreateVehicleDto>({
    mutationFn: async (dto) => {
      return await invoke<Vehicle>("create_vehicle_command", { dto });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; dto: UpdateVehicleDto }>({
    mutationFn: async ({ id, dto }) => {
      return await invoke<void>("update_vehicle_command", { id, dto });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      return await invoke<void>("delete_vehicle_command", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
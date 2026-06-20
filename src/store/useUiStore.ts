import { create } from 'zustand';

interface UiState {
  selectedVehicle: any;
  currentView: 'list' | 'add' | 'edit' | 'add-service' | 'edit-service'; 
  setSelectedVehicle: (vehicle: any) => void;
  setView: (view: 'list' | 'add' | 'edit' | 'add-service' | 'edit-service') => void; 
}

export const useUiStore = create<UiState>((set) => ({
  selectedVehicle: null,
  currentView: 'list',
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle, currentView: 'list' }),
  setView: (view) => set({ currentView: view }),
}));
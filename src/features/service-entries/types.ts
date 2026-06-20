export interface ServiceEntry {
  id: number;
  vehicle_id: number;
  service_date: string;       
  mileage: number | null;     
  work_description: string;   
  future_work: string | null; 
  created_at: string;
}

export interface CreateServiceEntryDto {
  vehicle_id: number;
  service_date: string;
  mileage: number | null;
  work_description: string;
  future_work: string | null;
}

export interface UpdateServiceEntryDto {
  service_date: string;
  mileage: number | null;
  work_description: string;
  future_work: string | null;
}
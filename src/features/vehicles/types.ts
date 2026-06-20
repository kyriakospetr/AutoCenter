export interface Vehicle {
  id: number;
  owner: string;
  phone: string | null;          
  make: string;
  model: string;
  year: number | null;           
  plate: string | null;          
  engine_number: string | null;   
  vin: string | null;            
  created_at: string;
}

export interface CreateVehicleDto {
  owner: string;
  phone: string | null;          
  make: string;
  model: string;
  year: number | null;           
  plate: string | null;          
  engine_number: string | null;   
  vin: string | null;            
}

export interface UpdateVehicleDto {
  owner: string;
  phone: string | null;
  make: string;
  model: string;
  year: number | null;
  plate: string | null;
  engine_number: string | null;
  vin: string | null;
}
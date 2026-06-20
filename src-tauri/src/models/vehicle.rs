use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Vehicle {
    pub id: i64,
    pub owner: String,
    pub phone: Option<String>,          
    pub make: String,
    pub model: String,
    pub year: Option<i32>,              
    pub plate: Option<String>,          
    pub engine_number: Option<String>,   
    pub vin: Option<String>,            
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateVehicleDto {
    pub owner: String,
    pub phone: Option<String>,          
    pub make: String,
    pub model: String,
    pub year: Option<i32>,              
    pub plate: Option<String>,          
    pub engine_number: Option<String>,   
    pub vin: Option<String>,            
}

#[derive(Debug, Deserialize)]
pub struct UpdateVehicleDto {
    pub owner: String,
    pub phone: Option<String>,
    pub make: String,
    pub model: String,
    pub year: Option<i32>,
    pub plate: Option<String>,
    pub engine_number: Option<String>,
    pub vin: Option<String>,
}
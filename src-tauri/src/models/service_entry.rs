use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServiceEntry {
    pub id: i64,
    pub vehicle_id: i64,
    pub service_date: String,
    pub mileage: Option<i32>,
    pub work_description: String,
    pub future_work: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateServiceEntryDto {
    pub vehicle_id: i64,
    pub service_date: String,
    pub mileage: Option<i32>,
    pub work_description: String,
    pub future_work: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateServiceEntryDto {
    pub service_date: String,
    pub mileage: Option<i32>,
    pub work_description: String,
    pub future_work: Option<String>,
}

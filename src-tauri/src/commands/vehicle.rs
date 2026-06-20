use crate::db::DbState;
use crate::error::AppError;
use crate::models::vehicle::{CreateVehicleDto, UpdateVehicleDto, Vehicle};
use crate::services::vehicle as service;
use tauri::State;

#[tauri::command]
pub async fn create_vehicle_command(
    state: State<'_, DbState>,
    dto: CreateVehicleDto,
) -> Result<Vehicle, AppError> {
    service::create_vehicle(&state, dto)
}

#[tauri::command]
pub async fn get_all_vehicles_command(state: State<'_, DbState>) -> Result<Vec<Vehicle>, AppError> {
    service::get_all_vehicles(&state)
}

#[tauri::command]
pub async fn get_vehicle_by_id_command(
    state: State<'_, DbState>,
    id: i64,
) -> Result<Vehicle, AppError> {
    service::get_vehicle_by_id(&state, id)
}

#[tauri::command]
pub async fn update_vehicle_command(
    state: State<'_, DbState>,
    id: i64,
    dto: UpdateVehicleDto,
) -> Result<(), AppError> {
    service::update_vehicle(&state, id, dto)
}

#[tauri::command]
pub async fn delete_vehicle_command(state: State<'_, DbState>, id: i64) -> Result<(), AppError> {
    service::delete_vehicle(&state, id)
}

#[tauri::command]
pub async fn search_vehicles_command(
    state: State<'_, DbState>,
    query: String,
) -> Result<Vec<Vehicle>, AppError> {
    service::search_vehicles(&state, query)
}

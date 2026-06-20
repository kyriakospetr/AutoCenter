use crate::db::DbState;
use crate::error::AppError;
use crate::models::service_entry::{CreateServiceEntryDto, ServiceEntry, UpdateServiceEntryDto};
use crate::services::service_entry as service;
use tauri::State;

#[tauri::command]
pub async fn create_service_entry_command(
    state: State<'_, DbState>,
    dto: CreateServiceEntryDto,
) -> Result<ServiceEntry, AppError> {
    service::create_entry(&state, dto)
}

#[tauri::command]
pub async fn get_vehicle_history_command(
    state: State<'_, DbState>,
    vehicle_id: i64,
) -> Result<Vec<ServiceEntry>, AppError> {
    service::get_entries_for_vehicle(&state, vehicle_id)
}

#[tauri::command]
pub async fn update_service_entry_command(
    state: State<'_, DbState>,
    id: i64,
    dto: UpdateServiceEntryDto,
) -> Result<(), AppError> {
    service::update_entry(&state, id, dto)
}

#[tauri::command]
pub async fn delete_service_entry_command(
    state: State<'_, DbState>,
    id: i64,
) -> Result<(), AppError> {
    service::delete_entry(&state, id)
}

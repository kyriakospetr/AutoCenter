use crate::db::DbState;
use crate::error::AppError;
use crate::models::service_entry::{CreateServiceEntryDto, ServiceEntry, UpdateServiceEntryDto};
use crate::repositories::service_entry as repo;

pub fn create_entry(state: &DbState, dto: CreateServiceEntryDto) -> Result<ServiceEntry, AppError> {
    if dto.work_description.trim().is_empty() {
        return Err(AppError::ValidationError(
            "Η περιγραφή εργασίας είναι υποχρεωτική!".to_string(),
        ));
    }
    let new_entry = repo::create(state, dto)?;
    Ok(new_entry)
}

pub fn get_entries_for_vehicle(
    state: &DbState,
    vehicle_id: i64,
) -> Result<Vec<ServiceEntry>, AppError> {
    let entries = repo::get_by_vehicle_id(state, vehicle_id)?;
    Ok(entries)
}

pub fn update_entry(state: &DbState, id: i64, dto: UpdateServiceEntryDto) -> Result<(), AppError> {
    if dto.work_description.trim().is_empty() {
        return Err(AppError::ValidationError(
            "Η περιγραφή εργασίας δεν μπορεί να είναι κενή.".to_string(),
        ));
    }

    let success = repo::update(state, id, dto)?;
    if !success {
        return Err(AppError::NotFound(format!(
            "Το σέρβις με ID {} δεν βρέθηκε.",
            id
        )));
    }
    Ok(())
}

pub fn delete_entry(state: &DbState, id: i64) -> Result<(), AppError> {
    let success = repo::delete(state, id)?;
    if !success {
        return Err(AppError::NotFound(format!(
            "Το σέρβις με ID {} δεν βρέθηκε.",
            id
        )));
    }
    Ok(())
}

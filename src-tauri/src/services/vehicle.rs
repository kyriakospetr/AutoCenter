use crate::db::DbState;
use crate::error::AppError;
use crate::models::vehicle::{CreateVehicleDto, UpdateVehicleDto, Vehicle};
use crate::repositories::vehicle as repo;

pub fn create_vehicle(state: &DbState, dto: CreateVehicleDto) -> Result<Vehicle, AppError> {
    let dto = dto;
    // Create vehicle in repository
    let new_vehicle = repo::create(state, dto)?;
    Ok(new_vehicle)
}

pub fn get_all_vehicles(state: &DbState) -> Result<Vec<Vehicle>, AppError> {
    let vehicles = repo::get_all(state)?;
    Ok(vehicles)
}

pub fn get_vehicle_by_id(state: &DbState, id: i64) -> Result<Vehicle, AppError> {
    match repo::get_by_id(state, id)? {
        Some(vehicle) => Ok(vehicle),
        None => Err(AppError::NotFound(format!(
            "Το όχημα με ID {} δεν βρέθηκε.",
            id
        ))),
    }
}

pub fn update_vehicle(state: &DbState, id: i64, dto: UpdateVehicleDto) -> Result<(), AppError> {
    // Plate must be uppercase if not empty
    let dto = dto;
    let success = repo::update(state, id, dto)?;
    if !success {
        return Err(AppError::NotFound(format!(
            "Αδυναμία ενημέρωσης. Το όχημα με ID {} δεν βρέθηκε.",
            id
        )));
    }

    Ok(())
}

pub fn delete_vehicle(state: &DbState, id: i64) -> Result<(), AppError> {
    let success = repo::delete(state, id)?;
    if !success {
        return Err(AppError::NotFound(format!(
            "Αδυναμία διαγραφής. Το όχημα με ID {} δεν βρέθηκε.",
            id
        )));
    }
    Ok(())
}

pub fn search_vehicles(state: &DbState, query: String) -> Result<Vec<Vehicle>, AppError> {
    let trimmed_query = query.trim();
    if trimmed_query.is_empty() {
        return repo::get_all(state).map_err(AppError::from);
    }

    let results = repo::search(state, trimmed_query)?;
    Ok(results)
}

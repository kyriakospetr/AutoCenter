#[derive(Debug, serde::Serialize)]
pub enum AppError {
    ValidationError(String),
    DatabaseError(String),
    NotFound(String),
}

// Conversion from rusqlite errors to AppError
impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        if let rusqlite::Error::SqliteFailure(sqlite_err, Some(ref msg)) = err {
            if sqlite_err.code == rusqlite::ErrorCode::ConstraintViolation {
                if msg.contains("vehicles.plate") {
                    return AppError::ValidationError("Η πινακίδα υπάρχει ήδη!".to_string());
                }
                if msg.contains("vehicles.vin") {
                    return AppError::ValidationError("Ο αριθμός πλαισίου (VIN) υπάρχει ήδη!".to_string());
                }
            }
        }
        AppError::DatabaseError(err.to_string())
    }
}

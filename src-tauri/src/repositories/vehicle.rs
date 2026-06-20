use crate::db::DbState;
use crate::models::vehicle::{CreateVehicleDto, UpdateVehicleDto, Vehicle};
use rusqlite::params;

pub fn create(state: &DbState, dto: CreateVehicleDto) -> Result<Vehicle, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();

    conn.execute(
        "INSERT INTO vehicles (owner, phone, make, model, year, plate, engine_number, vin)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            dto.owner,
            dto.phone,
            dto.make,
            dto.model,
            dto.year,
            dto.plate,
            dto.engine_number,
            dto.vin
        ],
    )?;

    let id = conn.last_insert_rowid();

    let mut stmt = conn.prepare(
        "SELECT id, owner, phone, make, model, year, plate, engine_number, vin, created_at 
         FROM vehicles 
         WHERE id = ?1"
    )?;

    let vehicle = stmt.query_row(params![id], |row| {
        Ok(Vehicle {
            id: row.get(0)?,
            owner: row.get(1)?,
            phone: row.get(2)?,          
            make: row.get(3)?,
            model: row.get(4)?,
            year: row.get(5)?,           
            plate: row.get(6)?,          
            engine_number: row.get(7)?,  
            vin: row.get(8)?,            
            created_at: row.get(9)?,
        })
    })?;

    Ok(vehicle)
}

pub fn get_all(state: &DbState) -> Result<Vec<Vehicle>, rusqlite::Error> {
    // Lock the connection and get a mutable reference
    let conn = state.conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, owner, phone, make, model, year, plate, engine_number, vin, created_at FROM vehicles"
    )?;

    // Map each row to a Vehicle struct
    let vehicle_iter = stmt.query_map([], |row| {
        Ok(Vehicle {
            id: row.get(0)?,
            owner: row.get(1)?,
            phone: row.get(2)?,
            make: row.get(3)?,
            model: row.get(4)?,
            year: row.get(5)?,
            plate: row.get(6)?,
            engine_number: row.get(7)?,
            vin: row.get(8)?,
            created_at: row.get(9)?,
        })
    })?;

    // Collect all vehicles into a Vec
    let mut vehicles = Vec::new();
    for vehicle in vehicle_iter {
        vehicles.push(vehicle?);
    }

    Ok(vehicles)
}

pub fn get_by_id(state: &DbState, id: i64) -> Result<Option<Vehicle>, rusqlite::Error> {
    // Lock the connection and get a mutable reference
    let conn = state.conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, owner, phone, make, model, year, plate, engine_number, vin, created_at
         FROM vehicles WHERE id = ?1",
    )?;

    // Execute the query and return the first row (if any)
    let mut rows = stmt.query(params![id])?;

    if let Some(row) = rows.next()? {
        Ok(Some(Vehicle {
            id: row.get(0)?,
            owner: row.get(1)?,
            phone: row.get(2)?,
            make: row.get(3)?,
            model: row.get(4)?,
            year: row.get(5)?,
            plate: row.get(6)?,
            engine_number: row.get(7)?,
            vin: row.get(8)?,
            created_at: row.get(9)?,
        }))
    } else {
        Ok(None) // No vehicle found
    }
}

pub fn update(state: &DbState, id: i64, dto: UpdateVehicleDto) -> Result<bool, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();

    let rows_affected = conn.execute(
        "UPDATE vehicles
         SET owner = ?1, phone = ?2, make = ?3, model = ?4, year = ?5, plate = ?6, engine_number = ?7, vin = ?8
         WHERE id = ?9",
        params![
            dto.owner,
            dto.phone,          
            dto.make,
            dto.model,
            dto.year,           
            dto.plate,          
            dto.engine_number,  
            dto.vin,            
            id
        ],
    )?;

    Ok(rows_affected > 0)
}

pub fn delete(state: &DbState, id: i64) -> Result<bool, rusqlite::Error> {
    // Lock the connection and get a mutable reference
    let conn = state.conn.lock().unwrap();

    let rows_affected = conn.execute("DELETE FROM vehicles WHERE id = ?1", params![id])?;

    // Return true if the delete affected at least one row
    Ok(rows_affected > 0)
}

pub fn search(state: &DbState, query: &str) -> Result<Vec<Vehicle>, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();
    let search_query = query.trim();

    // Base query using 1=1 to easily append AND clauses
    let mut sql = String::from(
        "SELECT id, owner, phone, make, model, year, plate, engine_number, vin, created_at
         FROM vehicles
         WHERE 1=1"
    );

    let mut param_values: Vec<String> = Vec::new();

    if !search_query.is_empty() {
        // Split the search string into individual words
        let terms: Vec<&str> = search_query.split_whitespace().collect();

        // Dynamically add conditions for each word
        for term in terms {
            sql.push_str(" AND (
                owner LIKE ? OR
                make LIKE ? OR
                model LIKE ? OR
                plate LIKE ? OR
                phone LIKE ?
            )");

            let like_pattern = format!("%{}%", term);

            // Push the same pattern 5 times because we have 5 '?' placeholders per word
            for _ in 0..5 {
                param_values.push(like_pattern.clone());
            }
        }
    }

    // Sort by most recently added/updated (optional but recommended)
    sql.push_str(" ORDER BY id DESC");

    let mut stmt = conn.prepare(&sql)?;

    // Use params_from_iter to pass the dynamic list of arguments
    let vehicle_iter = stmt.query_map(rusqlite::params_from_iter(param_values), |row| {
        Ok(Vehicle {
            id: row.get(0)?,
            owner: row.get(1)?,
            phone: row.get(2)?,
            make: row.get(3)?,
            model: row.get(4)?,
            year: row.get(5)?,
            plate: row.get(6)?,
            engine_number: row.get(7)?,
            vin: row.get(8)?,
            created_at: row.get(9)?,
        })
    })?;

    let mut vehicles = Vec::new();
    for vehicle in vehicle_iter {
        vehicles.push(vehicle?);
    }

    Ok(vehicles)
}

use crate::db::DbState;
use crate::models::service_entry::{CreateServiceEntryDto, ServiceEntry, UpdateServiceEntryDto};
use rusqlite::params;

pub fn create(
    state: &DbState,
    dto: CreateServiceEntryDto,
) -> Result<ServiceEntry, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();

    conn.execute(
        "INSERT INTO service_entries (vehicle_id, service_date, mileage, work_description, future_work)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![dto.vehicle_id, dto.service_date, dto.mileage, dto.work_description, dto.future_work],
    )?;

    let id = conn.last_insert_rowid();

    let mut stmt = conn.prepare(
        "SELECT id, vehicle_id, service_date, mileage, work_description, future_work, created_at
         FROM service_entries WHERE id = ?1",
    )?;

    let entry = stmt.query_row(params![id], |row| {
        Ok(ServiceEntry {
            id: row.get(0)?,
            vehicle_id: row.get(1)?,
            service_date: row.get(2)?,
            mileage: row.get(3)?,
            work_description: row.get(4)?,
            future_work: row.get(5)?,
            created_at: row.get(6)?,
        })
    })?;

    Ok(entry)
}

pub fn get_by_vehicle_id(
    state: &DbState,
    vehicle_id: i64,
) -> Result<Vec<ServiceEntry>, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();

    let mut stmt = conn.prepare(
        "SELECT id, vehicle_id, service_date, mileage, work_description, future_work, created_at
         FROM service_entries WHERE vehicle_id = ?1 ORDER BY service_date DESC",
    )?;

    let entry_iter = stmt.query_map(params![vehicle_id], |row| {
        Ok(ServiceEntry {
            id: row.get(0)?,
            vehicle_id: row.get(1)?,
            service_date: row.get(2)?,
            mileage: row.get(3)?,
            work_description: row.get(4)?,
            future_work: row.get(5)?,
            created_at: row.get(6)?,
        })
    })?;

    let mut entries = Vec::new();
    for entry in entry_iter {
        entries.push(entry?);
    }
    Ok(entries)
}

pub fn update(
    state: &DbState,
    id: i64,
    dto: UpdateServiceEntryDto,
) -> Result<bool, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();

    let rows_affected = conn.execute(
        "UPDATE service_entries
         SET service_date = ?1, mileage = ?2, work_description = ?3, future_work = ?4
         WHERE id = ?5",
        params![
            dto.service_date,
            dto.mileage,
            dto.work_description,
            dto.future_work,
            id
        ],
    )?;

    Ok(rows_affected > 0)
}

pub fn delete(state: &DbState, id: i64) -> Result<bool, rusqlite::Error> {
    let conn = state.conn.lock().unwrap();
    let rows_affected = conn.execute("DELETE FROM service_entries WHERE id = ?1", params![id])?;
    Ok(rows_affected > 0)
}

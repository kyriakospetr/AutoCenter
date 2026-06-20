use rusqlite::Connection;
use rusqlite_migration::{M, Migrations};
use std::path::Path;
use std::sync::Mutex;

fn migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(
            "
            CREATE TABLE vehicles (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                owner           TEXT NOT NULL,
                phone           TEXT,
                make            TEXT NOT NULL,
                model           TEXT NOT NULL,
                year            INTEGER,
                plate           TEXT UNIQUE,
                engine_number   TEXT,
                vin             TEXT UNIQUE,
                created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE service_entries (
                id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                vehicle_id          INTEGER NOT NULL,
                service_date        TEXT NOT NULL,
                mileage             INTEGER,
                work_description    TEXT NOT NULL,
                future_work         TEXT,
                created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_vehicle
                    FOREIGN KEY(vehicle_id)
                    REFERENCES vehicles(id)
                    ON DELETE CASCADE
            );
            CREATE INDEX idx_service_entries_vehicle_id
                ON service_entries(vehicle_id);
            ",
        )
        .down(
            "
            DROP INDEX IF EXISTS idx_service_entries_vehicle_id;
            DROP TABLE IF EXISTS service_entries;
            DROP TABLE IF EXISTS vehicles;
            ",
        ),
    ])
}

pub struct DbState {
    pub conn: Mutex<Connection>,
}

pub fn init(db_path: &Path) -> Result<DbState, Box<dyn std::error::Error>> {
    let mut conn = Connection::open(db_path)?;

    conn.execute_batch(
        "
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        ",
    )?;

    migrations().to_latest(&mut conn)?;


    Ok(DbState {
        conn: Mutex::new(conn),
    })
}
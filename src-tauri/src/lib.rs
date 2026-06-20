pub mod commands;
pub mod db;
pub mod error;
pub mod models;
pub mod repositories;
pub mod services;

// Needed for app path
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init()) 
        // Initialize the database when the app starts
        .setup(|app| {
            // Find the appropriate app data directory
            let mut app_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            // Create the app data directory if it doesn't exist
            std::fs::create_dir_all(&app_dir)?;

            // Rename the database file
            app_dir.push("petropoulos.db");

            // Run the init function from db/mod.rs
            let db_state = db::init(&app_dir).expect("Failed to initialize database");

            // Store the db_state in Tauri for use in commands
            app.manage(db_state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Vehicle commands
            commands::vehicle::create_vehicle_command,
            commands::vehicle::get_all_vehicles_command,
            commands::vehicle::get_vehicle_by_id_command,
            commands::vehicle::update_vehicle_command,
            commands::vehicle::delete_vehicle_command,
            commands::vehicle::search_vehicles_command,
            // Service entry commands
            commands::service_entry::create_service_entry_command,
            commands::service_entry::get_vehicle_history_command,
            commands::service_entry::update_service_entry_command,
            commands::service_entry::delete_service_entry_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

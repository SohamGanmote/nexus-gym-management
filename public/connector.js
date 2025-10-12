import { ipcMain } from "electron";
import sqlite3 from "sqlite3";

sqlite3.verbose();

// Open (or create) the database
const database = new sqlite3.Database("db.sqlite3", (err) => {
	if (err) console.error("Database opening error: ", err);
	else console.log("Database opened successfully");
});

// SQL statements for creating tables and inserting default theme
const createTableQuery = `
-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Admins Table
CREATE TABLE IF NOT EXISTS "Admins" (
    admin_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    mobile_no TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    role TEXT NOT NULL,
    trigger_reset INTEGER DEFAULT 1 NOT NULL
);

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    user_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    mobile_no TEXT NOT NULL
);

-- Tiers Table
CREATE TABLE IF NOT EXISTS "Tiers" (
    tier_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    monthly REAL NOT NULL,
    quarterly REAL NOT NULL,
    halfyearly REAL NOT NULL,
    yearly REAL NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS "Subscriptions" (
    subscription_id TEXT PRIMARY KEY,
    tier_id TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    user_id TEXT NOT NULL,
    admin_id TEXT,
    FOREIGN KEY (tier_id) REFERENCES Tiers(tier_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS "Invoices" (
    invoice_id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    user_id TEXT,
    subscription_id TEXT,
    admin_id TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES Subscriptions(subscription_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS "Payments" (
    payment_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subscription_id TEXT,
    mode TEXT NOT NULL,
    paid REAL NOT NULL,
    payable REAL NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    date TEXT NOT NULL,
    admin_id TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (subscription_id) REFERENCES Subscriptions(subscription_id),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS "Reminders" (
    reminder_id TEXT PRIMARY KEY,
    reminder_type TEXT NOT NULL,
    description TEXT NOT NULL,
    date_and_time TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Themes Table
CREATE TABLE IF NOT EXISTS "Themes" (
    theme_id TEXT PRIMARY KEY,
    primary_color TEXT DEFAULT '#222831' NOT NULL,
    gradient_start TEXT DEFAULT '#222831' NOT NULL,
    gradient_middle TEXT DEFAULT '#222831' NOT NULL,
    gradient_end TEXT DEFAULT '#222831' NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    is_active INTEGER NOT NULL
);

-- Insert default theme if it doesn't exist
INSERT INTO "Themes" (
    theme_id,
    primary_color,
    gradient_start,
    gradient_middle,
    gradient_end,
    createdAt,
    updatedAt,
    is_active
)
SELECT
    'default-theme',
    '#222831',
    '#222831',
    '#222831',
    '#222831',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
WHERE NOT EXISTS (
    SELECT 1 FROM "Themes" WHERE theme_id = 'default-theme'
);

-- Insert default admin if it doesn't exist
INSERT INTO "Admins" (
    admin_id,
    username,
    first_name,
    last_name,
    mobile_no,
    password_hash,
    createdAt,
    updatedAt,
    role,
    trigger_reset
)
SELECT
    'admin-001',
    'admin',
    'John',
    'Doe',
    '0000000000',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'admin',
    0
WHERE NOT EXISTS (
    SELECT 1 FROM "Admins" WHERE admin_id = 'admin-001'
);
`;

// Execute all statements
database.exec(createTableQuery, (err) => {
	if (err) {
		console.error("Error creating tables: ", err.message);
	} else {
		console.log("All tables and default theme are ready");
	}
});

// Handle asynchronous IPC calls from renderer
ipcMain.on("asynchronous-message", (event, arg) => {
	const sql = arg;
	// console.log("Running SQL:", sql);
	database.all(sql, (err, rows) => {
		// console.log("Rows returned:", rows);
		event.reply("asynchronous-reply", (err && err.message) || rows);
	});
});

// ipcMain.on("asynchronous-message", (event, sql) => {
//   console.log("Running SQL:", sql);
//   database.all(sql, (err, rows) => {
//     console.log("Rows returned:", rows);
//     event.reply("asynchronous-reply", { error: err ? err.message : null, rows: rows || [] });
//   });
// });

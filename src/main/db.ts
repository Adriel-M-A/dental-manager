import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

const dbPath = isDev
  ? path.join(__dirname, '../../dental.db')
  : path.join(app.getPath('userData'), 'dental.db')

const db: Database.Database = new Database(dbPath)
db.pragma('journal_mode = WAL')

const migrations = [
  (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dni TEXT UNIQUE,
        phone TEXT,
        email TEXT,
        address TEXT,
        birth_date TEXT,
        medical_notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS treatments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        default_price INTEGER NOT NULL
      );
    `)
  },
  (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
      );
    `)
  },
  (db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS clinical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        treatment_id INTEGER,
        description TEXT NOT NULL,
        cost INTEGER NOT NULL,
        FOREIGN KEY(patient_id) REFERENCES patients(id),
        FOREIGN KEY(treatment_id) REFERENCES treatments(id)
      );
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        method TEXT DEFAULT 'cash',
        notes TEXT,
        FOREIGN KEY(patient_id) REFERENCES patients(id)
      );
    `)
  }
]

const currentVersion = db.pragma('user_version', { simple: true }) as number

for (let i = currentVersion; i < migrations.length; i++) {
  const runMigration = db.transaction(() => {
    migrations[i](db)
    db.pragma(`user_version = ${i + 1}`)
  })
  runMigration()
}

export { db }

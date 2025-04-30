const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.resolve(__dirname, '../db/enrollment.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

// Crear las tablas necesarias si no existen
function createTables() {
    // Tabla Course
    db.run(`CREATE TABLE IF NOT EXISTS course (
        id TEXT PRIMARY KEY,
        curriculum INTEGER NOT NULL,
        year INTEGER NOT NULL,
        semester INTEGER NOT NULL,
        code TEXT UNIQUE,
        name TEXT NOT NULL,
        acronym TEXT,
        credits REAL,
        theory_hours REAL,
        practice_hours REAL,
        laboratory_hours REAL,
        laboratory BOOLEAN NOT NULL DEFAULT 1,
        status BOOLEAN NOT NULL DEFAULT 1,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating course table:', err.message);
    });

    // Tabla Teacher
    db.run(`CREATE TABLE IF NOT EXISTS teacher (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        names TEXT NOT NULL,
        father_surname TEXT NOT NULL,
        mother_surname TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        show_phone BOOLEAN NOT NULL DEFAULT 0,
        status BOOLEAN NOT NULL DEFAULT 1,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating teacher table:', err.message);
    });

    // Tabla Student
    db.run(`CREATE TABLE IF NOT EXISTS student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cui INTEGER UNIQUE,
        names TEXT NOT NULL,
        father_surname TEXT NOT NULL,
        mother_surname TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        status BOOLEAN NOT NULL DEFAULT 1,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating student table:', err.message);
    });

    // Tabla Workload
    db.run(`CREATE TABLE IF NOT EXISTS workload (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id TEXT NOT NULL,
        group_name TEXT NOT NULL,
        laboratory TEXT NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 20,
        teacher_id INTEGER NOT NULL,
        status BOOLEAN NOT NULL DEFAULT 1,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id) ON DELETE CASCADE,
        UNIQUE(course_id, group_name)
    )`, (err) => {
        if (err) console.error('Error creating workload table:', err.message);
    });

    // Tabla Inscription
    db.run(`CREATE TABLE IF NOT EXISTS inscription (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workload_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        status BOOLEAN NOT NULL DEFAULT 1,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workload_id) REFERENCES workload (id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE CASCADE,
        UNIQUE(workload_id, student_id)
    )`, (err) => {
        if (err) console.error('Error creating inscription table:', err.message);
    });

    // Tabla Prerequisites (relación many-to-many para Course)
    db.run(`CREATE TABLE IF NOT EXISTS prerequisites (
        course_id TEXT NOT NULL,
        prerequisite_id TEXT NOT NULL,
        PRIMARY KEY (course_id, prerequisite_id),
        FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE,
        FOREIGN KEY (prerequisite_id) REFERENCES course (id) ON DELETE CASCADE
    )`, (err) => {
        if (err) console.error('Error creating prerequisites table:', err.message);
    });
}

module.exports = db;
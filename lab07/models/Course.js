const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Course {
    // Obtener todos los cursos
    static getAll(callback) {
        const sql = `SELECT * FROM course ORDER BY curriculum, year, semester, code, name`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting courses:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Obtener un curso por ID
    static getById(id, callback) {
        const sql = `SELECT * FROM course WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error getting course by id:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

    // Crear un nuevo curso
    static create(courseData, callback) {
        const id = uuidv4();
        const {
            curriculum, year, semester, code, name, acronym, 
            credits, theory_hours, practice_hours, laboratory_hours, 
            laboratory = 1, status = 1
        } = courseData;

        // Convertir a mayúsculas
        const uppercaseName = name ? name.toUpperCase() : null;
        const uppercaseAcronym = acronym ? acronym.toUpperCase() : null;

        const sql = `INSERT INTO course (
            id, curriculum, year, semester, code, name, acronym, 
            credits, theory_hours, practice_hours, laboratory_hours, 
            laboratory, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            id, curriculum, year, semester, code, uppercaseName, uppercaseAcronym, 
            credits, theory_hours, practice_hours, laboratory_hours, 
            laboratory, status
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error creating course:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, ...courseData, name: uppercaseName, acronym: uppercaseAcronym });
        });
    }

    // Actualizar un curso
    static update(id, courseData, callback) {
        const {
            curriculum, year, semester, code, name, acronym, 
            credits, theory_hours, practice_hours, laboratory_hours, 
            laboratory, status
        } = courseData;

        // Convertir a mayúsculas
        const uppercaseName = name ? name.toUpperCase() : null;
        const uppercaseAcronym = acronym ? acronym.toUpperCase() : null;

        const sql = `UPDATE course SET 
            curriculum = ?, 
            year = ?, 
            semester = ?, 
            code = ?, 
            name = ?, 
            acronym = ?, 
            credits = ?, 
            theory_hours = ?, 
            practice_hours = ?, 
            laboratory_hours = ?, 
            laboratory = ?, 
            status = ?,
            modified = CURRENT_TIMESTAMP
            WHERE id = ?`;

        const params = [
            curriculum, year, semester, code, uppercaseName, uppercaseAcronym, 
            credits, theory_hours, practice_hours, laboratory_hours, 
            laboratory, status, id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error updating course:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, ...courseData, name: uppercaseName, acronym: uppercaseAcronym });
        });
    }

    // Eliminar un curso
    static delete(id, callback) {
        const sql = `DELETE FROM course WHERE id = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting course:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, deleted: this.changes });
        });
    }

    // Agregar prerrequisito
    static addPrerequisite(courseId, prerequisiteId, callback) {
        const sql = `INSERT INTO prerequisites (course_id, prerequisite_id) VALUES (?, ?)`;
        db.run(sql, [courseId, prerequisiteId], function(err) {
            if (err) {
                console.error('Error adding prerequisite:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { courseId, prerequisiteId, added: true });
        });
    }

    // Eliminar prerrequisito
    static removePrerequisite(courseId, prerequisiteId, callback) {
        const sql = `DELETE FROM prerequisites WHERE course_id = ? AND prerequisite_id = ?`;
        db.run(sql, [courseId, prerequisiteId], function(err) {
            if (err) {
                console.error('Error removing prerequisite:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { courseId, prerequisiteId, removed: true });
        });
    }

    // Obtener prerrequisitos de un curso
    static getPrerequisites(courseId, callback) {
        const sql = `
            SELECT c.* FROM course c
            JOIN prerequisites p ON c.id = p.prerequisite_id
            WHERE p.course_id = ?
        `;
        db.all(sql, [courseId], (err, rows) => {
            if (err) {
                console.error('Error getting prerequisites:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }
}

module.exports = Course;
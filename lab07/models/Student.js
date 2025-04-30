const db = require('../config/database');

class Student {
    // Obtener todos los estudiantes
    static getAll(callback) {
        const sql = `SELECT * FROM student ORDER BY cui, names, father_surname, mother_surname`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting students:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Obtener un estudiante por ID
    static getById(id, callback) {
        const sql = `SELECT * FROM student WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error getting student by id:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

    // Crear un nuevo estudiante
    static create(studentData, callback) {
        const {
            cui, names, father_surname, mother_surname, 
            email, phone, status = 1
        } = studentData;

        // Convertir a mayúsculas
        const uppercaseNames = names ? names.toUpperCase() : null;
        const uppercaseFatherSurname = father_surname ? father_surname.toUpperCase() : null;
        const uppercaseMotherSurname = mother_surname ? mother_surname.toUpperCase() : null;

        const sql = `INSERT INTO student (
            cui, names, father_surname, mother_surname, 
            email, phone, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            cui, uppercaseNames, uppercaseFatherSurname, uppercaseMotherSurname, 
            email, phone, status
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error creating student:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { 
                id: this.lastID, 
                cui,
                names: uppercaseNames, 
                father_surname: uppercaseFatherSurname, 
                mother_surname: uppercaseMotherSurname, 
                email, phone, status 
            });
        });
    }

    // Actualizar un estudiante
    static update(id, studentData, callback) {
        const {
            cui, names, father_surname, mother_surname, 
            email, phone, status
        } = studentData;

        // Convertir a mayúsculas
        const uppercaseNames = names ? names.toUpperCase() : null;
        const uppercaseFatherSurname = father_surname ? father_surname.toUpperCase() : null;
        const uppercaseMotherSurname = mother_surname ? mother_surname.toUpperCase() : null;

        const sql = `UPDATE student SET 
            cui = ?,
            names = ?, 
            father_surname = ?, 
            mother_surname = ?, 
            email = ?, 
            phone = ?, 
            status = ?,
            modified = CURRENT_TIMESTAMP
            WHERE id = ?`;

        const params = [
            cui, uppercaseNames, uppercaseFatherSurname, uppercaseMotherSurname, 
            email, phone, status, id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error updating student:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { 
                id, 
                cui,
                names: uppercaseNames, 
                father_surname: uppercaseFatherSurname, 
                mother_surname: uppercaseMotherSurname, 
                email, phone, status 
            });
        });
    }

    // Eliminar un estudiante
    static delete(id, callback) {
        const sql = `DELETE FROM student WHERE id = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting student:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, deleted: this.changes });
        });
    }
}

module.exports = Student;
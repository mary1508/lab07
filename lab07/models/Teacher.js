const db = require('../config/database');

class Teacher {
    // Obtener todos los profesores
    static getAll(callback) {
        const sql = `SELECT * FROM teacher ORDER BY names, father_surname, mother_surname`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting teachers:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Obtener un profesor por ID
    static getById(id, callback) {
        const sql = `SELECT * FROM teacher WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error getting teacher by id:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

    // Crear un nuevo profesor
    static create(teacherData, callback) {
        const {
            names, father_surname, mother_surname, email, 
            phone, show_phone = 0, status = 1
        } = teacherData;

        // Convertir a mayúsculas
        const uppercaseNames = names ? names.toUpperCase() : null;
        const uppercaseFatherSurname = father_surname ? father_surname.toUpperCase() : null;
        const uppercaseMotherSurname = mother_surname ? mother_surname.toUpperCase() : null;

        const sql = `INSERT INTO teacher (
            names, father_surname, mother_surname, email, 
            phone, show_phone, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            uppercaseNames, uppercaseFatherSurname, uppercaseMotherSurname, 
            email, phone, show_phone, status
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error creating teacher:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { 
                id: this.lastID, 
                names: uppercaseNames, 
                father_surname: uppercaseFatherSurname, 
                mother_surname: uppercaseMotherSurname, 
                email, phone, show_phone, status 
            });
        });
    }

    // Actualizar un profesor
    static update(id, teacherData, callback) {
        const {
            names, father_surname, mother_surname, email, 
            phone, show_phone, status
        } = teacherData;

        // Convertir a mayúsculas
        const uppercaseNames = names ? names.toUpperCase() : null;
        const uppercaseFatherSurname = father_surname ? father_surname.toUpperCase() : null;
        const uppercaseMotherSurname = mother_surname ? mother_surname.toUpperCase() : null;

        const sql = `UPDATE teacher SET 
            names = ?, 
            father_surname = ?, 
            mother_surname = ?, 
            email = ?, 
            phone = ?, 
            show_phone = ?, 
            status = ?,
            modified = CURRENT_TIMESTAMP
            WHERE id = ?`;

        const params = [
            uppercaseNames, uppercaseFatherSurname, uppercaseMotherSurname, 
            email, phone, show_phone, status, id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error updating teacher:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { 
                id, 
                names: uppercaseNames, 
                father_surname: uppercaseFatherSurname, 
                mother_surname: uppercaseMotherSurname, 
                email, phone, show_phone, status 
            });
        });
    }

    // Eliminar un profesor
    static delete(id, callback) {
        const sql = `DELETE FROM teacher WHERE id = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting teacher:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, deleted: this.changes });
        });
    }
}

module.exports = Teacher;
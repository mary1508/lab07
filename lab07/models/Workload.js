const db = require('../config/database');

class Workload {
    // Obtener todas las cargas de trabajo
    static getAll(callback) {
        const sql = `
            SELECT w.*, c.name as course_name, c.code as course_code,
                   t.names as teacher_names, t.father_surname as teacher_father_surname, 
                   t.mother_surname as teacher_mother_surname
            FROM workload w
            JOIN course c ON w.course_id = c.id
            JOIN teacher t ON w.teacher_id = t.id
            ORDER BY c.name, w.group_name, w.laboratory
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting workloads:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Obtener una carga de trabajo por ID
    static getById(id, callback) {
        const sql = `
            SELECT w.*, c.name as course_name, c.code as course_code,
                   t.names as teacher_names, t.father_surname as teacher_father_surname, 
                   t.mother_surname as teacher_mother_surname
            FROM workload w
            JOIN course c ON w.course_id = c.id
            JOIN teacher t ON w.teacher_id = t.id
            WHERE w.id = ?
        `;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error getting workload by id:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

    // Crear una nueva carga de trabajo
    static create(workloadData, callback) {
        const {
            course_id, group_name, laboratory, capacity = 20, 
            teacher_id, status = 1
        } = workloadData;

        const sql = `INSERT INTO workload (
            course_id, group_name, laboratory, capacity, 
            teacher_id, status
        ) VALUES (?, ?, ?, ?, ?, ?)`;

        const params = [
            course_id, group_name, laboratory, capacity, 
            teacher_id, status
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error creating workload:', err.message);
                callback(err, null);
                return;
            }
            
            Workload.getById(this.lastID, (err, workload) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, workload);
            });
        });
    }

    // Actualizar una carga de trabajo
    static update(id, workloadData, callback) {
        const {
            course_id, group_name, laboratory, capacity, 
            teacher_id, status
        } = workloadData;

        const sql = `UPDATE workload SET 
            course_id = ?, 
            group_name = ?, 
            laboratory = ?, 
            capacity = ?, 
            teacher_id = ?, 
            status = ?,
            modified = CURRENT_TIMESTAMP
            WHERE id = ?`;

        const params = [
            course_id, group_name, laboratory, capacity, 
            teacher_id, status, id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error updating workload:', err.message);
                callback(err, null);
                return;
            }
            
            Workload.getById(id, (err, workload) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, workload);
            });
        });
    }

    // Eliminar una carga de trabajo
    static delete(id, callback) {
        const sql = `DELETE FROM workload WHERE id = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting workload:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, deleted: this.changes });
        });
    }

    // Obtener inscripciones por ID de carga de trabajo
    static getInscriptions(workloadId, callback) {
        const sql = `
            SELECT i.*, s.cui, s.names, s.father_surname, s.mother_surname
            FROM inscription i
            JOIN student s ON i.student_id = s.id
            WHERE i.workload_id = ?
            ORDER BY s.names, s.father_surname, s.mother_surname
        `;
        db.all(sql, [workloadId], (err, rows) => {
            if (err) {
                console.error('Error getting inscriptions for workload:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Contar inscripciones por ID de carga de trabajo
    static countInscriptions(workloadId, callback) {
        const sql = `SELECT COUNT(*) as count FROM inscription WHERE workload_id = ?`;
        db.get(sql, [workloadId], (err, row) => {
            if (err) {
                console.error('Error counting inscriptions for workload:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row ? row.count : 0);
        });
    }
}

module.exports = Workload;
const db = require('../config/database');

class Inscription {
    // Obtener todas las inscripciones
    static getAll(callback) {
        const sql = `
            SELECT i.*, 
                   s.cui, s.names as student_names, s.father_surname as student_father_surname, s.mother_surname as student_mother_surname,
                   w.group_name as workload_group, w.laboratory as workload_laboratory,
                   c.name as course_name, c.code as course_code
            FROM inscription i
            JOIN student s ON i.student_id = s.id
            JOIN workload w ON i.workload_id = w.id
            JOIN course c ON w.course_id = c.id
            ORDER BY i.created DESC
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error getting inscriptions:', err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    // Obtener una inscripción por ID
    static getById(id, callback) {
        const sql = `
            SELECT i.*, 
                   s.cui, s.names as student_names, s.father_surname as student_father_surname, s.mother_surname as student_mother_surname,
                   w.group_name as workload_group, w.laboratory as workload_laboratory,
                   c.name as course_name, c.code as course_code
            FROM inscription i
            JOIN student s ON i.student_id = s.id
            JOIN workload w ON i.workload_id = w.id
            JOIN course c ON w.course_id = c.id
            WHERE i.id = ?
        `;
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error('Error getting inscription by id:', err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

    // Crear una nueva inscripción
    static create(inscriptionData, callback) {
        const { workload_id, student_id, status = 1 } = inscriptionData;

        // Primero verificamos que el workload tenga capacidad disponible
        Inscription.checkCapacity(workload_id, (err, hasCapacity) => {
            if (err) {
                callback(err, null);
                return;
            }

            if (!hasCapacity) {
                callback(new Error('La carga de trabajo ha alcanzado su capacidad máxima'), null);
                return;
            }

            // Verificar que el estudiante no esté inscrito ya
            const checkSql = `SELECT * FROM inscription WHERE workload_id = ? AND student_id = ?`;
            db.get(checkSql, [workload_id, student_id], (err, existing) => {
                if (err) {
                    console.error('Error checking existing inscription:', err.message);
                    callback(err, null);
                    return;
                }

                if (existing) {
                    callback(new Error('El estudiante ya está inscrito en esta carga de trabajo'), null);
                    return;
                }

                // Corregimos el problema: Ya no validamos si el estudiante_id es 1, permitimos inscribir a cualquier estudiante
                const sql = `INSERT INTO inscription (workload_id, student_id, status) VALUES (?, ?, ?)`;
                const params = [workload_id, student_id, status];

                db.run(sql, params, function(err) {
                    if (err) {
                        console.error('Error creating inscription:', err.message);
                        callback(err, null);
                        return;
                    }
                    
                    Inscription.getById(this.lastID, (err, inscription) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        callback(null, inscription);
                    });
                });
            });
        });
    }

    // Verificar capacidad disponible
    static checkCapacity(workload_id, callback) {
        const countSql = `SELECT COUNT(*) as current FROM inscription WHERE workload_id = ?`;
        db.get(countSql, [workload_id], (err, countResult) => {
            if (err) {
                console.error('Error counting inscriptions:', err.message);
                callback(err, null);
                return;
            }

            const capacitySql = `SELECT capacity FROM workload WHERE id = ?`;
            db.get(capacitySql, [workload_id], (err, capacityResult) => {
                if (err) {
                    console.error('Error getting workload capacity:', err.message);
                    callback(err, null);
                    return;
                }

                const current = countResult ? countResult.current : 0;
                const capacity = capacityResult ? capacityResult.capacity : 0;
                
                callback(null, current < capacity);
            });
        });
    }

    // Actualizar una inscripción
    static update(id, inscriptionData, callback) {
        const { workload_id, student_id, status } = inscriptionData;

        // Si se cambia workload_id, verificar capacidad
        if (workload_id) {
            Inscription.getById(id, (err, currentInscription) => {
                if (err) {
                    callback(err, null);
                    return;
                }

                if (!currentInscription) {
                    callback(new Error('Inscripción no encontrada'), null);
                    return;
                }

                // Si se está cambiando el workload, verificar capacidad
                if (currentInscription.workload_id !== workload_id) {
                    Inscription.checkCapacity(workload_id, (err, hasCapacity) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }

                        if (!hasCapacity) {
                            callback(new Error('La nueva carga de trabajo ha alcanzado su capacidad máxima'), null);
                            return;
                        }

                        updateInscription();
                    });
                } else {
                    updateInscription();
                }
            });
        } else {
            updateInscription();
        }

        function updateInscription() {
            const sql = `UPDATE inscription SET 
                workload_id = COALESCE(?, workload_id), 
                student_id = COALESCE(?, student_id), 
                status = COALESCE(?, status),
                modified = CURRENT_TIMESTAMP
                WHERE id = ?`;

            const params = [workload_id, student_id, status, id];

            db.run(sql, params, function(err) {
                if (err) {
                    console.error('Error updating inscription:', err.message);
                    callback(err, null);
                    return;
                }
                
                Inscription.getById(id, (err, inscription) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    callback(null, inscription);
                });
            });
        }
    }

    // Eliminar una inscripción
    static delete(id, callback) {
        const sql = `DELETE FROM inscription WHERE id = ?`;
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting inscription:', err.message);
                callback(err, null);
                return;
            }
            callback(null, { id, deleted: this.changes });
        });
    }
}

module.exports = Inscription;
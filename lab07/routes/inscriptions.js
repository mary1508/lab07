const express = require('express');
const router = express.Router();
const Inscription = require('../models/Inscription');
const Workload = require('../models/Workload');
const Student = require('../models/Student');

// Obtener todas las inscripciones
router.get('/', (req, res) => {
    Inscription.getAll((err, inscriptions) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('inscriptions/index', { inscriptions, title: 'Inscripciones' });
    });
});

// Formulario para crear una nueva inscripción
router.get('/create', (req, res) => {
    Workload.getAll((err, workloads) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        Student.getAll((err, students) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.render('inscriptions/create', { 
                workloads, 
                students, 
                title: 'Crear Inscripción'
            });
        });
    });
});

// Crear una nueva inscripción
router.post('/', (req, res) => {
    const inscriptionData = {
        workload_id: req.body.workload_id,
        student_id: req.body.student_id,
        status: req.body.status ? 1 : 0
    };

    Inscription.create(inscriptionData, (err, inscription) => {
        if (err) {
            // Mostrar el error en la página
            Workload.getAll((err2, workloads) => {
                Student.getAll((err3, students) => {
                    res.render('inscriptions/create', { 
                        workloads, 
                        students, 
                        title: 'Crear Inscripción',
                        error: err.message,
                        formData: inscriptionData
                    });
                });
            });
            return;
        }
        res.redirect('/inscriptions');
    });
});

// Obtener una inscripción para editar
router.get('/edit/:id', (req, res) => {
    const inscriptionId = req.params.id;
    
    Inscription.getById(inscriptionId, (err, inscription) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!inscription) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }
        
        Workload.getAll((err, workloads) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            Student.getAll((err, students) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.render('inscriptions/edit', { 
                    inscription, 
                    workloads, 
                    students, 
                    title: 'Editar Inscripción'
                });
            });
        });
    });
});

// Actualizar una inscripción
router.post('/update/:id', (req, res) => {
    const inscriptionId = req.params.id;
    
    const inscriptionData = {
        workload_id: req.body.workload_id,
        student_id: req.body.student_id,
        status: req.body.status ? 1 : 0
    };

    Inscription.update(inscriptionId, inscriptionData, (err, inscription) => {
        if (err) {
            // Mostrar el error en la página
            Inscription.getById(inscriptionId, (err2, currentInscription) => {
                Workload.getAll((err3, workloads) => {
                    Student.getAll((err4, students) => {
                        res.render('inscriptions/edit', { 
                            inscription: currentInscription, 
                            workloads, 
                            students, 
                            title: 'Editar Inscripción',
                            error: err.message,
                            formData: inscriptionData
                        });
                    });
                });
            });
            return;
        }
        res.redirect('/inscriptions');
    });
});

// Eliminar una inscripción
router.post('/delete/:id', (req, res) => {
    const inscriptionId = req.params.id;
    
    Inscription.delete(inscriptionId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/inscriptions');
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Workload = require('../models/Workload');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

// Obtener todas las cargas de trabajo
router.get('/', (req, res) => {
    Workload.getAll((err, workloads) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('workloads/index', { 
            workloads, 
            title: 'Cargas de Trabajo',
            laboratories: {
                'lab01': 'Laboratorio 01',
                'lab02': 'Laboratorio 02',
                'lab03': 'Laboratorio 03',
                'lab04': 'Laboratorio 04',
                'lab05': 'Laboratorio 05',
                'lab06': 'Laboratorio 06',
                'lab07': 'Laboratorio 07',
                'lab08': 'Laboratorio 08'
            },
            groups: ['A', 'B', 'C', 'D', 'E', 'F']
        });
    });
});

// Formulario para crear una nueva carga de trabajo
router.get('/create', (req, res) => {
    Course.getAll((err, courses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        Teacher.getAll((err, teachers) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.render('workloads/create', { 
                courses, 
                teachers, 
                title: 'Crear Carga de Trabajo',
                laboratories: {
                    'lab01': 'Laboratorio 01',
                    'lab02': 'Laboratorio 02',
                    'lab03': 'Laboratorio 03',
                    'lab04': 'Laboratorio 04',
                    'lab05': 'Laboratorio 05',
                    'lab06': 'Laboratorio 06',
                    'lab07': 'Laboratorio 07',
                    'lab08': 'Laboratorio 08'
                },
                groups: ['A', 'B', 'C', 'D', 'E', 'F']
            });
        });
    });
});

// Crear una nueva carga de trabajo
router.post('/', (req, res) => {
    const workloadData = {
        course_id: req.body.course_id,
        group_name: req.body.group_name,
        laboratory: req.body.laboratory,
        capacity: req.body.capacity,
        teacher_id: req.body.teacher_id,
        status: req.body.status ? 1 : 0
    };

    Workload.create(workloadData, (err, workload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/workloads');
    });
});

// Obtener una carga de trabajo para editar
router.get('/edit/:id', (req, res) => {
    const workloadId = req.params.id;
    
    Workload.getById(workloadId, (err, workload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!workload) {
            return res.status(404).json({ error: 'Carga de trabajo no encontrada' });
        }
        
        Course.getAll((err, courses) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            Teacher.getAll((err, teachers) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.render('workloads/edit', { 
                    workload, 
                    courses, 
                    teachers, 
                    title: 'Editar Carga de Trabajo',
                    laboratories: {
                        'lab01': 'Laboratorio 01',
                        'lab02': 'Laboratorio 02',
                        'lab03': 'Laboratorio 03',
                        'lab04': 'Laboratorio 04',
                        'lab05': 'Laboratorio 05',
                        'lab06': 'Laboratorio 06',
                        'lab07': 'Laboratorio 07',
                        'lab08': 'Laboratorio 08'
                    },
                    groups: ['A', 'B', 'C', 'D', 'E', 'F']
                });
            });
        });
    });
});

// Actualizar una carga de trabajo
router.post('/update/:id', (req, res) => {
    const workloadId = req.params.id;
    
    const workloadData = {
        course_id: req.body.course_id,
        group_name: req.body.group_name,
        laboratory: req.body.laboratory,
        capacity: req.body.capacity,
        teacher_id: req.body.teacher_id,
        status: req.body.status ? 1 : 0
    };

    Workload.update(workloadId, workloadData, (err, workload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/workloads');
    });
});

// Eliminar una carga de trabajo
router.post('/delete/:id', (req, res) => {
    const workloadId = req.params.id;
    
    Workload.delete(workloadId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/workloads');
    });
});

// Ver inscripciones para una carga de trabajo
router.get('/:id/inscriptions', (req, res) => {
    const workloadId = req.params.id;
    
    Workload.getById(workloadId, (err, workload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!workload) {
            return res.status(404).json({ error: 'Carga de trabajo no encontrada' });
        }
        
        Workload.getInscriptions(workloadId, (err, inscriptions) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.render('workloads/inscriptions', { 
                workload, 
                inscriptions, 
                title: 'Inscripciones - ' + workload.course_name + ' (' + workload.group_name + ')'
            });
        });
    });
});

module.exports = router;
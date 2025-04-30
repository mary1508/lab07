const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Obtener todos los estudiantes
router.get('/', (req, res) => {
    Student.getAll((err, students) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('students/index', { students, title: 'Estudiantes' });
    });
});

// Formulario para crear un nuevo estudiante
router.get('/create', (req, res) => {
    res.render('students/create', { title: 'Crear Estudiante' });
});

// Crear un nuevo estudiante
router.post('/', (req, res) => {
    const studentData = {
        cui: req.body.cui,
        names: req.body.names,
        father_surname: req.body.father_surname,
        mother_surname: req.body.mother_surname,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status ? 1 : 0
    };

    Student.create(studentData, (err, student) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/students');
    });
});

// Obtener un estudiante para editar
router.get('/edit/:id', (req, res) => {
    const studentId = req.params.id;
    
    Student.getById(studentId, (err, student) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.render('students/edit', { student, title: 'Editar Estudiante' });
    });
});

// Actualizar un estudiante
router.post('/update/:id', (req, res) => {
    const studentId = req.params.id;
    
    const studentData = {
        cui: req.body.cui,
        names: req.body.names,
        father_surname: req.body.father_surname,
        mother_surname: req.body.mother_surname,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status ? 1 : 0
    };

    Student.update(studentId, studentData, (err, student) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/students');
    });
});

// Eliminar un estudiante
router.post('/delete/:id', (req, res) => {
    const studentId = req.params.id;
    
    Student.delete(studentId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/students');
    });
});

module.exports = router;
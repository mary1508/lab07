const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Obtener todos los profesores
router.get('/', (req, res) => {
    Teacher.getAll((err, teachers) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('teachers/index', { teachers, title: 'Profesores' });
    });
});

// Formulario para crear un nuevo profesor
router.get('/create', (req, res) => {
    res.render('teachers/create', { title: 'Crear Profesor' });
});

// Crear un nuevo profesor
router.post('/', (req, res) => {
    const teacherData = {
        names: req.body.names,
        father_surname: req.body.father_surname,
        mother_surname: req.body.mother_surname,
        email: req.body.email,
        phone: req.body.phone,
        show_phone: req.body.show_phone ? 1 : 0,
        status: req.body.status ? 1 : 0
    };

    Teacher.create(teacherData, (err, teacher) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/teachers');
    });
});

// Obtener un profesor para editar
router.get('/edit/:id', (req, res) => {
    const teacherId = req.params.id;
    
    Teacher.getById(teacherId, (err, teacher) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!teacher) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        res.render('teachers/edit', { teacher, title: 'Editar Profesor' });
    });
});

// Actualizar un profesor
router.post('/update/:id', (req, res) => {
    const teacherId = req.params.id;
    
    const teacherData = {
        names: req.body.names,
        father_surname: req.body.father_surname,
        mother_surname: req.body.mother_surname,
        email: req.body.email,
        phone: req.body.phone,
        show_phone: req.body.show_phone ? 1 : 0,
        status: req.body.status ? 1 : 0
    };

    Teacher.update(teacherId, teacherData, (err, teacher) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/teachers');
    });
});

// Eliminar un profesor
router.post('/delete/:id', (req, res) => {
    const teacherId = req.params.id;
    
    Teacher.delete(teacherId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/teachers');
    });
});

module.exports = router;
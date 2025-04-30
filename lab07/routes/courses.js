const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Obtener todos los cursos
router.get('/', (req, res) => {
    Course.getAll((err, courses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('courses/index', { 
            courses, 
            title: 'Cursos',
            curriculums: { 0: 'Sin Plan', 2017: 'Plan 2017', 2023: 'Plan 2023' },
            years: { 0: 'Sin año', 1: '1er año', 2: '2do año', 3: '3er año', 4: '4to año', 5: '5to año', 6: '6to año', 7: '7mo año' },
            semesters: { 0: 'Sin semestre', 1: 'I semestre', 2: 'II semestre', 3: 'III semestre', 4: 'IV semestre', 5: 'V semestre', 6: 'VI semestre', 7: 'VII semestre', 8: 'VIII semestre', 9: 'IX semestre', 10: 'X semestre' }
        });
    });
});

// Formulario para crear un nuevo curso
router.get('/create', (req, res) => {
    Course.getAll((err, courses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('courses/create', { 
            title: 'Crear Curso',
            courses,
            curriculums: { 0: 'Sin Plan', 2017: 'Plan 2017', 2023: 'Plan 2023' },
            years: { 0: 'Sin año', 1: '1er año', 2: '2do año', 3: '3er año', 4: '4to año', 5: '5to año', 6: '6to año', 7: '7mo año' },
            semesters: { 0: 'Sin semestre', 1: 'I semestre', 2: 'II semestre', 3: 'III semestre', 4: 'IV semestre', 5: 'V semestre', 6: 'VI semestre', 7: 'VII semestre', 8: 'VIII semestre', 9: 'IX semestre', 10: 'X semestre' }
        });
    });
});

// Crear un nuevo curso
router.post('/', (req, res) => {
    const courseData = {
        curriculum: req.body.curriculum,
        year: req.body.year,
        semester: req.body.semester,
        code: req.body.code,
        name: req.body.name,
        acronym: req.body.acronym,
        credits: req.body.credits,
        theory_hours: req.body.theory_hours,
        practice_hours: req.body.practice_hours,
        laboratory_hours: req.body.laboratory_hours,
        laboratory: req.body.laboratory ? 1 : 0,
        status: req.body.status ? 1 : 0
    };

    Course.create(courseData, (err, course) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Manejar prerrequisitos si se enviaron
        if (req.body.prerequisites && Array.isArray(req.body.prerequisites)) {
            let processed = 0;
            
            if (req.body.prerequisites.length === 0) {
                return res.redirect('/courses');
            }
            
            req.body.prerequisites.forEach(prereqId => {
                Course.addPrerequisite(course.id, prereqId, (err) => {
                    processed++;
                    if (processed === req.body.prerequisites.length) {
                        return res.redirect('/courses');
                    }
                });
            });
        } else {
            res.redirect('/courses');
        }
    });
});

// Obtener un curso para editar
router.get('/edit/:id', (req, res) => {
    const courseId = req.params.id;
    
    Course.getById(courseId, (err, course) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!course) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        
        Course.getAll((err, allCourses) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            Course.getPrerequisites(courseId, (err, prerequisites) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                const prereqIds = prerequisites.map(p => p.id);
                
                res.render('courses/edit', { 
                    course, 
                    allCourses: allCourses.filter(c => c.id !== courseId), 
                    prerequisites,
                    prereqIds,
                    title: 'Editar Curso',
                    curriculums: { 0: 'Sin Plan', 2017: 'Plan 2017', 2023: 'Plan 2023' },
                    years: { 0: 'Sin año', 1: '1er año', 2: '2do año', 3: '3er año', 4: '4to año', 5: '5to año', 6: '6to año', 7: '7mo año' },
                    semesters: { 0: 'Sin semestre', 1: 'I semestre', 2: 'II semestre', 3: 'III semestre', 4: 'IV semestre', 5: 'V semestre', 6: 'VI semestre', 7: 'VII semestre', 8: 'VIII semestre', 9: 'IX semestre', 10: 'X semestre' }
                });
            });
        });
    });
});

// Actualizar un curso
router.post('/update/:id', (req, res) => {
    const courseId = req.params.id;
    
    const courseData = {
        curriculum: req.body.curriculum,
        year: req.body.year,
        semester: req.body.semester,
        code: req.body.code,
        name: req.body.name,
        acronym: req.body.acronym,
        credits: req.body.credits,
        theory_hours: req.body.theory_hours,
        practice_hours: req.body.practice_hours,
        laboratory_hours: req.body.laboratory_hours,
        laboratory: req.body.laboratory ? 1 : 0,
        status: req.body.status ? 1 : 0
    };

    Course.update(courseId, courseData, (err, course) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Primero obtener los prerequisitos actuales
        Course.getPrerequisites(courseId, (err, currentPrereqs) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            const currentIds = currentPrereqs.map(p => p.id);
            const newIds = req.body.prerequisites ? 
                (Array.isArray(req.body.prerequisites) ? req.body.prerequisites : [req.body.prerequisites]) : 
                [];
            
            // Eliminar los que ya no están
            const toRemove = currentIds.filter(id => !newIds.includes(id));
            
            // Agregar los nuevos
            const toAdd = newIds.filter(id => !currentIds.includes(id));
            
            let processed = 0;
            const total = toRemove.length + toAdd.length;
            
            if (total === 0) {
                return res.redirect('/courses');
            }
            
            toRemove.forEach(prereqId => {
                Course.removePrerequisite(courseId, prereqId, (err) => {
                    processed++;
                    if (processed === total) {
                        return res.redirect('/courses');
                    }
                });
            });
            
            toAdd.forEach(prereqId => {
                Course.addPrerequisite(courseId, prereqId, (err) => {
                    processed++;
                    if (processed === total) {
                        return res.redirect('/courses');
                    }
                });
            });
        });
    });
});

// Eliminar un curso
router.post('/delete/:id', (req, res) => {
    const courseId = req.params.id;
    
    Course.delete(courseId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/courses');
    });
});

module.exports = router;
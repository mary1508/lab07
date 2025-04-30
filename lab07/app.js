const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');

// Importar rutas
const indexRoutes = require('./routes/index');
const coursesRoutes = require('./routes/courses');
const teachersRoutes = require('./routes/teachers');
const studentsRoutes = require('./routes/students');
const workloadsRoutes = require('./routes/workloads');
const inscriptionsRoutes = require('./routes/inscriptions');

// Inicializar la aplicación
const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layout');

// Configurar rutas
app.use('/', indexRoutes);
app.use('/courses', coursesRoutes);
app.use('/teachers', teachersRoutes);
app.use('/students', studentsRoutes);
app.use('/workloads', workloadsRoutes);
app.use('/inscriptions', inscriptionsRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('error', { 
        title: 'Página no encontrada',
        message: 'La página que está buscando no existe.'
    });
});

// Manejo de errores 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error en el servidor',
        message: 'Ha ocurrido un error en el servidor.'
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
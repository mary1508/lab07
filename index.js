// Cambiar este archivo a ES Modules
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { sequelize, Course, Teacher, Student, Workload, Inscription, Pets } from './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Database, Resource } from '@adminjs/sequelize';

AdminJS.registerAdapter({ Database, Resource });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Creamos la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Opciones de AdminJS
const adminOptions = {
  resources: [
    {
      resource: Course,
      options: {
        properties: {
          curriculum: {
            availableValues: [
              { value: 0, label: 'Sin Plan' },
              { value: 2017, label: 'Plan 2017' },
              { value: 2023, label: 'Plan 2023' }
            ]
          },
          year: {
            availableValues: [
              { value: 0, label: 'Sin año' },
              { value: 1, label: '1er año' },
              { value: 2, label: '2do año' },
              { value: 3, label: '3er año' },
              { value: 4, label: '4to año' },
              { value: 5, label: '5to año' },
              { value: 6, label: '6to año' },
              { value: 7, label: '7mo año' }
            ]
          },
          semester: {
            availableValues: [
              { value: 0, label: 'Sin semestre' },
              { value: 1, label: 'I semestre' },
              { value: 2, label: 'II semestre' },
              { value: 3, label: 'III semestre' },
              { value: 4, label: 'IV semestre' },
              { value: 5, label: 'V semestre' },
              { value: 6, label: 'VI semestre' },
              { value: 7, label: 'VII semestre' },
              { value: 8, label: 'VIII semestre' },
              { value: 9, label: 'IX semestre' },
              { value: 10, label: 'X semestre' }
            ]
          }
        }
      }
    },
    {
      resource: Teacher,
      options: {}
    },
    {
      resource: Student,
      options: {}
    },
    {
      resource: Workload,
      options: {
        properties: {
          group_name: {
            availableValues: [
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
              { value: 'D', label: 'D' },
              { value: 'E', label: 'E' },
              { value: 'F', label: 'F' }
            ]
          },
          laboratory: {
            availableValues: [
              { value: 'lab01', label: 'Laboratorio 01' },
              { value: 'lab02', label: 'Laboratorio 02' },
              { value: 'lab03', label: 'Laboratorio 03' },
              { value: 'lab04', label: 'Laboratorio 04' },
              { value: 'lab05', label: 'Laboratorio 05' },
              { value: 'lab06', label: 'Laboratorio 06' },
              { value: 'lab07', label: 'Laboratorio 07' },
              { value: 'lab08', label: 'Laboratorio 08' }
            ]
          }
        }
      }
    },
    {
      resource: Inscription,
      options: {}
    },

    {
      resource: Pets,
      options: {}
    }
  ],
  branding: {
    companyName: 'Sistema de Inscripción de Cursos',
    logo: false,
    softwareBrothers: false,
  },
  locale: {
    language: 'es',
    translations: {
      messages: {
        welcomeOnBoard_title: 'Bienvenido al Sistema de Inscripción',
        welcomeOnBoard_subtitle: 'Gestione cursos, profesores, estudiantes e inscripciones fácilmente.',
      },
      labels: {
        Course: 'Curso',
        Teacher: 'Profesor',
        Student: 'Estudiante',
        Workload: 'Carga de Trabajo',
        Inscription: 'Inscripción',
      },
      properties: {
        // Course
        id: 'ID',
        curriculum: 'Plan de Estudios',
        year: 'Año',
        semester: 'Semestre',
        code: 'Código',
        name: 'Nombre',
        acronym: 'Acrónimo',
        credits: 'Créditos',
        theory_hours: 'Horas Teoría',
        practice_hours: 'Horas Práctica',
        laboratory_hours: 'Horas Laboratorio',
        laboratory: '¿Tiene Laboratorio?',
        status: 'Estado',
        created: 'Creado',
        modified: 'Modificado',
        // Teacher
        names: 'Nombres',
        father_surname: 'Apellido Paterno',
        mother_surname: 'Apellido Materno',
        email: 'Email',
        phone: 'Teléfono',
        show_phone: 'Mostrar Teléfono',
        // Student
        cui: 'CUI',
        // Workload
        course_id: 'Curso',
        teacher_id: 'Profesor',
        group_name: 'Grupo',
        laboratory: 'Laboratorio',
        capacity: 'Capacidad',
        // Inscription
        workload_id: 'Carga de Trabajo',
        student_id: 'Estudiante',
      }
    }
  }
};

// Crear instancia de AdminJS
const admin = new AdminJS(adminOptions);

// Crear router de AdminJS
const router = AdminJSExpress.buildRouter(admin);

// Usar el router de AdminJS
app.use(admin.options.rootPath, router);

// Página de inicio
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Sincronizar modelos con la base de datos y arrancar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
      console.log(`Panel de administración disponible en http://localhost:${port}/admin`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

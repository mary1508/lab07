import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar Sequelize para usar SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db/enrollment.db'),
  logging: false
});

// Importar modelos
import CourseModel from './Course.js';
import TeacherModel from './Teacher.js';
import StudentModel from './Student.js';
import WorkloadModel from './Workload.js';
import InscriptionModel from './Inscription.js';
import PetsModel from './Pets.js';

// Definir modelos
const Course = CourseModel(sequelize);
const Teacher = TeacherModel(sequelize);
const Student = StudentModel(sequelize);
const Workload = WorkloadModel(sequelize);
const Inscription = InscriptionModel(sequelize);
const Pets = PetsModel(sequelize);

// Definir relaciones
Course.hasMany(Workload, { foreignKey: 'course_id' });
Workload.belongsTo(Course, { foreignKey: 'course_id' });

Teacher.hasMany(Workload, { foreignKey: 'teacher_id' });
Workload.belongsTo(Teacher, { foreignKey: 'teacher_id' });

Workload.hasMany(Inscription, { foreignKey: 'workload_id' });
Inscription.belongsTo(Workload, { foreignKey: 'workload_id' });

Student.hasMany(Inscription, { foreignKey: 'student_id' });
Inscription.belongsTo(Student, { foreignKey: 'student_id' });

Course.belongsToMany(Course, { 
  as: 'Prerequisites', 
  through: 'course_prerequisites',
  foreignKey: 'course_id',
  otherKey: 'prerequisite_id'
});

// Exportar modelos y conexión
export { sequelize, Course, Teacher, Student, Workload, Inscription,Pets };

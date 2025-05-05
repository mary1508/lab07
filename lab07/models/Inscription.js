import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Inscription = sequelize.define('Inscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'inscriptions',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    hooks: {
      beforeCreate: async (inscription) => {
        // Verifica que no exista una inscripción duplicada
        const existingInscription = await sequelize.models.Inscription.findOne({
          where: {
            workload_id: inscription.workload_id,
            student_id: inscription.student_id
          }
        });
        
        if (existingInscription) {
          throw new Error('El estudiante ya está inscrito en esta carga de trabajo');
        }

        // Verifica la capacidad disponible
        const workload = await sequelize.models.Workload.findByPk(inscription.workload_id);
        const inscriptionCount = await sequelize.models.Inscription.count({
          where: { workload_id: inscription.workload_id }
        });

        if (inscriptionCount >= workload.capacity) {
          throw new Error('La carga de trabajo ha alcanzado su capacidad máxima');
        }
      }
    }
  });

  return Inscription;
};

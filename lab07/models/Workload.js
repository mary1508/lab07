import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Workload = sequelize.define('Workload', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group_name: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: 'A'
    },
    laboratory: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: 'lab01'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'workloads',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  });

  return Workload;
};

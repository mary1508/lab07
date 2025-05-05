import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    curriculum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2017
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    code: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.toUpperCase());
      }
    },
    acronym: {
      type: DataTypes.STRING(25),
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue('acronym', value.toUpperCase());
        }
      }
    },
    credits: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true
    },
    theory_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    practice_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    laboratory_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    laboratory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  });

  return Course;
};

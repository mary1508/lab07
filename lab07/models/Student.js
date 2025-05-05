import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    names: {
      type: DataTypes.STRING(155),
      allowNull: false,
      set(value) {
        this.setDataValue('names', value.toUpperCase());
      }
    },
    father_surname: {
      type: DataTypes.STRING(155),
      allowNull: false,
      set(value) {
        this.setDataValue('father_surname', value.toUpperCase());
      }
    },
    mother_surname: {
      type: DataTypes.STRING(155),
      allowNull: false,
      set(value) {
        this.setDataValue('mother_surname', value.toUpperCase());
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'students',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  });

  return Student;
};

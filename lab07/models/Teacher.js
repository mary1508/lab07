import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    show_phone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  });

  return Teacher;
};

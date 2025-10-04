import { sequelize } from "../database/db.connection.js";
import { DataTypes } from "sequelize";

const skills = sequelize.define('skills', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

     status: {
        type: DataTypes.ENUM(0,1),
        allowNull: false,
        defaultValue: 1
    },

    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },

    created_on: {
        type: DataTypes.DATE,
        allowNull: false
    },

},
{
    tableName: 'skills',
    timestamps: false
})

export { skills };
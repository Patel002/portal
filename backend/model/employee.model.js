import { sequelize } from "../database/db.connection.js";
import { DataTypes } from "sequelize";

const Employee = sequelize.define('employee',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    em_id: {
        type: DataTypes.STRING,
        // allowNull: false
    },

    em_code: {
        type: DataTypes.STRING,
        allowNull: false
    },

    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    em_email: DataTypes.STRING,
    username: DataTypes.STRING,
    em_password: DataTypes.TEXT,
    em_address: DataTypes.STRING,
    em_phone: DataTypes.STRING,
    em_birthday: DataTypes.DATEONLY,
    em_joining_date: DataTypes.DATEONLY,
    em_image: DataTypes.TEXT,
    

    em_role: DataTypes.ENUM('ADMIN', 'EMPLOYEE', 'SUPER ADMIN', 'BD', 'COMPANY'),
    role_id: DataTypes.STRING,
    em_gender: DataTypes.ENUM('Male', 'Female'),

    is_reporting: DataTypes.ENUM('YES', 'NO'),
    status: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    supervisor_id: DataTypes.STRING,

    created_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_at: DataTypes.DATE,
    updated_by: DataTypes.STRING,

},{
    tableName: 'employee',
    timestamps: false
})

export { Employee };
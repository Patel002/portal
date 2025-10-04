import { sequelize } from '../database/db.connection.js';
import { DataTypes } from 'sequelize';

const ClientRegistration = sequelize.define('client_register2', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    client_id: DataTypes.INTEGER,
    post_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deleted: {
        type: DataTypes.ENUM("Y", "N"),
        allowNull: false,
        defaultValue: "N"
    },
    address_type: DataTypes.STRING,
    email: DataTypes.STRING,
    landline_code: DataTypes.STRING,
    landline_no: DataTypes.STRING,
    mobile_code: DataTypes.STRING,
    mobile_no: DataTypes.STRING,
    entity_name: DataTypes.STRING,
    care_type: DataTypes.STRING,
    facility_contact_name: DataTypes.STRING,
    client_need: DataTypes.STRING,
    status: DataTypes.ENUM('0', '1'),
    created_on: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_on: DataTypes.DATE,

},{
    tableName: 'client_register_step2',
    timestamps: false
})

export { ClientRegistration };
import { sequelize } from "../database/db.connection.js";
import { DataTypes } from "sequelize";

const shift_patterns = sequelize.define('shift_patterns', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shift_pattern: {
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
        allowNull: true
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deleted: {
        type: DataTypes.ENUM("Y", "N"),
        allowNull: false,
        defaultValue: "N"
    },
    sr: {
        type: DataTypes.INTEGER
    },
    remark: {
        type: DataTypes.STRING
    }

},
{
    tableName: 'shift_patterns',
    timestamps: false
})

export { shift_patterns };
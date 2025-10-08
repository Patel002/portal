import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'dhtservices_nightingale',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
        timezone: '+05:30'
    }
)

export { sequelize }
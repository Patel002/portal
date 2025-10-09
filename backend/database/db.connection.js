import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'recruit_portal',
    'mech_dht',
    '2lPIac7ddOpfapJH',
    {
        host: '103.250.153.83:81',
        dialect: 'mysql',
        logging: false,
        timezone: '+05:30'
    }
)

export { sequelize }
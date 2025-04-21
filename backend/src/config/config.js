
    require('dotenv/config'); 

    module.exports = {
      development: {
        username:  'postgres',//process.env.POSTGRES_USER,
        password:  'admin', //process.env.POSTGRES_PASSWORD,
        database:  'finsim_db',//process.env.POSTGRES_DB,
        
        host:  'localhost',//process.env.DB_HOST,
        port:  5432,//process.env.DB_PORT || 5432,
        dialect: 'postgres',
        "dialectOptions": {
          "ssl": false // O configuración adecuada
        }
      }
    };
    
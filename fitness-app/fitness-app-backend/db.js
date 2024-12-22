const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    password: 'abcd', // .env 파일에 설정된 비밀번호
    host: 'localhost',
    port: 5432,
    database: 'fitness_app',
});

module.exports = pool;

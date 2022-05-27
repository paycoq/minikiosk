const mariadb = require('mariadb');
const config = require('../config/db-config.json')

//파라미터 json이 아니라 객체인듯 참고하세요
const pool = mariadb.createPool({
  host: config.host, 
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit
});

//미완성
async function asyncFunction(sql, values, callback) {
  let conn;
  let result;
  try {
	  conn = await pool.getConnection();
    result = await conn.query(sql, values);
    return callback(result);
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      return conn.end()
    };
    return;
  }
}

module.exports = asyncFunction;
var mysql=require('mysql');
//conexion a la base de datos
 conectar=()=>{
     var connection;
     connection = mysql.createConnection({
        host:'212.18.232.34',
        user:'jpgproye_1',
        password:'AdministradoresJPG',
        database:'jpgproye_CosseteItecor'
        });
        return connection
 }
exports.conectar=conectar;

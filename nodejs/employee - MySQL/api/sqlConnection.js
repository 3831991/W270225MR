import mysql from 'mysql2';

// חיבור למסד הנתונים
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    // port: 8889, // למחשבי Mac
    database: 'full-stack-w270225mr',
});

connection.connect(err => {
    if (err) {
        throw err;
    }

    console.log("Connection to MySQL");
});
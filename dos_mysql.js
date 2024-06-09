const express = require('express');
const mysql = require('mysql');

const app = express();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SenhaSegura123!',
    database: 'financial',
    port: 3306 
});


connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem sucedida ao banco de dados');
});


app.get('/dados', (req, res) => {
    connection.query('SELECT * FROM financial.account', (err, results) => {
        if (err) {
            console.error('Erro ao enviar consulta:', err);
            res.status(500).send('Erro ao buscar dados do banco de dados');
            return;
        }
        res.json(results);
    });
});

setInterval(() => {
    connection.query('SELECT * FROM financial.account', (err, results) => {
        if (err) {
            console.error('Erro ao enviar consulta:', err);
            return;
        }
        console.log('Consulta bem sucedida. Resultados:', results);
    });
}, 100); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

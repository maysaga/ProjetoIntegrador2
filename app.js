// Importar módulo express
const express = require('express');

// Importar módulo MySQL
const mysql = require('mysql2');

// Objeto para referenciar o express
const app = express();

// Usar middleware para JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar rotas estáticas
app.use('/html', express.static('html'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/imagens', express.static('imagens'));

// Configuração de conexão com o banco de dados
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'academia_ginastica'
});

// Teste de conexão
conexao.connect((erro) => {
    if (erro) throw erro;
    console.log('Conexão efetuada com sucesso!');
});

/* ROTA PARA O CADASTRO */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/cadastro.html');
});

app.post('/cadastrar', function (req, res) {
    const { nome, data, cpf, email, celular, cep, estado, cidade, bairro, rua, numero, genero, peso, altura, objetivos } = req.body;

    // Verificar se o CPF já existe
    const sqlVerificarCPF = 'SELECT * FROM ALUNOS WHERE CPF = ?';
    conexao.query(sqlVerificarCPF, [cpf], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.status(500).send("Erro ao verificar CPF");
        }

        if (resultados.length > 0) {
            return res.status(400).send("Este CPF já está cadastrado.");
        } else {
            // Inserir dados na tabela ALUNOS
            const sqlInserirAluno = `INSERT INTO ALUNOS (NOME, DATA_NASC, CPF, EMAIL, CELULAR, CEP, ESTADO, CIDADE, BAIRRO, RUA, NUMERO, GENERO, PESO, ALTURA, OBJETIVO) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            conexao.query(sqlInserirAluno, [nome, data, cpf, email, celular, cep, estado, cidade, bairro, rua, numero, genero, peso, altura, objetivos], (erro, retorno) => {
                if (erro) {
                    console.error("Erro ao cadastrar:", erro);
                    return res.status(500).send("Erro ao cadastrar aluno.");
                }
        
                console.log(retorno);
                res.sendFile(__dirname + '/html/index.html');
            });
        }
    });
});

/* ROTA PARA CATRACA */
app.post('/catraca', (req, res) => {
    const { cpf } = req.body;

    const sqlVerificarCPF = 'SELECT * FROM ALUNOS WHERE CPF = ?';
    conexao.query(sqlVerificarCPF, [cpf], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.status(500).send("Erro ao verificar CPF.");
        }

        if (resultados.length === 0) {
            return res.status(400).send("CPF não encontrado no sistema.");
        }

        // Buscar último registro de treino
        const sqlBuscarUltimoRegistro = `
            SELECT * FROM REGISTROS_TREINOS 
            WHERE CPF = ? 
            ORDER BY DATA_HORA_INICIO DESC 
            LIMIT 1`;
        conexao.query(sqlBuscarUltimoRegistro, [cpf], (erro, registro) => {
            if (erro) {
                console.error("Erro ao buscar último registro:", erro);
                return res.status(500).send("Erro ao buscar último registro.");
            }

            if (registro.length === 0 || registro[0].DATA_HORA_FIM !== null) {
                // Registrar entrada
                const sqlRegistrarEntrada = `INSERT INTO REGISTROS_TREINOS (CPF) VALUES (?)`;
                conexao.query(sqlRegistrarEntrada, [cpf], (erro, resultado) => {
                    if (erro) {
                        console.error("Erro ao registrar entrada:", erro);
                        return res.status(500).send("Erro ao registrar entrada.");
                    }
                    res.send("Entrada registrada com sucesso!");
                });
            } else {
                // Registrar saída
                const sqlRegistrarSaida = `
                    UPDATE REGISTROS_TREINOS 
                    SET DATA_HORA_FIM = NOW() 
                    WHERE ID = ?`;
                conexao.query(sqlRegistrarSaida, [registro[0].ID], (erro, resultado) => {
                    if (erro) {
                        console.error("Erro ao registrar saída:", erro);
                        return res.status(500).send("Erro ao registrar saída.");
                    }
                    res.send("Saída registrada com sucesso!");
                });
            }
        });
    });
});

/* ROTA PARA VERIFICAR CPF */
app.get('/verificar-cpf', function (req, res) {
    const cpf = req.query.cpf;

    const sqlVerificarCPF = 'SELECT * FROM ALUNOS WHERE CPF = ?';
    conexao.query(sqlVerificarCPF, [cpf], (erro, resultados) => {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.status(500).json({ mensagem: "Erro ao verificar CPF" });
        }

        if (resultados.length > 0) {
            res.json({ existe: true });
        } else {
            res.json({ existe: false });
        }
    });
});

// Iniciar o servidor
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080");
});

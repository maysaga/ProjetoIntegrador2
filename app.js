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
    password: '@Melo241',
    database: 'academia_ginastica',
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

// ROTA PARA VERIFICAR CPF
app.get('/verificar-cpf', function (req, res) {
    const cpf = req.query.cpf;

    let sqlVerificarCPF = 'SELECT * FROM ALUNOS WHERE CPF = ?';
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

// ROTA PARA REGISTRAR ENTRADA E SAÍDA NA CATRACA
app.get('/catraca', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/catraca.html'));
});

app.post('/catraca', function(req, res) {
    const cpf = req.body.cpf;
    const tipoRegistro = req.body.tipoRegistro; // entrada ou saida
    const dataHoraAtual = new Date();
    dataHoraAtual.setHours(dataHoraAtual.getHours() - 3);  // Ajuste para o fuso horário de Brasília (GMT-3)
    const dataHoraAtualFormatada = dataHoraAtual.toISOString().slice(0, 19).replace('T', ' '); // Formato MySQL


    // Verifica se o tipo de registro é válido (entrada ou saída)
    if (tipoRegistro !== 'entrada' && tipoRegistro !== 'saida') {
        return res.json({ success: false, message: "Tipo de registro inválido!" });
    }

    // Verificar se o CPF existe na tabela ALUNOS
    const sqlVerificarCPF = `SELECT ID FROM ALUNOS WHERE CPF = ?`;
    conexao.query(sqlVerificarCPF, [cpf], function(erro, resultados) {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.json({ success: false, message: "Erro ao verificar CPF" });
        }

        if (resultados.length === 0) {
            return res.json({ success: false, message: "CPF não encontrado!" });
        }

        // Recupera o ID do aluno (assumindo que a tabela ALUNOS tenha uma coluna ID_ALUNO)
        const idAluno = resultados[0].ID;

        // Verificar registros anteriores na catraca
        const sqlVerificarRegistro = `SELECT * FROM catraca WHERE ID_ALUNO = ? AND DATA_HORA_SAIDA IS NULL`;
        conexao.query(sqlVerificarRegistro, [idAluno], (erro, registros) => {
            if (erro) {
                console.error("Erro ao verificar registros:", erro);
                return res.json({ success: false, message: "Erro ao verificar registros" });
            }

            if (tipoRegistro === 'entrada') {
                // Bloquear nova entrada se já houver uma entrada sem saída
                if (registros.length > 0) {
                    return res.json({ success: false, message: "O aluno já possui uma entrada sem saída registrada." });
                }

                // Inserir nova entrada
                const sqlEntrada = `INSERT INTO catraca (CPF, ID_ALUNO, DATA_HORA_ENTRADA) VALUES (?, ?, ?)`;
                conexao.query(sqlEntrada, [cpf, idAluno, dataHoraAtualFormatada], (erro) => {
                    if (erro) {
                        console.error("Erro ao registrar entrada:", erro);
                        return res.json({ success: false, message: "Erro ao registrar entrada" });
                    }
                    return res.json({ success: true, message: "Entrada registrada com sucesso!" });
                });
            } else if (tipoRegistro === 'saida') {
                // Verificar se há uma entrada pendente
                if (registros.length === 0) {
                    return res.json({ success: false, message: "Não há entrada registrada para este aluno." });
                }

                // Atualizar saída para o último registro sem saída
                const sqlSaida = `UPDATE catraca SET DATA_HORA_SAIDA = ? WHERE ID_ALUNO = ? AND DATA_HORA_SAIDA IS NULL`;
                conexao.query(sqlSaida, [dataHoraAtualFormatada, idAluno], (erro) => {
                    if (erro) {
                        console.error("Erro ao registrar saída:", erro);
                        return res.json({ success: false, message: "Erro ao registrar saída" });
                    }
                    res.status(400).json({ message: 'Saída registrada com sucesso!' });
                });
            }
        });
    });
});

/// ROTA PARA BUSCAR REGISTROS DO ALUNO
app.post('/relatorio-aluno', function(req, res) {
    const { cpf } = req.body;

    // Verificar se o CPF foi fornecido
    if (!cpf) {
        return res.status(400).json({ mensagem: "CPF não fornecido" });
    }

    // Consultar os registros do aluno na tabela de catraca
    const sqlBuscarRegistros = `
        SELECT CPF, DATA_HORA_ENTRADA, DATA_HORA_SAIDA
        FROM catraca
        WHERE CPF = ?`;

    conexao.query(sqlBuscarRegistros, [cpf], (erro, registros) => {
        if (erro) {
            console.error("Erro ao buscar registros:", erro);
            return res.status(500).json({ mensagem: "Erro ao buscar registros" });
        }

        // Enviar os registros encontrados
        res.json({ registros });
    });
});



// Iniciar o servidor
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080");
});
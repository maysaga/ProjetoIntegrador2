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
    const dataHoje = dataHoraAtual.toISOString().slice(0, 10); // Apenas a data no formato YYYY-MM-DD

    // Verifica se o tipo de registro é válido (entrada ou saída)
    if (tipoRegistro !== 'entrada' && tipoRegistro !== 'saida') {
        return res.status(500).json({ mensagem: "Tipo de registro inválido!" });
    }

    // Verificar se o CPF existe na tabela ALUNOS
    const sqlVerificarCPF = `SELECT ID FROM ALUNOS WHERE CPF = ?`;
    conexao.query(sqlVerificarCPF, [cpf], function(erro, resultados) {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.status(500).json({ mensagem: "Erro ao verificar CPF" });
        }

        if (resultados.length === 0) {
            return res.status(500).json({ mensagem: "CPF não encontrado!" });
        }

        // Recupera o ID do aluno (assumindo que a tabela ALUNOS tenha uma coluna ID_ALUNO)
        const idAluno = resultados[0].ID;

        // Verificar registros do dia atual
        const sqlVerificarHoje = `
            SELECT DATA_HORA_ENTRADA, DATA_HORA_SAIDA 
            FROM catraca 
            WHERE ID_ALUNO = ? AND DATE(DATA_HORA_ENTRADA) = ?`;
        conexao.query(sqlVerificarHoje, [idAluno, dataHoje], (erro, registrosHoje) => {
            if (erro) {
                console.error("Erro ao verificar registros do dia:", erro);
                return res.status(500).json({ mensagem: "Erro ao verificar registros do dia" });
            }

            // Verificar se o aluno já completou um ciclo de entrada e saída hoje
            const cicloCompletoHoje = registrosHoje.some(
                registro => registro.DATA_HORA_ENTRADA && registro.DATA_HORA_SAIDA
            );            

            if (tipoRegistro === 'entrada') {
                if (cicloCompletoHoje) {
                    return res.status(400).json({ mensagem: "O aluno já completou uma entrada e saída hoje." });
                }

                // Verificar se já existe uma entrada sem saída hoje
                const entradaSemSaida = registrosHoje.some(
                    registro => registro.DATA_HORA_ENTRADA && !registro.DATA_HORA_SAIDA
                );

                if (entradaSemSaida) {
                    return res.status(400).json({ mensagem: "O aluno já possui uma entrada sem saída registrada hoje." });
                }

                // Registrar nova entrada
                const sqlEntrada = `INSERT INTO catraca (CPF, ID_ALUNO, DATA_HORA_ENTRADA) VALUES (?, ?, ?)`;
                conexao.query(sqlEntrada, [cpf, idAluno, dataHoraAtualFormatada], (erro) => {
                    if (erro) {
                        console.error("Erro ao registrar entrada:", erro);
                        return res.status(500).json({ mensagem: "Erro ao registrar entrada" });
                    }
                    return res.status(200).json({ mensagem: "Entrada registrada com sucesso!" });
                });
            } else if (tipoRegistro === 'saida') {
                // Verificar se há uma entrada sem saída hoje
                const entradaSemSaida = registrosHoje.some(
                    registro => registro.DATA_HORA_ENTRADA && !registro.DATA_HORA_SAIDA
                );

                if (!entradaSemSaida) {
                    return res.status(400).json({ mensagem: "Não há entrada registrada para este aluno hoje." });
                }

                // Atualizar saída no último registro sem saída
                const sqlSaida = `
                    UPDATE catraca 
                    SET DATA_HORA_SAIDA = ? 
                    WHERE ID_ALUNO = ? AND DATA_HORA_SAIDA IS NULL`;
                conexao.query(sqlSaida, [dataHoraAtualFormatada, idAluno], (erro) => {
                    if (erro) {
                        console.error("Erro ao registrar saída:", erro);
                        return res.status(500).json({ mensagem: "Erro ao registrar saída" });
                    }
                    return res.status(200).json({ mensagem: "Saída registrada com sucesso!" });
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

// ROTA PARA RELATÓRIO DE CLASSIFICAÇÃO
app.get('/relatorio-classificacao', (req, res) => {
    const sqlConsulta = `
        SELECT 
            A.CPF, 
            A.NOME, 
            SUM(TIMESTAMPDIFF(SECOND, C.DATA_HORA_ENTRADA, C.DATA_HORA_SAIDA)) / 3600 AS HORAS_TOTAIS
        FROM ALUNOS A
        LEFT JOIN CATRACA C ON A.ID = C.ID_ALUNO
        WHERE C.DATA_HORA_SAIDA IS NOT NULL
        GROUP BY A.CPF, A.NOME
        ORDER BY HORAS_TOTAIS DESC;
    `;

    conexao.query(sqlConsulta, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar relatório de classificação:", erro);
            return res.status(500).json({ mensagem: "Erro ao buscar relatório de classificação." });
        }

        const calcularClassificacao = (horas) => {
            if (horas <= 5) return 'Iniciante';
            if (horas <= 10) return 'Intermediário';
            if (horas <= 20) return 'Avançado';
            return 'Extremamente avançado';
        };

        const relatorio = resultados.map((aluno, index) => ({
            posicao: index + 1,
            cpf: aluno.CPF,
            nome: aluno.NOME,
            classificacao: calcularClassificacao(aluno.HORAS_TOTAIS || 0),
        }));

        res.json({ relatorio });
    });
});

// ROTA PARA RELATÓRIO DE HORAS
app.get('/relatorio-horas', (req, res) => {
    const sqlConsulta = `
        SELECT 
            A.CPF, 
            A.NOME,
            SUM(CASE WHEN C.DATA_HORA_ENTRADA >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
                     THEN TIMESTAMPDIFF(SECOND, C.DATA_HORA_ENTRADA, C.DATA_HORA_SAIDA) ELSE 0 END) / 3600 AS HORAS_SEMANAIS,
            SUM(TIMESTAMPDIFF(SECOND, C.DATA_HORA_ENTRADA, C.DATA_HORA_SAIDA)) / 3600 AS HORAS_TOTAIS
        FROM ALUNOS A
        LEFT JOIN CATRACA C ON A.ID = C.ID_ALUNO
        WHERE C.DATA_HORA_SAIDA IS NOT NULL
        GROUP BY A.CPF, A.NOME
        ORDER BY HORAS_SEMANAIS DESC;
    `;

    conexao.query(sqlConsulta, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao buscar relatório de horas:", erro);
            return res.status(500).json({ mensagem: "Erro ao buscar relatório de horas." });
        }

        const relatorio = resultados.map((aluno, index) => ({
            posicao: index + 1,
            cpf: aluno.CPF,
            nome: aluno.NOME,
            horas_semanais: Math.round(aluno.HORAS_SEMANAIS || 0),
            horas_totais: Math.round(aluno.HORAS_TOTAIS || 0),
        }));

        res.json({ relatorio });
    });
});

// Iniciar o servidor
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080");
});
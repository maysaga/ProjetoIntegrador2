const express = require ('express');

const mysql = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/html', express.static('html'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/imagens', express.static('imagens'));

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Melo241',
    database: 'academia_ginastica'
});

conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão efetuada com sucesso!');
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/cadastro.html');
});

app.post('/cadastrar', function(req, res){
    let nome = req.body.nome;
    let data_nasc = req.body.data;
    let cpf = req.body.cpf;
    let email = req.body.email;
    let celular = req.body.celular;
    let cep = req.body.cep;
    let estado = req.body.estado;
    let cidade = req.body.cidade;
    let bairro = req.body.bairro;
    let rua = req.body.rua;
    let numero = req.body.numero;
    let genero = req.body.genero;
    let peso = req.body.peso;
    let altura = req.body.altura;
    let objetivo = req.body.objetivos;

    let sqlVerificarCPF = `SELECT * FROM ALUNOS WHERE CPF = ?`;
    conexao.query(sqlVerificarCPF, [cpf], function (erro, resultados) {
        if (erro) {
            console.error("Erro ao verificar CPF:", erro);
            return res.status(500).send("Erro ao verificar CPF");
        }

        if (resultados.length > 0) {
            res.status(400).send("Este CPF já está cadastrado.");
        } else {
            let sql = `INSERT INTO ALUNOS (NOME, DATA_NASC, CPF, EMAIL, CELULAR, CEP, ESTADO, CIDADE, BAIRRO, RUA, NUMERO, GENERO, PESO, ALTURA, OBJETIVO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            conexao.query(sql, [nome, data_nasc, cpf, email, celular, cep, estado, cidade, bairro, rua, numero, genero, peso, altura, objetivo], function (erro, retorno) {
                if (erro) {
                    console.error("Erro ao cadastrar:", erro);
                    return res.sendFile(__dirname + '/html/cadastro.html');
                }
        
                console.log(retorno);
                res.sendFile(__dirname + '/html/index.html');
            });
        }
    });
});

app.get('/verificar-cpf', function(req, res) {
    const cpf = req.query.cpf;

    let sqlVerificarCPF = `SELECT * FROM ALUNOS WHERE CPF = ?`;
    conexao.query(sqlVerificarCPF, [cpf], function(erro, resultados) {
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

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080");
});
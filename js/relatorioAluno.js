document.addEventListener('DOMContentLoaded', function() {
    // Recupera o CPF armazenado no localStorage após o login
    const cpfAluno = localStorage.getItem('cpfAluno');

    if (!cpfAluno) {
        alert('Você não está logado. Por favor, faça login.');
        window.location.href = '/html/index.html'; 
        return;
    }

    const url = '/relatorio-aluno'; // Rota da API no backend

    // Realiza a consulta ao banco de dados
    fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: cpfAluno }) // Envia o CPF no corpo da requisição
    })
    .then(response => response.json())
    .then(dados => {
        if (!dados.registros || dados.registros.length === 0) {
            alert("Nenhum registro encontrado para o CPF informado.");
            return;
        }

        // Data de hoje (automática), ajustando para o início do dia
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Ajusta para a meia-noite de hoje

        // Calcular a data de 7 dias atrás (excluindo hoje)
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7);

        let horasTotaisUltimos7Dias = 0;

        dados.registros.forEach(registro => {
            const entrada = new Date(registro.DATA_HORA_ENTRADA);
            const saida = registro.DATA_HORA_SAIDA ? new Date(registro.DATA_HORA_SAIDA) : null;

            // Verifica se a entrada está dentro dos últimos 7 dias (excluindo hoje)
            if (entrada >= seteDiasAtras && entrada < hoje) {
                if (saida) {
                    const horasTreinadas = (saida - entrada) / (1000 * 60 * 60); // Converte milissegundos para horas
                    horasTotaisUltimos7Dias += horasTreinadas;
                }
            }
        });

        // Função para calcular a classificação do aluno com base nas horas treinadas
        const calcularClassificacao = (horas) => {
            if (horas <= 5) return 'Iniciante';
            if (horas <= 10) return 'Intermediário';
            if (horas <= 20) return 'Avançado';
            return 'Extremamente avançado';
        };

        const horasElement = document.getElementById('horas-semanais');
        const classificacaoElement = document.getElementById('classificacao');

        horasElement.textContent = `Horas semanais de treino: ${Math.round(horasTotaisUltimos7Dias)} horas`; // Arredonda as horas para inteiro
        classificacaoElement.textContent = `Classificação: ${calcularClassificacao(horasTotaisUltimos7Dias)}`;
    })
    .catch(error => {
        console.error('Erro ao buscar os dados:', error);
        alert('Erro ao carregar os dados. Tente novamente mais tarde.');
    });
});

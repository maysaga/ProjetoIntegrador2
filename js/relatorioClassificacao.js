function carregarRelatorioClassificacao() {
    const url = '/relatorio-classificacao'; // Rota da API no backend

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.relatorio || data.relatorio.length === 0) {
                alert("Nenhum dado encontrado para o relatório de classificação.");
                return;
            }

            const tabela = document.getElementById('ranking-table'); // Tabela do relatório de classificação
            const corpoTabela = tabela.querySelector('tbody');

            // Limpa a tabela antes de preencher
            corpoTabela.innerHTML = '';

            // Preenche os dados do relatório
            data.relatorio.forEach(aluno => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${aluno.posicao}</td>
                    <td>${aluno.cpf}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.classificacao}</td>
                `;
                corpoTabela.appendChild(linha);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do relatório de classificação:', error);
            alert('Erro ao carregar os dados do relatório de classificação.');
        });
}

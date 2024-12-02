function toggleView(viewId) {
    const sections = document.querySelectorAll('.ranking'); // Todas as seções de relatório
    sections.forEach(section => {
        section.classList.add('hidden'); // Oculta todas as seções
    });

    const targetSection = document.getElementById(viewId);
    targetSection.classList.remove('hidden'); // Mostra a seção selecionada

    // Carrega os dados conforme a seção visível
    if (viewId === 'ranking-dos-alunos') {
        carregarRelatorioClassificacao();
    } else if (viewId === 'relatorio-horas') {
        carregarRelatorioHoras();
    }
}

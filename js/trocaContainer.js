document.getElementById('botao_entrada').addEventListener('click', function () {
    document.body.className = "registrar-atividade-js"; // Mostra o campo de CPF
    document.getElementById('tipoRegistro').value = 'entrada'; // Define o tipo de registro
});

document.getElementById('botao_saida').addEventListener('click', function () {
    document.body.className = "registrar-atividade-js"; // Mostra o campo de CPF
    document.getElementById('tipoRegistro').value = 'saida'; // Define o tipo de registro
});

document.getElementById('botao_voltar').addEventListener('click', function () {
    document.body.className = "selecionar-entrada-saida-js"; // Volta para a tela inicial
    document.getElementById('tipoRegistro').value = ''; // Reseta o valor do tipo de registro
});

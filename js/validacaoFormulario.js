document.querySelector('.button_cadastrar').addEventListener('click', function (e) {
    e.preventDefault();

    let isValid = true;

    const camposPreenchidos = verificarCamposObrigatorios();

    if (!camposPreenchidos) {
        isValid = false;
    }

    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.trim();

    if (cpf !== "" && !validarCPF(cpf)) {
        exibirMensagemErro("CPF inválido!", 'cpf');
        isValid = false;
    } else if (cpf !== "") {
        esconderMensagemErro('cpf');
    }

    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    if (email !== "" && !validarEmail(email)) {
        exibirMensagemErro("E-mail inválido!", 'email');
        isValid = false;
    } else if (email !== "") {
        esconderMensagemErro('email');
    }

    if (isValid) {
        window.location.href = "index.html";
    }
});

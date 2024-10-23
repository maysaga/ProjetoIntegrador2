function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCampoEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    if (!validarEmail(email)) {
        exibirMensagemErro("E-mail inválido!", 'email');
        return false;
    } else {
        esconderMensagemErro('email');
        return true;
    }
}
function validarCPF(cpf) {
    
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digitoVerificador1 = 11 - (soma % 11);
    if (digitoVerificador1 >= 10) digitoVerificador1 = 0;
    if (digitoVerificador1 != cpf.charAt(9)) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerificador2 = 11 - (soma % 11);
    if (digitoVerificador2 >= 10) digitoVerificador2 = 0;
    if (digitoVerificador2 != cpf.charAt(10)) {
        return false;
    }

    return true;
}

function validarCampoCPF() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value;

    if (!validarCPF(cpf)) {
        exibirMensagemErro("CPF inválido!", 'cpf');
        return false;
    } else {
        esconderMensagemErro('cpf');
        return true;
    }
}

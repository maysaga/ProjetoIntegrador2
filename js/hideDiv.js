var btn = document.querySelector('#botao_buscar');
var cards = document.querySelector('.cards');
var inputCpf = document.querySelector('#cpf'); // Seleciona o campo de entrada do CPF

btn.addEventListener('click', function(event){
    event.preventDefault();
    
    // Verifica se o campo de entrada não está vazio e se o CPF é válido
    if (inputCpf.value.trim() !== '' && validarCPF(inputCpf.value)) {
        console.log('Botão clicado e CPF válido'); // Para depuração
        cards.style.display = 'flex'; // Exibe os cartões
    } else {
        console.log('CPF inválido ou campo vazio'); // Para depuração
        alert('Por favor, insira um CPF válido.'); // Alerta ao usuário
    }
});

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

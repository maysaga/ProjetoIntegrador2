document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o formulário e o botão de registro
    const form = document.querySelector('form');
    const botaoRegistrar = document.querySelector('#botao_registrar');

    // Validação do formulário no envio
    form.addEventListener('submit', function (e) {
        const cpfInput = document.querySelector('#cpf');
        const cpf = cpfInput.value.trim();

        let isValid = true;

        // Verifica se o CPF foi fornecido
        if (!cpf || cpf === "") {
            e.preventDefault();  // Impede o envio do formulário
            alert('Por favor, digite um CPF!');
            isValid = false;
        }

        // Valida o CPF, se fornecido
        if (isValid && cpf !== "" && !validarCPF(cpf)) {
            e.preventDefault();  // Impede o envio do formulário
            exibirMensagemErro("CPF inválido!", 'cpf');
            isValid = false;
        } else if (cpf !== "") {
            esconderMensagemErro('cpf');
        }

        // Verifica campos obrigatórios
        if (isValid && !verificarCamposObrigatorios()) {
            e.preventDefault();  // Impede o envio do formulário
            isValid = false;
        }

        // Se a validação passar, o formulário será enviado
        /*if (isValid) {
            alert("Atividade registrada com sucesso!");
        }*/
    });

    // Previne o envio do formulário antes de qualquer validação
    botaoRegistrar.addEventListener('click', function (e) {
        const cpfInput = document.querySelector('#cpf');
        const cpf = cpfInput.value.trim();

        if (!cpf || cpf === "") {
            alert('Por favor, digite um CPF!');
            e.preventDefault();  // Impede o envio até o CPF ser preenchido
        }
    });
});

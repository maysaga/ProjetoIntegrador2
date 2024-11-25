document.querySelector('#botao_registrar').addEventListener('click', function (e) {
    e.preventDefault();

    let isValid = true;

    if (!verificarCamposObrigatorios()) {
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

	 if (isValid) {
			alert("Atividade registrada com sucesso!");
		}
});
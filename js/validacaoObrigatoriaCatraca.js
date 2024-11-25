function exibirMensagemErro(mensagem, campo) {
    const errorElement = document.getElementById(`${campo}-error`);
    errorElement.textContent = mensagem;
    errorElement.classList.add('active');
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function esconderMensagemErro(campo) {
    const errorElement = document.getElementById(`${campo}-error`);
    errorElement.classList.remove('active');
    errorElement.textContent = '';
}

function verificarCamposObrigatorios() {
    const campos = document.querySelectorAll('input[required]');
    let isValid = true;

	campos.forEach(campo => {
			if (campo.value.trim() === "") {
				exibirMensagemErro("Este campo é obrigatório!", campo.id);
				isValid = false;
			} else {
				esconderMensagemErro(campo.id);
			}
		});
		
    return isValid;
	
}

document.querySelector('#botao_registrar').addEventListener('click', function (e) {
    if (!verificarCamposObrigatorios()) {
        e.preventDefault();
    }
});

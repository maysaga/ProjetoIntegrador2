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
        if (!campo.value.trim() && !(campo.type === 'radio' && !document.querySelector(`input[name="${campo.name}"]:checked`))) {
            exibirMensagemErro(`${campo.placeholder} é obrigatório!`, campo.id);
            isValid = false;
        } else {
            esconderMensagemErro(campo.id);
        }
    });

    const generosSelecionados = document.querySelector('input[name="genero"]:checked');
    if (!generosSelecionados) {
        exibirMensagemErro("Selecione um gênero!", "genero");
        isValid = false;
    } else {
        esconderMensagemErro("genero");
    }

    const objetivosSelecionados = document.querySelector('input[name="objetivos"]:checked');
    if (!objetivosSelecionados) {
        exibirMensagemErro("Selecione um objetivo de treino!", "objetivos");
        isValid = false;
    } else {
        esconderMensagemErro("objetivos");
    }

    return isValid;
}

document.querySelector('.button_cadastrar').addEventListener('click', function (e) {
    if (!verificarCamposObrigatorios()) {
        e.preventDefault();
    }
});

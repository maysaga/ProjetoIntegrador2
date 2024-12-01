document.addEventListener('DOMContentLoaded', function() {
    const buttonEntrar = document.querySelector('.button_entrar');
    const inputCPF = document.getElementById('cpf');

    buttonEntrar.addEventListener('click', function(event) {
        event.preventDefault();

        const cpf = inputCPF.value.trim();

        if (!cpf) {
            alert('Por favor, insira um CPF.');
            return;
        }

        fetch(`/verificar-cpf?cpf=${cpf}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                console.log(response);
                throw new Error('Erro ao verificar CPF.');
            })
            .then(data => {
                if (data.existe) {
                    alert('Seja bem-vindo, você será redirecionado em alguns instantes.');
                    
                    localStorage.setItem('cpfAluno', cpf);

                    setTimeout(() => {
                        window.location.href = '/html/relatorioAluno.html';
                    }, 2000);
                } else {
                    alert('CPF não encontrado, realize seu cadastro.');
                }
            })
            .catch(error => {
                console.error(error);
                alert('Ocorreu um erro ao verificar o CPF. Tente novamente.');
            });
    });
});

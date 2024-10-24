document.addEventListener('DOMContentLoaded', function () {
    const outroGeneroRadio = document.getElementById('outro_genero');
    const inputOutroGenero = document.getElementById('input_outro_genero');
    const generoRadios = document.querySelectorAll('input[name="genero"]');
    const outrosHistoricoCheckbox = document.getElementById('outros_historico');
    const inputOutrosHistorico = document.getElementById('input_outros_historico');
    
    inputOutroGenero.style.display = 'none';
    inputOutrosHistorico.style.display = 'none';
    
    generoRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (outroGeneroRadio.checked) {
                inputOutroGenero.style.display = 'block';
            } else {
                inputOutroGenero.style.display = 'none';
            }
        });
    });

    outrosHistoricoCheckbox.addEventListener('change', function () {
        if (outrosHistoricoCheckbox.checked) {
            inputOutrosHistorico.style.display = 'block';
        } else {
            inputOutrosHistorico.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const outrosHistoricoCheckbox = document.getElementById('outros_historico');
    const inputOutrosHistorico = document.getElementById('input_outros_historico');
    
    inputOutrosHistorico.style.display = 'none';

    outrosHistoricoCheckbox.addEventListener('change', function () {
        if (outrosHistoricoCheckbox.checked) {
            inputOutrosHistorico.style.display = 'block';
        } else {
            inputOutrosHistorico.style.display = 'none';
        }
    });
});

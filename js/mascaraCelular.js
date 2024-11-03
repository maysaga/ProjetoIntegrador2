function formatarCelular(celular) {
    celular = celular.replace(/\D/g, '');

    if (celular.length === 11) {
        return `(${celular.substring(0, 2)}) ${celular.substring(2, 7)}-${celular.substring(7)}`;
    } else if (celular.length === 10) {
        return `(${celular.substring(0, 2)}) ${celular.substring(2, 6)}-${celular.substring(6)}`;
    } else {
        return celular;
    }
}

document.getElementById('celular').addEventListener('input', function () {
    const celularInput = document.getElementById('celular');
    celularInput.value = formatarCelular(celularInput.value);
});

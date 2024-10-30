const celular = document.querySelector('#celular');

celular.addEventListener('keypress', () => {
	
	let tamanhoCelular = celular.value.length;
	
	if(tamanhoCelular === 0){
		celular.value += '(';
	}
	if(tamanhoCelular === 3){
		celular.value += ')';
	}
	if(tamanhoCelular === 9){
		celular.value += '-';
	}
});
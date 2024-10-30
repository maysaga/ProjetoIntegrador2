const cep = document.querySelector('#cep');

cep.addEventListener('keypress', () => {
	
	let tamanhoCep = cep.value.length;
	
	if(tamanhoCep === 2){
		cep.value += '.';
	}
	if(tamanhoCep === 6){
		cep.value += '-';
	}
});
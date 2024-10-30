const input = document.querySelector('#cpf');

input.addEventListener('keypress', () => {
	
	let tamanhoInput = input.value.length;
	
	if(tamanhoInput === 3 || tamanhoInput === 7){
		input.value += '.';
	}
	if(tamanhoInput === 11){
		input.value += '-';
	}
});
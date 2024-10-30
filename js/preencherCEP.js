function buscaCEP(){
	let cep = document.getElementById('cep').value;
	
	if(cep !== ""){
		let url = "https://brasilapi.com.br/api/cep/v1/" + cep;
		
		let req = new XMLHttpRequest();
		req.open("GET", url);
		req.send();
		
		
		req.onload = function(){
			if(req.status === 200){
				let endereco = JSON.parse(req.response);
				document.getElementById("estado").value = endereco.state;
				document.getElementById("cidade").value = endereco.city;
				document.getElementById("bairro").value = endereco.neighborhood;
				document.getElementById("rua").value = endereco.street;		
			}
			else if(req.status === 404){
				exibirMensagemErro("CEP Inválido!");
				return false;
			}
			else{
				exibirMensagemErro("Erro ao fazer requisição.");
				return false;
			}
		};
	}
		
}

window.onload = function(){
	let cep = document.getElementById('cep');
	cep.addEventListener("blur", buscaCEP);
};
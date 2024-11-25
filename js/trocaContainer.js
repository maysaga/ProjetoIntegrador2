var btn_entrada = document.querySelector("#botao_entrada");
var btn_saida = document.querySelector("#botao_saida");

var body = document.querySelector("body");

btn_entrada.addEventListener("click", function(){
	body.className = "registrar-atividade-js";
});

btn_saida.addEventListener("click", function(){
	body.className = "registrar-atividade-js";
});
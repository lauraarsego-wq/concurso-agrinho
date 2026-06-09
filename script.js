function mostrarMensagem(){

```
document.getElementById("mensagem").innerHTML =
"🌱 A sustentabilidade garante recursos para as futuras gerações!";
```

}

function mostrarBeneficios(){

```
const beneficios =
document.getElementById("beneficios");

beneficios.classList.toggle("oculto");
```

}

function calcularImpacto(){

```
const arvores =
Number(document.getElementById("arvores").value);

const resultado =
document.getElementById("resultado");

if(arvores <= 0){

    resultado.innerHTML =
    "Digite um valor válido.";

    resultado.style.color = "red";

    return;

}

resultado.innerHTML =
"🌳 Essas árvores podem absorver aproximadamente "
+ (arvores * 21) +
" kg de CO₂ por ano.";

resultado.style.color =
"green";
```

}

const respostas =
document.querySelectorAll(".resposta");

const quizResultado =
document.getElementById("quizResultado");

respostas.forEach(botao => {

```
botao.addEventListener("click", () => {

    if(botao.dataset.correta === "true"){

        quizResultado.innerHTML =
        "✅ Resposta correta!";

        quizResultado.style.color =
        "green";

    }else{

        quizResultado.innerHTML =
        "❌ Resposta incorreta!";

        quizResultado.style.color =
        "red";

    }

});
```

});

function animarContador(id, limite){

```
let numero = 0;

const contador =
document.getElementById(id);

const intervalo = setInterval(() => {

    numero++;

    contador.textContent =
    numero;

    if(numero >= limite){

        clearInterval(intervalo);

    }

},20);
```

}

animarContador("contador1",120);
animarContador("contador2",350);
animarContador("contador3",500);

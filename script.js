function mostrarInfo(){

```
let info = document.getElementById("info");

if(info.style.display === "block"){
    info.style.display = "none";
}else{
    info.style.display = "block";
}
```

}

let contador = 0;

function adicionarArvore(){

```
contador++;

document.getElementById("numero").innerText =
contador;
```

}

function calcularCO2(){

```
let arvores =
Number(document.getElementById("arvores").value);

let resultado =
arvores * 21;

document.getElementById("resultado").innerHTML =
"Essas árvores podem absorver aproximadamente "
+ resultado +
" kg de CO₂ por ano.";
```

}

function respostaCorreta(){

```
document.getElementById("quizResultado")
.innerHTML =
"✅ Resposta correta!";
```

}

function respostaErrada(){

```
document.getElementById("quizResultado")
.innerHTML =
"❌ Tente novamente.";
```

}

function alternarTema(){

```
document.body.classList.toggle("dark");
```

}

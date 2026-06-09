function mostrarInfo(){

    const info = document.getElementById("info");

    if(info.style.display === "block"){
        info.style.display = "none";
    }else{
        info.style.display = "block";
    }

}

let contador = 0;

function adicionarArvore(){

    contador++;

    document.getElementById("numero").textContent = contador;

}

function calcularCO2(){

    const arvores =
    Number(document.getElementById("arvores").value);

    const resultado = arvores * 21;

    document.getElementById("resultado").textContent =
    "Essas árvores podem absorver aproximadamente " +
    resultado +
    " kg de CO₂ por ano.";

}

const botoesQuiz =
document.querySelectorAll(".resposta");

const resultadoQuiz =
document.getElementById("quizResultado");

botoesQuiz.forEach(botao => {

    botao.addEventListener("click", () => {

        if(botao.dataset.correta === "true"){

            resultadoQuiz.textContent =
            "✅ Resposta correta!";

            resultadoQuiz.style.color =
            "green";

        }else{

            resultadoQuiz.textContent =
            "❌ Resposta incorreta. Tente novamente.";

            resultadoQuiz.style.color =
            "red";

        }

    });

});

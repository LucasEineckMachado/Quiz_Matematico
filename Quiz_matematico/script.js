let num1, num2, operador, respostaCorreta;

function gerarPergunta() {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    let operadores = ['+', '-', '*', '/'];
    operador = operadores[Math.floor(Math.random() * operadores.length)];

    if (operador === '/') {
        num1 = num1 * num2; // Garante divisão exata
    }

    respostaCorreta = eval(`${num1} ${operador} ${num2}`);
    respostaCorreta = operador === '/' ? Math.round(respostaCorreta) : respostaCorreta;

    document.getElementById("pergunta").innerText = `${num1} ${operador} ${num2} = ?`;
    document.getElementById("resposta").value = "";
    document.getElementById("jpg").style.display = "none";
    document.getElementById("container").classList.remove("correto", "incorreto");
}

function verificarResposta() {
    let respostaUsuario = parseFloat(document.getElementById("resposta").value);
    let gif = document.getElementById("jpg");
    let container = document.getElementById("container");

    if (respostaUsuario === respostaCorreta) {
        gif.src = "Eu sabo.jpg"; // Jpg de acerto
        container.classList.remove("incorreto");
        container.classList.add("correto");
    } else {
        gif.src = "tchola.jpg"; // Jpg de erro
        container.classList.remove("correto");
        container.classList.add("incorreto");
    }
    gif.style.display = "block";
}

gerarPergunta();

let num1, num2, operador, respostaCorreta;
let nivelDificuldade = "";
let respostaJaVerificada = false;
let jogoIniciado = false;
let usuarioNome = "";
let pontuacao = 0; // Variável para armazenar a pontuação
let maiorPontuacao = 0; // Variável para armazenar a maior pontuação

// Pergunta o nome antes de tudo
window.onload = function () {
    usuarioNome = prompt("Digite seu nome para jogar:");
    if (!usuarioNome) {
        alert("Nome é obrigatório para jogar!");
        location.reload();
    }
};

function selecionarDificuldade(nivel) {
    if (jogoIniciado) {
        alert("Termine o jogo antes de mudar a dificuldade!");
        return;
    }

    nivelDificuldade = nivel;
    jogoIniciado = true;
    pontuacao = 0; // Reinicia a pontuação quando iniciar o jogo
    document.getElementById("pontuacao").innerHTML = `Pontuação: ${pontuacao}`; // Atualiza a pontuação na tela
    gerarPergunta();
}

function gerarPergunta() {
    if (!nivelDificuldade) {
        alert("Escolha um nível antes de jogar!");
        return;
    }

    let operadoresFacil = ['+', '-'];
    let operadoresNormal = ['+', '-', '*', '/'];
    let operadoresDificil = ['+', '-', '*', '/', '^', '√'];
    let operadores = [];

    if (nivelDificuldade === "facil") {
        operadores = operadoresFacil;
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    } else if (nivelDificuldade === "normal") {
        operadores = operadoresNormal;
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
    } else if (nivelDificuldade === "dificil") {
        operadores = operadoresDificil;
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    }

    operador = operadores[Math.floor(Math.random() * operadores.length)];

    if (operador === '/') {
        num1 = num1 * num2;
    } else if (operador === '^') {
        num2 = Math.floor(Math.random() * 3) + 2;
    } else if (operador === '√') {
        num1 = Math.pow(num2, 2);
    }

    respostaCorreta = calcularResposta(num1, num2, operador);

    document.getElementById("pergunta").innerHTML = `<b>${num1} ${operador} ${num2} = ?</b>`;
    document.getElementById("resposta").value = "";
    document.getElementById("jpg").style.display = "none";
    respostaJaVerificada = false;

    // Resetando o fundo para a cor original
    resetarCor();
}

function calcularResposta(a, b, operador) {
    switch (operador) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return Math.round(a / b);
        case '^': return Math.pow(a, b);
        case '√': return Math.sqrt(a);
        default: return null;
    }
}

function verificarResposta() {
    if (respostaJaVerificada) return;

    let respostaUsuario = parseFloat(document.getElementById("resposta").value);
    let gif = document.getElementById("jpg");
    let container = document.querySelector(".container");

    if (respostaUsuario === respostaCorreta) {
        gif.src = "Eu sabo.jpg"; // Imagem de acerto
        container.classList.add("correto"); // Adiciona a classe de sucesso ao container
        container.classList.remove("incorreto"); // Remove a classe de erro do container
        
        // Atribuindo pontos conforme a dificuldade
        if (nivelDificuldade === "facil") {
            pontuacao += 2;
        } else if (nivelDificuldade === "normal") {
            pontuacao += 4;
        } else if (nivelDificuldade === "dificil") {
            pontuacao += 8;
        }

        // Atualiza a maior pontuação se necessário
        if (pontuacao > maiorPontuacao) {
            maiorPontuacao = pontuacao;
        }

        document.getElementById("pontuacao").innerHTML = `Pontuação: ${pontuacao}`; // Atualiza a pontuação na tela
        respostaJaVerificada = true;
        setTimeout(gerarPergunta, 1500); // Espera um tempo para mostrar a próxima pergunta
    } else {
        gif.src = "tchola.jpg"; // Imagem de erro
        container.classList.add("incorreto"); // Adiciona a classe de erro ao container
        container.classList.remove("correto"); // Remove a classe de sucesso do container

        // Antes de zerar a pontuação, envia a maior pontuação
        enviarDadosParaPlanilha(maiorPontuacao);

        // Resetando a pontuação para 0 ao errar
        pontuacao = 0;
        document.getElementById("pontuacao").innerHTML = `Pontuação: ${pontuacao}`; // Atualiza a pontuação para 0
        jogoIniciado = false; // Permite mudar a dificuldade
        respostaJaVerificada = true;
    }

    gif.style.display = "block";
    
    // Enviar os dados para a planilha quando o jogo terminar ou errar
    // enviarDadosParaPlanilha(maiorPontuacao); // Pode enviar também aqui se desejar enviar em cada rodada
}

function resetarCor() {
    let container = document.querySelector(".container");
    let body = document.body;

    // Resetando as cores do fundo e do container para o estado original
    body.style.backgroundColor = "#000000"; // Cor de fundo original
    container.classList.remove("correto", "incorreto"); // Remove as classes de sucesso e erro
}

// Função para enviar os dados para a planilha de forma assíncrona
async function enviarDadosParaPlanilha(maiorPontuacao) {
    const url = "https://api.sheetmonkey.io/form/4myYz5k6MiEkchxgjJmsKJ";
    
    // Adicionando a data atual
    const dataAtual = new Date().toLocaleString(); // Formato de data padrão (pode ser ajustado)

    const dados = {
        "Nome": usuarioNome,
        "Pontuação": maiorPontuacao, // Garantindo que estamos enviando a maior pontuação
        "Dificuldade": nivelDificuldade, // Envia a dificuldade
        "Data": dataAtual // Adicionando a data de envio
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            console.log("Dados enviados com sucesso!");
            alert("Dados enviados com sucesso!"); // Aqui você pode mostrar uma mensagem de sucesso
        } else {
            console.log("Erro ao enviar dados: " + response.status);
        }
    } catch (error) {
        console.log("Erro ao enviar dados: ", error);
    }
}


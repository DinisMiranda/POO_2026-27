let nomeJogador = prompt("Qual o seu nome?");
let tempo = 0, timer;
let respondidas = 0;




function mostrarPromptJogador() {
  if (nomeJogador.toLowerCase() === "admin") {
    atualizarTabelaAdmin();
  } else {
      criarGrelha();
  }
}

function criarGrelha() {
  const grelha = document.getElementById("grelha");
    const categorias = ["História", "Ciência", "Geografia", "Matemática", "Desporto", "Literatura", "Tecnologia", "Arte", "Música"];
    
    categorias.forEach((categoria, index) => {
        const celula = document.createElement("div");
        celula.className = "celula";
        celula.textContent = categoria;
        celula.addEventListener("click", () => {
            if (!celula.classList.contains("respondida")) {
                mostrarPergunta(categoria, celula);
            }
        });
        grelha.appendChild(celula);
    });
}

function mostrarPergunta(categoria, celula) {
 if (tempo === 0) iniciarContador();
  
  const pergunta = perguntas.find(p => p.categoria === categoria);
  if (!pergunta) return;
  
  let resposta = prompt(`${pergunta.pergunta}\n\nOpções:\nA) ${pergunta.respostas[0]}\nB) ${pergunta.respostas[1]}\nC) ${pergunta.respostas[2]}\nD) ${pergunta.respostas[3]}`);
  validarResposta(resposta, pergunta, celula);
  
}

function validarResposta(resposta, pergunta, celula) {
 
}

function iniciarContador() {
  timer = setInterval(() => {
    tempo++;
    document.getElementById("contador").textContent = `Tempo: ${tempo}s`;
  }, 1000);
}

function registarTempo() {
  const recordes = JSON.parse(localStorage.getItem("recordes")) || [];
  recordes.push({ nome: nomeJogador, tempo: tempo });
  localStorage.setItem("recordes", JSON.stringify(recordes));
}

function atualizarLeaderboard() {
  
}

function atualizarTabelaAdmin() {

 const tabelaPerguntas = document.getElementById("tabelaPerguntas");
  const perguntas = JSON.parse(localStorage.getItem("perguntas")) || [];
  tabelaPerguntas.innerHTML = ""; 

}

document.getElementById("btnAdicionarPergunta").addEventListener("click", adicionarPergunta)

function adicionarPergunta() {
  const pergunta = document.getElementById("pergunta").value;
  const categoria = document.getElementById("categoria").value;
  const respostas = [
    document.getElementById("resposta1").value,
    document.getElementById("resposta2").value,
    document.getElementById("resposta3").value,
    document.getElementById("resposta4").value
  ];
  const respostaCorreta = document.getElementById("respostaCorreta").value;

  if (!pergunta || !categoria || !respostas.includes(respostaCorreta)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const novaPergunta = { pergunta, categoria, respostas, respostaCorreta };
  perguntas.push(novaPergunta);
  localStorage.setItem("perguntas", JSON.stringify(perguntas));
  
  alert("Pergunta adicionada com sucesso!");
  atualizarTabelaAdmin();

  
}

window.onload = mostrarPromptJogador;
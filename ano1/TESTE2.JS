// Inicialização de variáveis
let quizData = JSON.parse(localStorage.getItem("quizData")) || {
    perguntas: [],
    recordes: []
};

let tempo = 0;
let timer;
let respondidas = 0;
let nomeJogador = "";

// Elementos DOM
const formAdmin = document.getElementById('adminForm');
const tabelaPerguntas = document.querySelector('#tabelaPerguntas tbody');
const filtroCategoria = document.getElementById('filtroCategoria');
const ordenarBtn = document.getElementById('ordenarBtn');
let ordemAscendente = true;

// Event Listeners
filtroCategoria.addEventListener('input', renderizarTabelaPerguntas);
ordenarBtn.addEventListener('click', alternarOrdem);

// Função principal ao carregar
function mostrarPromptJogador() {
    nomeJogador = prompt("Qual o seu nome?");
    if (nomeJogador.toLowerCase() === "admin") {
        mostrarPainelAdmin();
    } else {
        criarGrelha();
    }
}

// Funções do Jogador
function criarGrelha() {
    const grelha = document.getElementById("grelha");
    grelha.innerHTML = '';
    
    // Obter categorias únicas
    const categorias = [...new Set(quizData.perguntas.map(p => p.categoria))].slice(0, 9);
    
    categorias.forEach(categoria => {
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
    
    const perguntasCategoria = quizData.perguntas.filter(p => p.categoria === categoria);
    const pergunta = perguntasCategoria[Math.floor(Math.random() * perguntasCategoria.length)];
    
    const resposta = prompt(`${pergunta.texto}\n\nOpções:\nA) ${pergunta.opcoes[0]}\nB) ${pergunta.opcoes[1]}\nC) ${pergunta.opcoes[2]}\nD) ${pergunta.opcoes[3]}`);
    validarResposta(resposta, pergunta, celula);
}

function validarResposta(resposta, pergunta, celula) {
    if (resposta && resposta.toUpperCase() === pergunta.resposta) {
        celula.classList.add("respondida", "certa");
        respondidas++;
        
        if (respondidas === 9) {
            finalizarJogoComSucesso();
        }
    } else {
        celula.classList.add("respondida", "errada");
        finalizarJogoComErro();
    }
}

function finalizarJogoComSucesso() {
    clearInterval(timer);
    quizData.recordes.push({ nome: nomeJogador, tempo: tempo });
    guardarLocalStorage();
    atualizarLeaderboard();
    alert(`Parabéns ${nomeJogador}! Completou o quiz em ${tempo} segundos!`);
}

function finalizarJogoComErro() {
    clearInterval(timer);
    alert("Resposta errada! Fim do jogo.");
}

function iniciarContador() {
    tempo = 0;
    timer = setInterval(() => {
        tempo++;
        document.getElementById("contador").textContent = `Tempo: ${tempo}s`;
    }, 1000);
}

// Funções do Admin
function mostrarPainelAdmin() {
    document.getElementById("jogo").style.display = "none";
    document.getElementById("admin").style.display = "block";
    renderizarTabelaPerguntas();
}

function renderizarTabelaPerguntas() {
    tabelaPerguntas.innerHTML = '';
    
    let perguntasFiltradas = quizData.perguntas.filter(p => {
        return !filtroCategoria.value || p.categoria.toLowerCase().includes(filtroCategoria.value.toLowerCase());
    });

    perguntasFiltradas.sort((a, b) => {
        return ordemAscendente 
            ? a.categoria.localeCompare(b.categoria) 
            : b.categoria.localeCompare(a.categoria);
    });

    perguntasFiltradas.forEach((pergunta, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pergunta.categoria}</td>
            <td>${pergunta.texto}</td>
            <td>${pergunta.opcoes.join(', ')}</td>
            <td>${pergunta.resposta}</td>
            <td>
                <button onclick="editarPergunta(${index})">Editar</button>
                <button onclick="removerPergunta(${index})">Remover</button>
            </td>
        `;
        tabelaPerguntas.appendChild(tr);
    });
}

function alternarOrdem() {
    ordemAscendente = !ordemAscendente;
    ordenarBtn.textContent = ordemAscendente ? 'Ordenar Z-A' : 'Ordenar A-Z';
    renderizarTabelaPerguntas();
}

// CRUD de Perguntas
formAdmin.addEventListener('submit', event => {
    event.preventDefault();
    
    const categoria = document.getElementById('categoria').value;
    const texto = document.getElementById('textoPergunta').value;
    const opcoes = [
        document.getElementById('opcaoA').value,
        document.getElementById('opcaoB').value,
        document.getElementById('opcaoC').value,
        document.getElementById('opcaoD').value
    ];
    const resposta = document.getElementById('respostaCorreta').value.toUpperCase();
    
    const novaPergunta = { categoria, texto, opcoes, resposta };
    quizData.perguntas.push(novaPergunta);
    
    guardarLocalStorage();
    renderizarTabelaPerguntas();
    formAdmin.reset();
});

function editarPergunta(index) {
    const pergunta = quizData.perguntas[index];
    document.getElementById('categoria').value = pergunta.categoria;
    document.getElementById('textoPergunta').value = pergunta.texto;
    document.getElementById('opcaoA').value = pergunta.opcoes[0];
    document.getElementById('opcaoB').value = pergunta.opcoes[1];
    document.getElementById('opcaoC').value = pergunta.opcoes[2];
    document.getElementById('opcaoD').value = pergunta.opcoes[3];
    document.getElementById('respostaCorreta').value = pergunta.resposta;
    
    quizData.perguntas.splice(index, 1);
    guardarLocalStorage();
    renderizarTabelaPerguntas();
}

function removerPergunta(index) {
    if (confirm('Deseja remover esta pergunta?')) {
        quizData.perguntas.splice(index, 1);
        guardarLocalStorage();
        renderizarTabelaPerguntas();
    }
}

// Leaderboard
function atualizarLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "<h3>Melhores Tempos</h3>";
    
    quizData.recordes
        .sort((a, b) => a.tempo - b.tempo)
        .slice(0, 5)
        .forEach((recorde, index) => {
            const item = document.createElement("div");
            item.textContent = `${index + 1}. ${recorde.nome}: ${recorde.tempo}s`;
            leaderboard.appendChild(item);
        });
}

// LocalStorage
function guardarLocalStorage() {
    localStorage.setItem("quizData", JSON.stringify(quizData));
}

// Inicialização
window.onload = mostrarPromptJogador;
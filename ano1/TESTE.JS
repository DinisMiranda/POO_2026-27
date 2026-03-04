function mostrarPromptJogador() {
    nomeJogador = prompt("Qual o seu nome?");
    if (nomeJogador.toLowerCase() === "admin") {
        atualizarTabelaAdmin();
    } else {
        criarGrelha();
    }
}



function criarGrelha() {
    const grelha = document.getElementById("grelha");
    const categorias = ["Geografia", "História", "Arte", "Ciência", "Desporto", "Cinema", "Música", "Tecnologia", "Literatura"];
    
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
    
    let resposta = prompt(`${pergunta.pergunta}\n\nOpções:\nA) ${pergunta.opcoes[0]}\nB) ${pergunta.opcoes[1]}\nC) ${pergunta.opcoes[2]}\nD) ${pergunta.opcoes[3]}`);
    validarResposta(resposta, pergunta, celula);
}



function validarResposta(resposta, pergunta, celula) {
    if (resposta && resposta.toUpperCase() === pergunta.resposta) {
        celula.classList.add("respondida", "certa");
        respondidas++;
        
        if (respondidas === 9) {
            clearInterval(timer);
            registarTempo();
            atualizarLeaderboard();
            alert("Parabéns! Completou o quiz!");
        }
    } else {
        celula.classList.add("respondida", "errada");
        clearInterval(timer);
        alert("Resposta errada! Fim do jogo.");
    }
}


function registarTempo() {
    const recordes = JSON.parse(localStorage.getItem("recordes")) || [];
    recordes.push({ nome: nomeJogador, tempo: tempo });
    localStorage.setItem("recordes", JSON.stringify(recordes));
}
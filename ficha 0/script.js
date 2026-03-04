//1
const produtos = [
  {
    nome: "Teclado Mecânico",
    preco: 89.99,
    stock: 14,
    emPromocao: true,
    descricao: "Teclado mecânico com switches de alta qualidade",
  },
  {
    nome: "Rato Sem Fios",
    preco: 34.5,
    stock: 2,
    emPromocao: false,
    descricao: "Rato sem fios ergonómico com sensor óptico",
  },
  {
    nome: 'Monitor 27"',
    preco: 349.0,
    stock: 0,
    emPromocao: true,
    descricao: "Monitor LED de 27 polegadas Full HD",
  },
  {
    nome: "Headset Gaming",
    preco: 59.9,
    stock: 28,
    emPromocao: false,
    descricao: "Headset gaming com som surround 7.1",
  },
  {
    nome: "Webcam HD",
    preco: 45.0,
    stock: 7,
    emPromocao: true,
    descricao: "Webcam HD 1080p com microfone integrado",
  },
];

function calcularIVA(produto) {
    return produto.preco * 0.23;
}

console.log(`${produtos[0].nome} ${calcularIVA(produtos[0])}€ ${produtos[0].stock}`); 

function classificarStock(produto) {
  if (produto.stock == 0) { return "Fora de stock"; }
  else if (produto.stock < 5 && produto.stock > 1) { return "Stock crítico"; }
  else if (produto.stock > 6 && produto.stock < 20) { return "Stock normal"; }
  else if (produto.stock > 20) { return "elevado"; }
}

const nome = produtos.map(produto => produto.nome);
console.log(nome.map(n => `${n.toUpperCase()}\n`));

function calcularValorStock(produtos) {
  return produtos.reduce((acc, produto) => acc + produto.preco * produto.stock, 0);
}

console.log(`${calcularValorStock(produtos)}€`);

const produtosDisponiveis = produtos.filter(produto => produto.stock > 0);
console.log(`Número de produtos disponíveis: ${produtosDisponiveis.length}`);

function descricaoProduto(produto) {
  const etiqueta = produto.emPromocao ? "Em promoção" : "Preço normal";
  const precoFormatado = `${produto.preco.toFixed(2)}€`;
  return `${produto.nome} — ${precoFormatado} — ${classificarStock(produto)} — ${etiqueta}`;
}

produtos.forEach(produto => console.log(descricaoProduto(produto)));

function ordenarPorPreco(produtosArray) {
  return produtosArray.sort((a, b) => a.preco - b.preco);
}

function renderizarProdutos(produtosArray) {
  const listaProdutos = document.getElementById("lista-produtos");
  listaProdutos.innerHTML = produtosArray.map(p => `<div>${descricaoProduto(p)}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-disponiveis");
  const inputFiltro = document.getElementById("filtro-nome");
  let mostrandoTodos = true;

  function atualizarLista() {
    const base = mostrandoTodos ? produtos : produtosDisponiveis;
    const termo = inputFiltro.value.trim().toLowerCase();
    const filtrados = termo
      ? base.filter(p => p.nome.toLowerCase().includes(termo))
      : base;
    renderizarProdutos(ordenarPorPreco(filtrados));
  }

  atualizarLista();

  inputFiltro.addEventListener("input", atualizarLista);

  btn.addEventListener("click", () => {
    mostrandoTodos = !mostrandoTodos;
    btn.textContent = mostrandoTodos ? "Mostrar disponíveis" : "Mostrar todos";
    atualizarLista();
  });
});

function ordenarPorPreco(produtosArray) {
  return produtosArray.sort((a, b) => a.preco - b.preco);
}

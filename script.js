/* =========================================================
   BOLETIM DIGITAL - 8º ANO
   Dados atualizados conforme informado pelo usuário.
   ========================================================= */

/* ---------------------------------------------------------
   CONCEITO: array = uma lista de coisas.
   CONCEITO: objeto = uma "ficha" com várias informações.
   Aqui temos um array de objetos: cada objeto é uma disciplina.
   --------------------------------------------------------- */
const dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 8.9, tri2: 9.0, tri3: null, faltas: [1, 4, 0] },
  { disciplina: "Matemática", tri1: 6.2, tri2: 5.5, tri3: null, faltas: [4, 12, 0] },
  { disciplina: "Ciências", tri1: 6.4, tri2: 8.8, tri3: null, faltas: [3, 7, 0] },
  { disciplina: "História", tri1: 8.8, tri2: 7.4, tri3: null, faltas: [2, 1, 0] },
  { disciplina: "Geografia", tri1: 8.2, tri2: 6.0, tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Língua Inglesa", tri1: 9.4, tri2: 8.7, tri3: null, faltas: [1, 5, 0] },
  { disciplina: "Arte", tri1: 7.2, tri2: 8.3, tri3: null, faltas: [2, 4, 0] },
  { disciplina: "Educação Física", tri1: 9.2, tri2: 9.0, tri3: null, faltas: [1, 2, 0] },
  { disciplina: "Educação Digital", tri1: 9.3, tri2: 8.0, tri3: null, faltas: [2, 6, 0] },
  { disciplina: "Educação Financeira", tri1: 7.1, tri2: 7.3, tri3: null, faltas: [1, 2, 0] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 9.0, tri3: null, faltas: [2, 2, 0] },
  { disciplina: "Redação e Leitura", tri1: 6.6, tri2: 8.2, tri3: null, faltas: [2, 3, 0] },
  { disciplina: "Pensamento Lógico", tri1: 8.0, tri2: 8.5, tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: 7.4, tri2: 6.8, tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 6.3, tri2: 9.0, tri3: null, faltas: [2, 2, 0] }
];

/* Média mínima de referência */
const MEDIA_MINIMA = 6.0;

/* ---------------------------------------------------------
   FUNÇÃO: normalizarNota(valor)
   Recebe uma nota em qualquer formato e devolve:
   - um número entre 0 e 10, OU
   - null (quando a nota ainda não foi lançada ou é inválida).
   --------------------------------------------------------- */
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Aceita ponto ou vírgula decimal
  const numero = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  // Se não for número, é inválido
  if (isNaN(numero)) {
    return null;
  }

  // Entre 0 e 10: mantém igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Maior que 10 e até 100: divide por 10 (82 → 8.2 / 100 → 10.0)
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras: inválido
  return null;
}

/* ---------------------------------------------------------
   FUNÇÃO: calcularMedia(notas)
   Recebe um array de notas (já normalizadas) e devolve a média
   usando SOMENTE as notas disponíveis (não transforma ausente em 0).
   Se não houver nenhuma nota válida, devolve null.
   --------------------------------------------------------- */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) {
    return null;
  }
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

/* ---------------------------------------------------------
   FUNÇÃO: somarFaltas(lista)
   Soma todos os números de um array de faltas.
   --------------------------------------------------------- */
function somarFaltas(lista) {
  return lista.reduce((acc, n) => acc + n, 0);
}

/* ---------------------------------------------------------
   FUNÇÃO: definirSituacao(media)
   CONCEITO: if = "se isso, faça aquilo".
   - media null = "Nota ainda não disponível"
   - media >= 6 = "Bom desempenho"
   - senão = "Atenção"
   --------------------------------------------------------- */
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

/* ---------------------------------------------------------
   FUNÇÃO: formatarNota(valor)
   Mostra a nota com 1 casa decimal usando VÍRGULA (padrão BR).
   Se for null, mostra "—".
   --------------------------------------------------------- */
function formatarNota(valor) {
  if (valor === null) {
    return "—";
  }
  return valor.toFixed(1).replace(".", ",");
}

/* ---------------------------------------------------------
   FUNÇÃO: classeSituacao(situacao)
   Devolve o nome da classe CSS para colorir a célula.
   --------------------------------------------------------- */
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-indisponivel";
}

/* ---------------------------------------------------------
   FUNÇÃO: criarLinhaTabela(item)
   Monta uma linha <tr> da tabela para uma disciplina.
   --------------------------------------------------------- */
function criarLinhaTabela(item) {
  // Normaliza as três notas do trimestre
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Média e faltas
  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Devolve um objeto com tudo pronto para desenhar na tabela
  return {
    disciplina: item.disciplina,
    tri1: formatarNota(n1),
    tri2: formatarNota(n2),
    tri3: formatarNota(n3),
    media: formatarNota(media),
    faltas: totalFaltas,
    situacao,
    mediaNumerica: media
  };
}

/* ---------------------------------------------------------
   FUNÇÃO: preencherTabela()
   CONCEITO: DOM = a forma como o JavaScript conversa com o HTML.
   Aqui pegamos o <tbody id="corpo-tabela"> e criamos as linhas.
   CONCEITO: forEach = percorre cada item da lista.
   --------------------------------------------------------- */
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = ""; // limpa antes de preencher

  dadosBoletim.forEach((item) => {
    const linha = criarLinhaTabela(item);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${linha.disciplina}</td>
      <td>${linha.tri1}</td>
      <td>${linha.tri2}</td>
      <td>${linha.tri3}</td>
      <td><strong>${linha.media}</strong></td>
      <td>${linha.faltas}</td>
      <td class="${classeSituacao(linha.situacao)}">${linha.situacao}</td>
    `;
    corpo.appendChild(tr);
  });
}

/* ---------------------------------------------------------
   FUNÇÃO: preencherCards()
   Calcula e mostra os valores dos cards de resumo.
   --------------------------------------------------------- */
function preencherCards() {
  const linhas = dadosBoletim.map(criarLinhaTabela);

  // Média geral: média das médias disponíveis (ignora as indisponíveis)
  const mediasValidas = linhas
    .map((l) => l.mediaNumerica)
    .filter((m) => m !== null);

  const mediaGeral = mediasValidas.length > 0
    ? mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length
    : null;

  // Total de faltas
  const totalFaltas = linhas.reduce((acc, l) => acc + l.faltas, 0);

  // Contagem por situação
  const totalBom = linhas.filter((l) => l.situacao === "Bom desempenho").length;
  const totalAtencao = linhas.filter((l) => l.situacao === "Atenção").length;

  // Preenche os cards
  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

  document.getElementById("total-faltas").textContent = totalFaltas;

  document.getElementById("total-bom").textContent = totalBom;

  document.getElementById("total-atencao").textContent = totalAtencao;

  /* ATENÇÃO: este percentual é APENAS DEMONSTRATIVO nesta primeira versão.
     No futuro, a frequência será calculada de outra forma (a partir de
     dados reais de aulas), e não a partir das faltas deste boletim. */
  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
  document.getElementById("frequencia-obs").textContent = "Frequência adequada";
}

/* ---------------------------------------------------------
   INICIALIZAÇÃO
   Quando a página terminar de carregar, preenche tabela e cards.
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  preencherTabela();
  preencherCards();
});
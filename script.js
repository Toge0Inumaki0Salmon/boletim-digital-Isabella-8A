/* =========================================================
   BOLETIM DIGITAL - 8º ANO
   ========================================================= */

const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 14,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* Dados locais padrão/fictícios do projeto */
let dadosBoletim = [
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

/* PIN armazenado em memória durante a sessão */
let pinSessao = "";

/* Média mínima de referência */
const MEDIA_MINIMA = 6.0;

function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const numero = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) {
    return null;
  }
  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

function somarFaltas(lista) {
  if (!Array.isArray(lista)) return 0;
  return lista.reduce((acc, n) => acc + (Number(n) || 0), 0);
}

function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

function formatarNota(valor) {
  if (valor === null) {
    return "—";
  }
  return valor.toFixed(1).replace(".", ",");
}

function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-indisponivel";
}

function criarLinhaTabela(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

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

function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  dadosBoletim.forEach((item) => {
    const linha = criarLinhaTabela(item);

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.textContent = linha.disciplina;

    const td1 = document.createElement("td");
    td1.textContent = linha.tri1;

    const td2 = document.createElement("td");
    td2.textContent = linha.tri2;

    const td3 = document.createElement("td");
    td3.textContent = linha.tri3;

    const tdMedia = document.createElement("td");
    const strong = document.createElement("strong");
    strong.textContent = linha.media;
    tdMedia.appendChild(strong);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = linha.faltas;

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao(linha.situacao);
    tdSit.textContent = linha.situacao;

    tr.appendChild(tdDisc);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    corpo.appendChild(tr);
  });
}

function preencherCards() {
  const linhas = dadosBoletim.map(criarLinhaTabela);

  const mediasValidas = linhas
    .map((l) => l.mediaNumerica)
    .filter((m) => m !== null);

  const mediaGeral = mediasValidas.length > 0
    ? mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length
    : null;

  const totalFaltas = linhas.reduce((acc, l) => acc + l.faltas, 0);
  const totalBom = linhas.filter((l) => l.situacao === "Bom desempenho").length;
  const totalAtencao = linhas.filter((l) => l.situacao === "Atenção").length;

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : mediaGeral.toFixed(1).replace(".", ",");

  document.getElementById("total-faltas").textContent = totalFaltas;
  document.getElementById("total-bom").textContent = totalBom;
  document.getElementById("total-atencao").textContent = totalAtencao;

  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
  document.getElementById("frequencia-obs").textContent = "Frequência adequada";
}

function atualizarTela() {
  preencherTabela();
  preencherCards();
}

async function autenticarEErros(resposta) {
  if (resposta.status === 401) {
    throw new Error("Turma, chamada ou PIN inválidos.");
  }
  if (resposta.status === 429) {
    throw new Error("Muitas tentativas. Aguarde um minuto e tente novamente.");
  }
  if (!resposta.ok) {
    throw new Error("Não foi possível conectar ao servidor. Tente novamente.");
  }
}

async function entrarBoletim() {
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    await autenticarEErros(resposta);

    const data = await resposta.json();

    pinSessao = pinDigitado;
    campoPin.value = "";

    if (data && data.dados && Array.isArray(data.dados.disciplinas)) {
      dadosBoletim = data.dados.disciplinas;
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("painel-boletim").style.display = "block";
    msgLogin.textContent = "";

    atualizarTela();

  } catch (erro) {
    msgLogin.textContent = erro.message || "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

function abrirEdicao() {
  const corpoEdicao = document.getElementById("corpo-tabela-edicao");
  corpoEdicao.innerHTML = "";

  dadosBoletim.forEach((item, index) => {
    const tr = document.createElement("tr");

    const f = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    const formatarParaInput = (v) => {
      if (v === null || v === undefined) return "";
      return String(v).replace(".", ",");
    };

    tr.innerHTML = `
      <td></td>
      <td><input type="text" class="input-nota" data-index="${index}" data-campo="tri1" value="${formatarParaInput(item.tri1)}"></td>
      <td><input type="text" class="input-nota" data-index="${index}" data-campo="tri2" value="${formatarParaInput(item.tri2)}"></td>
      <td><input type="text" class="input-nota" data-index="${index}" data-campo="tri3" value="${formatarParaInput(item.tri3)}"></td>
      <td><input type="text" class="input-falta" data-index="${index}" data-campo="f1" value="${f[0] !== undefined ? f[0] : 0}"></td>
      <td><input type="text" class="input-falta" data-index="${index}" data-campo="f2" value="${f[1] !== undefined ? f[1] : 0}"></td>
      <td><input type="text" class="input-falta" data-index="${index}" data-campo="f3" value="${f[2] !== undefined ? f[2] : 0}"></td>
    `;

    tr.children[0].textContent = item.disciplina;
    corpoEdicao.appendChild(tr);
  });

  document.getElementById("painel-edicao").style.display = "block";
  document.getElementById("msg-edicao").textContent = "";
}

function validarNotaDigitada(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { ok: true, valor: null };

  const textoComPonto = v.replace(",", ".");
  const num = Number(textoComPonto);

  if (isNaN(num) || num < 0 || num > 10) {
    return { ok: false, valor: null };
  }

  return { ok: true, valor: num };
}

function validarFaltaDigitada(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { ok: false, valor: null };

  const num = Number(v);

  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return { ok: false, valor: null };
  }

  return { ok: true, valor: num };
}

async function salvarAlteracoes() {
  const msgEdicao = document.getElementById("msg-edicao");
  msgEdicao.textContent = "";

  const inputs = document.querySelectorAll("#corpo-tabela-edicao input");
  inputs.forEach(i => i.classList.remove("input-invalido"));

  let temErro = false;
  const copiaDisciplinas = JSON.parse(JSON.stringify(dadosBoletim));

  inputs.forEach((input) => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const campo = input.getAttribute("data-campo");
    const val = input.value;

    if (campo.startsWith("tri")) {
      const res = validarNotaDigitada(val);
      if (!res.ok) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        copiaDisciplinas[idx][campo] = res.valor;
      }
    } else if (campo.startsWith("f")) {
      const res = validarFaltaDigitada(val);
      if (!res.ok) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        const fIdx = parseInt(campo.replace("f", ""), 10) - 1;
        if (!Array.isArray(copiaDisciplinas[idx].faltas)) {
          copiaDisciplinas[idx].faltas = [0, 0, 0];
        }
        copiaDisciplinas[idx].faltas[fIdx] = res.valor;
      }
    }
  });

  if (temErro) {
    msgEdicao.textContent = "Existem valores inválidos destacados em vermelho. Corrija-os para salvar.";
    return;
  }

  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: copiaDisciplinas
        }
      })
    });

    await autenticarEErros(resposta);

    dadosBoletim = copiaDisciplinas;
    atualizarTela();

    msgEdicao.textContent = "Dados salvos com sucesso.";
    setTimeout(() => {
      document.getElementById("painel-edicao").style.display = "none";
      msgEdicao.textContent = "";
    }, 1200);

  } catch (erro) {
    msgEdicao.textContent = erro.message || "Erro ao salvar alterações. Tente novamente.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", entrarBoletim);

  document.getElementById("campo-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") entrarBoletim();
  });

  document.getElementById("btn-editar").addEventListener("click", abrirEdicao);
  document.getElementById("btn-salvar").addEventListener("click", salvarAlteracoes);

  document.getElementById("btn-cancelar").addEventListener("click", () => {
    document.getElementById("painel-edicao").style.display = "none";
  });
});
"use strict";

const $ = (id) => document.getElementById(id);
const moeda = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );
const numero = (v, casas = 2) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(v);
let analise = null;

function entrada(id, min, max) {
  const elemento = $(id);
  const bruto = elemento.value.trim();
  const valor = Number(bruto);
  if (!bruto || !Number.isFinite(valor) || valor < min || valor > max) {
    throw new Error(
      `Confira o campo “${elemento.closest("label").textContent.trim()}” (entre ${min} e ${max}).`,
    );
  }
  return valor;
}

function calcular() {
  try {
    analise = null;
    $("erro").hidden = true;
    const potencia = entrada("potencia", 0.01, 10000);
    const horas = entrada("horas", 0.1, 24);
    const tarifa = entrada("tarifa", 0, 100);
    const painel = entrada("painel", 0, 100000);
    const sol = entrada("sol", 0, 24);
    const eficiencia = entrada("eficiencia", 1, 100) / 100;
    const bateria = entrada("bateria", 0, 1000000);
    const utilizavel = entrada("utilizavel", 1, 100) / 100;
    const investimento = entrada("investimento", 0, 100000000);
    const manutencao = entrada("manutencao", 0, 100000000);

    const diarioWh = potencia * horas;
    const mensalKwh = (diarioWh * 30) / 1000;
    const custoMensal = mensalKwh * tarifa;
    const custoAnual = ((diarioWh * 365) / 1000) * tarifa;
    const geracaoWh = painel * sol * eficiencia;
    const autonomiaH = (bateria * utilizavel) / potencia;
    const saldoAnual = custoAnual - manutencao;
    const suficiente = geracaoWh >= diarioWh && geracaoWh > 0;
    const retornoAnos =
      suficiente && saldoAnual > 0 ? investimento / saldoAnual : null;

    analise = {
      potencia,
      horas,
      diarioWh,
      mensalKwh,
      custoMensal,
      custoAnual,
      geracaoWh,
      autonomiaH,
      suficiente,
      investimento,
      manutencao,
      retornoAnos,
    };
    $("diario").textContent = numero(diarioWh) + " Wh";
    $("mensal").textContent = numero(mensalKwh, 3) + " kWh";
    $("custo").textContent = moeda(custoMensal);
    $("rede-anual").textContent = moeda(custoAnual);
    $("solar-anual").textContent = moeda(manutencao);
    $("geracao").textContent = numero(geracaoWh) + " Wh/dia";
    $("autonomia").textContent = numero(autonomiaH) + " h";
    $("suficiencia").textContent = suficiente
      ? "Geração média ≥ consumo"
      : "Geração média insuficiente";
    $("retorno").textContent =
      retornoAnos === null
        ? "Não há retorno simples"
        : numero(retornoAnos, 1) + " anos";

    const fraseSolar = suficiente
      ? "A geração solar diária média estimada cobre o consumo diário informado, mas isso NÃO garante continuidade em dias nublados ou chuvosos."
      : "A geração solar diária média estimada NÃO cobre o consumo informado; seria necessário revisar painel, carga ou fonte de apoio.";
    const fraseCusto =
      retornoAnos === null
        ? !suficiente
          ? "Como a geração estimada não cobre o consumo, não dá para calcular um retorno financeiro confiável assumindo substituição total da rede."
          : "Com os custos informados, não há economia operacional anual positiva que permita calcular retorno simples do investimento."
        : `No cenário ideal de substituição total da rede, o retorno simples seria de ${numero(retornoAnos, 1)} anos. Isso não é uma previsão de economia: a estimativa desconsidera falhas, variação do clima, substituição de bateria e custo de capital.`;
    $("recomendacao").textContent =
      `A Estação 01 demandaria aproximadamente ${numero(diarioWh)} Wh por dia (${numero(mensalKwh, 3)} kWh em 30 dias). Na rede elétrica, o custo estimado seria ${moeda(custoMensal)} por mês. ${fraseSolar} A bateria teria autonomia teórica de ${numero(autonomiaH)} horas sem recarga. ${fraseCusto} Para monitoramento de alagamentos, priorize a disponibilidade contínua da estação e o dimensionamento para vários dias de pouca insolação.`;
    $("resposta-pergunta").textContent =
      "Selecione uma pergunta para obter uma orientação complementar.";
  } catch (erro) {
    $("erro").textContent = erro.message;
    $("recomendacao").textContent =
      "Revise os dados acima para atualizar as recomendações.";
    $("resposta-pergunta").textContent = "Aguardando valores válidos.";
    $("erro").hidden = false;
  }
}

const respostas = {
  economia: () =>
    `Considere reduzir transmissões desnecessárias e usar modos de baixo consumo do ESP32 apenas quando houver margem de segurança. Com carga média estimada de ${numero(analise.potencia)} W, uma redução deve ser validada com medições reais e nunca atrasar alertas de risco.`,
  solar: () =>
    `Com os parâmetros inseridos, a geração diária solar estimada é ${numero(analise.geracaoWh)} Wh e a demanda da estação é ${numero(analise.diarioWh)} Wh. ${analise.suficiente ? "A média estimada é suficiente em energia diária, mas é preciso verificar períodos sem sol e a capacidade da bateria." : "A geração média não é suficiente para operar a estação como fonte única; ampliar o painel ou manter a rede como apoio pode ser necessário."} Para decidir, considere também instalação, manutenção, bateria e disponibilidade da rede elétrica.`,
  ambiente: () =>
    "A alimentação solar pode reduzir a dependência da rede e é uma fonte renovável. Porém, a fabricação e o descarte de painéis e baterias geram impactos. Uma comparação quantitativa de emissões exige dados fundamentados de ciclo de vida e do sistema elétrico local.",
  risco: () =>
    `Durante chuva intensa ou risco de alagamento, não é seguro reduzir indiscriminadamente a frequência de leituras ou alertas. A bateria informada teria autonomia teórica de ${numero(analise.autonomiaH)} horas sem recarga, supondo carga constante e bateria cheia. Use energia de backup e dimensionamento conservador; isto não constitui garantia de operação.`,
};

$("calcular").addEventListener("click", calcular);
document.querySelectorAll("[data-question]").forEach((botao) => {
  botao.addEventListener("click", () => {
    calcular();
    if (!analise) return;
    const resposta = respostas[botao.dataset.question];
    if (resposta) $("resposta-pergunta").textContent = resposta();
  });
});
calcular();

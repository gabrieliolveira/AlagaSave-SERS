# AlagaSave 🌊

O **AlagaSave** é um sistema inteligente de monitoramento de alagamentos que utiliza um ESP32 simulado no Wokwi para acompanhar o nível da água e a intensidade da chuva.

Os dados são enviados ao Supabase e apresentados em uma aplicação web, permitindo visualizar as condições da estação, a classificação de risco e o histórico das medições.

## Tecnologias utilizadas

- **ESP32 e Wokwi** — simulação e processamento dos sensores.
- **HC-SR04 e potenciômetro** — monitoramento da água e simulação da chuva.
- **Supabase** — armazenamento dos dados.
- **HTML, CSS e JavaScript** — aplicação web.

## Gestão Energética

O sistema também possui uma área de gestão energética que permite estimar o consumo da estação e comparar duas alternativas de alimentação: **rede elétrica e energia solar com bateria**.

A análise considera custos, consumo, autonomia, viabilidade e impactos ambientais. Com base nesses resultados, o assistente apresenta recomendações para um funcionamento mais econômico e sustentável.

## Testes e documentação

Os cálculos, cenários de simulação e registros de testes estão disponíveis na pasta `docs/`.

## Vídeo técnico

https://youtu.be/Eo9eMh-4XGo

## Referências

- [Espressif — ESP32](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/)
- [ANEEL](https://www.gov.br/aneel/pt-br)
- [CRESESB](https://www.cresesb.cepel.br/)

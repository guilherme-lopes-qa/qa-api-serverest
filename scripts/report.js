const fs = require('fs');
const path = require('path');

const pastaResultados = path.join(__dirname, '..', 'cypress', 'results');
const pastaRelatorios = path.join(__dirname, '..', 'cypress', 'reports');
const pastaDocs = path.join(__dirname, '..', 'docs');

const arquivoRelatorio = path.join(pastaRelatorios, 'relatorio-testes-api.html');
const arquivoDocs = path.join(pastaDocs, 'index.html');

function carregarResultados() {
  if (!fs.existsSync(pastaResultados)) {
    return [];
  }

  return fs
    .readdirSync(pastaResultados)
    .filter((arquivo) => arquivo.endsWith('.json'))
    .map((arquivo) => {
      const conteudo = fs.readFileSync(path.join(pastaResultados, arquivo), 'utf8');
      return JSON.parse(conteudo);
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function escaparHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function copiarEvidencias(resultados) {
  const pastaEvidenciasDocs = path.join(pastaDocs, 'evidencias');

  if (!fs.existsSync(pastaEvidenciasDocs)) {
    fs.mkdirSync(pastaEvidenciasDocs, { recursive: true });
  }

  resultados.forEach((item) => {
    const nomeArquivo = path.basename(item.evidencia);

    const origem = path.join(
      __dirname,
      '..',
      'cypress',
      'screenshots',
      'usuarios.feature',
      nomeArquivo
    );

    const destino = path.join(pastaEvidenciasDocs, nomeArquivo);

    if (fs.existsSync(origem)) {
      fs.copyFileSync(origem, destino);
      item.evidencia = `evidencias/${nomeArquivo}`;
    }
  });
}

function gerarHtml(resultados) {
  const total = resultados.length;
  const aprovados = resultados.filter((item) => item.statusTeste === 'Aprovado').length;
  const reprovados = total - aprovados;
  const percentualAprovacao = total > 0 ? Math.round((aprovados / total) * 100) : 0;
  const dataExecucao = new Date().toLocaleString('pt-BR');

  const linhasTabela = resultados.map((item) => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>${item.tipo}</td>
      <td>${item.cenario}</td>
      <td><span class="method">${item.metodo}</span></td>
      <td><code>${item.endpoint}</code></td>
      <td><span class="http">${item.statusHttp}</span></td>
      <td><span class="badge success">${item.statusTeste}</span></td>
      <td><a href="${item.evidencia}" target="_blank">Abrir evidência</a></td>
    </tr>
  `).join('');

  const detalhes = resultados.map((item) => `
    <section class="case-card">
      <div class="case-header">
        <div>
          <h3>${item.id} - ${item.cenario}</h3>
          <p>${item.tipo} • ${item.metodo} ${item.endpoint}</p>
        </div>
        <span class="badge success">${item.statusTeste}</span>
      </div>

      <h4>Validações realizadas</h4>
      <ul>
        ${item.validacoes.map((validacao) => `<li>${validacao}</li>`).join('')}
      </ul>

      <details>
        <summary>Request Body</summary>
        <pre>${escaparHtml(JSON.stringify(item.requestBody || {}, null, 2))}</pre>
      </details>

      <details>
        <summary>Response Body</summary>
        <pre>${escaparHtml(JSON.stringify(item.responseBody || {}, null, 2))}</pre>
      </details>

      <p class="evidence">
        Evidência: <a href="${item.evidencia}" target="_blank">${item.evidencia}</a>
      </p>
    </section>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório de Execução de Testes - API ServeRest</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      color: #111827;
    }

    header {
      background: linear-gradient(135deg, #111827, #1f2937);
      color: white;
      padding: 40px;
    }

    header h1 {
      margin: 0 0 8px;
      font-size: 32px;
    }

    header p {
      margin: 4px 0;
      color: #d1d5db;
    }

    main {
      padding: 32px 40px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: -24px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }

    .summary-card strong {
      display: block;
      font-size: 30px;
      margin-bottom: 4px;
    }

    .summary-card span {
      color: #6b7280;
      font-size: 14px;
    }

    .section {
      background: white;
      border-radius: 14px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      margin-bottom: 28px;
    }

    h2 {
      margin-top: 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      background: #f9fafb;
      text-align: left;
      color: #374151;
    }

    th, td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    code {
      background: #f3f4f6;
      padding: 3px 6px;
      border-radius: 6px;
    }

    .badge {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
    }

    .success {
      background: #dcfce7;
      color: #166534;
    }

    .danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .method {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 5px 8px;
      border-radius: 6px;
      font-weight: bold;
    }

    .http {
      background: #ecfdf5;
      color: #047857;
      padding: 5px 8px;
      border-radius: 6px;
      font-weight: bold;
    }

    .case-card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 18px;
      background: #ffffff;
    }

    .case-header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-start;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .case-header h3 {
      margin: 0 0 6px;
    }

    .case-header p {
      margin: 0;
      color: #6b7280;
    }

    details {
      margin-top: 12px;
    }

    summary {
      cursor: pointer;
      font-weight: bold;
      color: #1f2937;
    }

    pre {
      background: #111827;
      color: #d1d5db;
      padding: 16px;
      border-radius: 10px;
      overflow-x: auto;
      font-size: 13px;
    }

    a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .evidence {
      margin-top: 16px;
      color: #374151;
    }

    .observations {
      line-height: 1.6;
    }

    footer {
      padding: 24px 40px;
      color: #6b7280;
      font-size: 13px;
      text-align: center;
    }
  </style>
</head>

<body>
  <header>
    <h1>Relatório de Execução de Testes - API ServeRest</h1>
    <p>Projeto: Desafio Técnico QA - Testes de API</p>
    <p>Ferramenta: Cypress + Gherkin</p>
    <p>Data da execução: ${dataExecucao}</p>
  </header>

  <main>
    <section class="summary">
      <div class="summary-card">
        <strong>${total}</strong>
        <span>Total de cenários</span>
      </div>

      <div class="summary-card">
        <strong>${aprovados}</strong>
        <span>Cenários aprovados</span>
      </div>

      <div class="summary-card">
        <strong>${reprovados}</strong>
        <span>Cenários reprovados</span>
      </div>

      <div class="summary-card">
        <strong>${percentualAprovacao}%</strong>
        <span>Taxa de aprovação</span>
      </div>
    </section>

    <section class="section">
      <h2>Resumo da execução</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Cenário</th>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Status HTTP</th>
            <th>Resultado</th>
            <th>Evidência</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>
    </section>

    <section class="section">
      <h2>Detalhamento dos cenários</h2>
      ${detalhes}
    </section>

    <section class="section observations">
      <h2>Observações finais</h2>
      <p>
        A suíte automatizada validou os principais comportamentos da rota de usuários da API ServeRest,
        contemplando fluxo básico, fluxo alternativo e fluxos de exceção.
      </p>
      <p>
        Foram validados status HTTP, mensagens de retorno, campos obrigatórios, estrutura mínima de resposta
        e regras funcionais relacionadas ao cadastro de usuários.
      </p>
      <p>
        As evidências foram geradas durante a execução dos testes e vinculadas aos respectivos cenários.
      </p>
    </section>
  </main>

  <footer>
    Relatório de execução dos testes automatizados.
  </footer>
</body>
</html>
`;
}

const resultados = carregarResultados();

if (!fs.existsSync(pastaDocs)) {
  fs.mkdirSync(pastaDocs, { recursive: true });
}

copiarEvidencias(resultados);

const html = gerarHtml(resultados);

if (!fs.existsSync(pastaRelatorios)) {
  fs.mkdirSync(pastaRelatorios, { recursive: true });
}

fs.writeFileSync(arquivoRelatorio, html, 'utf8');
fs.writeFileSync(arquivoDocs, html, 'utf8');

console.log(`Relatório gerado em: ${arquivoRelatorio}`);
console.log(`Página pública gerada em: ${arquivoDocs}`);
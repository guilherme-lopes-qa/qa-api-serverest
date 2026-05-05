Cypress.Commands.add('exibirTelaExecucao', (titulo) => {
  cy.document().then((doc) => {
    doc.body.innerHTML = `
      <main style="
        font-family: Arial, sans-serif;
        padding: 32px;
        background: #f4f6f8;
        color: #1f2937;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <section style="
          background: #ffffff;
          border-radius: 12px;
          padding: 32px;
          width: 760px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          text-align: center;
        ">
          <h1 style="margin-top: 0; color: #111827;">${titulo}</h1>
          <p style="font-size: 18px; color: #374151;">
            Executando cenário de teste...
          </p>
          <p style="color: #6b7280;">
            Aguarde enquanto a requisição é processada e validada.
          </p>
        </section>
      </main>
    `;
  });

  cy.wait(800, { log: false });
});

Cypress.Commands.add('gerarEvidenciaApi', ({ nomeArquivo, titulo, metodo, endpoint, status, requestBody, responseBody }) => {
  cy.document().then((doc) => {
    doc.body.innerHTML = `
      <main style="
        font-family: Arial, sans-serif;
        padding: 32px;
        background: #f4f6f8;
        color: #1f2937;
        min-height: 100vh;
      ">
        <section style="
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        ">
          <h1 style="margin-top: 0; color: #111827;">${titulo}</h1>

          <div style="
            display: inline-block;
            padding: 8px 12px;
            border-radius: 8px;
            background: ${status >= 200 && status < 300 ? '#dcfce7' : '#fee2e2'};
            color: ${status >= 200 && status < 300 ? '#166534' : '#991b1b'};
            font-weight: bold;
            margin-bottom: 20px;
          ">
            Status HTTP: ${status}
          </div>

          <h2>Requisição</h2>
          <p><strong>Método:</strong> ${metodo}</p>
          <p><strong>Endpoint:</strong> ${endpoint}</p>

          <h3>Body enviado</h3>
          <pre style="
            background: #111827;
            color: #d1d5db;
            padding: 16px;
            border-radius: 8px;
            white-space: pre-wrap;
            overflow-x: auto;
          ">${JSON.stringify(requestBody || {}, null, 2)}</pre>

          <h2>Resposta</h2>
          <pre style="
            background: #111827;
            color: #d1d5db;
            padding: 16px;
            border-radius: 8px;
            white-space: pre-wrap;
            overflow-x: auto;
          ">${JSON.stringify(responseBody || {}, null, 2)}</pre>

          <p style="margin-top: 24px; color: #6b7280;">
            Evidência gerada durante a execução dos testes automatizados.
          </p>
        </section>
      </main>
    `;
  });

  cy.wait(1500, { log: false });

  cy.screenshot(nomeArquivo, { capture: 'viewport' });

  cy.wait(800, { log: false });
});

Cypress.Commands.add('registrarResultadoApi', (resultado) => {
  cy.task('salvarResultadoApi', resultado, { log: false });
});
import puppeteer from "puppeteer";

async function generateInvoicePdfBuffer({ projectId, periodId, ledgerRows }) {
  const html = buildInvoiceHtml({ projectId, periodId, ledgerRows });
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdfBuffer;
}

function buildInvoiceHtml({ projectId, periodId, ledgerRows }) {
  const rowsHtml = ledgerRows
    .map(
      (r) => `
    <tr>
      <td>${r.tasker_name}</td>
      <td>${r.project_name}</td>
      <td>${r.task_ref}</td>
      <td style="text-align:right">${r.amount.toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  const total = ledgerRows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return `
    <html>
      <body>
        <h2>Invoice</h2>
        <p>Project: ${projectId} | Period: ${periodId}</p>
        <table border="1" cellspacing="0" cellpadding="5">
          <tr><th>Tasker</th><th>Project</th><th>Task Ref</th><th>Amount (Ksh)</th></tr>
          ${rowsHtml}
        </table>
        <h3>Total: Ksh ${total.toFixed(2)}</h3>
      </body>
    </html>`;
}

export default generateInvoicePdfBuffer;
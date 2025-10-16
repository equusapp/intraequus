import { EQUUS_COMPANY_DATA } from './company-data'
import { formatCurrency, formatDate } from './utils'

// Logo EQUUS en base64 para PDFs
const EQUUS_LOGO_SVG = `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="240" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .shield { fill: #1e5f4f; }
      .horse { fill: #ffffff; }
    </style>
  </defs>
  <path class="shield" d="M100 10 C140 10, 170 25, 180 45 C185 60, 185 80, 180 100 C175 140, 165 180, 150 210 C130 230, 110 235, 100 240 C90 235, 70 230, 50 210 C35 180, 25 140, 20 100 C15 80, 15 60, 20 45 C30 25, 60 10, 100 10 Z"/>
  <path class="horse" d="M60 70 C65 65, 75 60, 85 65 C95 70, 105 75, 115 80 C125 85, 135 90, 145 100 C150 110, 148 120, 145 130 C140 140, 130 145, 120 148 C110 150, 100 148, 95 145 C90 140, 88 135, 85 130 C80 125, 75 120, 70 115 C65 110, 60 105, 58 100 C56 95, 58 90, 60 85 C62 80, 64 75, 60 70 Z"/>
  <path class="horse" d="M120 85 C130 80, 140 85, 145 95 C148 105, 145 115, 140 120 C135 125, 125 128, 115 125 C105 122, 100 115, 105 105 C110 95, 115 90, 120 85 Z"/>
  <path class="horse" d="M85 65 C90 60, 100 55, 110 60 C115 65, 118 70, 115 75 C110 80, 100 82, 90 80 C85 75, 82 70, 85 65 Z"/>
</svg>
`)}`

// Generador de PDF para facturas
// Requiere jspdf (ya incluido en package.json)

export function generateInvoicePDF(invoice: any) {
  // Por ahora, mostramos un mensaje. Para producción usar jsPDF
  console.log('Generando PDF para factura:', invoice)
  
  // Implementación básica para desarrollo
  // En producción, usar jsPDF para generar el PDF real
  
  const pdfContent = generateInvoiceHTML(invoice)
  
  // Abrir en nueva ventana para previsualización
  const printWindow = window.open('', '', 'width=800,height=600')
  if (printWindow) {
    printWindow.document.write(pdfContent)
    printWindow.document.close()
    printWindow.print()
  }
}

function generateInvoiceHTML(invoice: any): string {
  const isIssued = invoice.type === 'issued'
  const vatAmount = invoice.base_amount * invoice.vat_rate / 100
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Factura ${invoice.invoice_number}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      border-bottom: 3px solid #B8D8D8;
      padding-bottom: 20px;
    }
    .company-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .company-logo {
      width: 60px;
      height: 72px;
    }
    .company-details h1 {
      font-size: 24px;
      font-weight: bold;
      color: #1e5f4f;
      margin: 0 0 5px 0;
    }
    .company-details p {
      font-size: 14px;
      color: #7FA6C8;
      margin: 0;
    }
    .invoice-title {
      text-align: right;
      flex: 1;
    }
    .invoice-number {
      font-size: 32px;
      font-weight: bold;
      color: #7FA6C8;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #7FA6C8;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .detail-box {
      background: #F5F1E8;
      padding: 15px;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #B8D8D8;
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #E8DCC4;
    }
    .totals {
      margin-top: 30px;
      float: right;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-final {
      border-top: 2px solid #7FA6C8;
      margin-top: 10px;
      padding-top: 10px;
      font-size: 20px;
      font-weight: bold;
      color: #7FA6C8;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #E8DCC4;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-paid {
      background: #D1FAE5;
      color: #065F46;
    }
    .status-pending {
      background: #FEF3C7;
      color: #92400E;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <img src="${EQUUS_LOGO_SVG}" alt="EQUUS Logo" class="company-logo">
      <div class="company-details">
        <h1>${EQUUS_COMPANY_DATA.name}</h1>
        <p>Sistema de Gestión Ecuestre</p>
        <div style="margin-top: 10px; font-size: 12px; color: #666;">
          <div>CIF: ${EQUUS_COMPANY_DATA.taxId}</div>
          <div>${EQUUS_COMPANY_DATA.address}</div>
          <div>${EQUUS_COMPANY_DATA.postalCode} ${EQUUS_COMPANY_DATA.city}, ${EQUUS_COMPANY_DATA.country}</div>
          <div>${EQUUS_COMPANY_DATA.email}</div>
        </div>
      </div>
    </div>
    <div class="invoice-title">
      <div style="font-size: 18px; color: #666; margin-bottom: 10px;">
        ${isIssued ? 'FACTURA' : 'FACTURA RECIBIDA'}
      </div>
      <div class="invoice-number">${invoice.invoice_number}</div>
      <div style="margin-top: 10px;">
        <span class="status-badge ${invoice.status === 'paid' ? 'status-paid' : 'status-pending'}">
          ${invoice.status === 'paid' ? 'PAGADA' : 'PENDIENTE'}
        </span>
      </div>
    </div>
  </div>

  <div class="details-grid">
    <div class="detail-box">
      <div class="section-title">${isIssued ? 'Cliente' : 'Proveedor'}</div>
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${invoice.contact}</div>
    </div>
    <div class="detail-box">
      <div class="section-title">Fecha de Emisión</div>
      <div style="font-size: 16px; font-weight: bold;">${formatDate(invoice.issue_date)}</div>
      ${invoice.due_date ? `
        <div style="margin-top: 10px;">
          <div class="section-title">Fecha de Vencimiento</div>
          <div style="font-size: 16px; font-weight: bold;">${formatDate(invoice.due_date)}</div>
        </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Concepto</div>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th style="text-align: right;">Base Imponible</th>
          <th style="text-align: right;">IVA</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.concept}</td>
          <td style="text-align: right;">${formatCurrency(invoice.base_amount)}</td>
          <td style="text-align: right;">${invoice.vat_rate}%</td>
          <td style="text-align: right; font-weight: bold;">${formatCurrency(invoice.total_amount)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="totals-row">
      <span>Base Imponible:</span>
      <span>${formatCurrency(invoice.base_amount)}</span>
    </div>
    <div class="totals-row">
      <span>IVA (${invoice.vat_rate}%):</span>
      <span>${formatCurrency(vatAmount)}</span>
    </div>
    <div class="totals-row total-final">
      <span>TOTAL:</span>
      <span>${formatCurrency(invoice.total_amount)}</span>
    </div>
  </div>

  <div style="clear: both;"></div>

  ${invoice.payment_date ? `
    <div class="section" style="margin-top: 40px; background: #D1FAE5; padding: 15px; border-radius: 8px;">
      <strong>Información de Pago:</strong> Factura pagada el ${formatDate(invoice.payment_date)}
    </div>
  ` : ''}

  <div class="footer">
    <p><strong>${EQUUS_COMPANY_DATA.name}</strong></p>
    <p>${EQUUS_COMPANY_DATA.address}, ${EQUUS_COMPANY_DATA.postalCode} ${EQUUS_COMPANY_DATA.city}</p>
    <p>CIF: ${EQUUS_COMPANY_DATA.taxId} | Email: ${EQUUS_COMPANY_DATA.email}</p>
  </div>
</body>
</html>
  `
}

// Para producción: Función usando jsPDF
export async function generateInvoicePDFFile(invoice: any) {
  // Descomentar cuando se implemente jsPDF en producción
  /*
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  
  // Configurar documento
  doc.setFontSize(24)
  doc.text(EQUUS_COMPANY_DATA.name, 20, 20)
  
  // ... implementar diseño completo del PDF
  
  // Descargar
  doc.save(`factura-${invoice.invoice_number}.pdf`)
  */
  
  // Por ahora usar la versión HTML
  generateInvoicePDF(invoice)
}

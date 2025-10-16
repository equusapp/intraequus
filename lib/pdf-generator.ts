import { EQUUS_COMPANY_DATA } from './company-data'
import { formatCurrency, formatDate } from './utils'

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
      margin-bottom: 40px;
      border-bottom: 3px solid #B8D8D8;
      padding-bottom: 20px;
    }
    .company-info {
      flex: 1;
    }
    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #7FA6C8;
      margin-bottom: 10px;
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
      <div class="company-name">${EQUUS_COMPANY_DATA.name}</div>
      <div>CIF: ${EQUUS_COMPANY_DATA.taxId}</div>
      <div>${EQUUS_COMPANY_DATA.address}</div>
      <div>${EQUUS_COMPANY_DATA.postalCode} ${EQUUS_COMPANY_DATA.city}, ${EQUUS_COMPANY_DATA.country}</div>
      <div>${EQUUS_COMPANY_DATA.email}</div>
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

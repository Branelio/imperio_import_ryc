import type { DropiOrder } from '@/lib/dropi-parser'

export async function generateManifestPDF(
  orders: DropiOrder[],
  courierName: string,
  manifestNumber: string
) {
  if (typeof window === 'undefined') return

  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const now = new Date()
  const formattedDate = now.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const primaryColor = [15, 23, 42] // Slate 900
  const textColor = [51, 65, 85] // Slate 700

  // Top Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 297, 26, 'F')

  // Header Title
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('IMPERIO IMPORT R&C — MANIFIESTO DE ENTREGA Y DESPACHO', 14, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(251, 191, 36) // Amber 400
  doc.text(`TRANSPORTADORA: ${courierName.toUpperCase()}`, 14, 20)

  doc.setTextColor(203, 213, 225)
  doc.setFontSize(8)
  doc.text(`Manifiesto N°: ${manifestNumber}  |  Fecha: ${formattedDate}`, 283, 20, { align: 'right' })

  // Calculate totals
  const totalGuias = orders.length
  const totalUnidades = orders.reduce((acc, o) => acc + (o.cantidad || 1), 0)
  const totalRecaudo = orders.reduce((acc, o) => acc + (o.totalOrden || 0), 0)

  // Summary Metadata Card
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, 30, 269, 14, 2, 2, 'FD')

  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(`Total Envíos: ${totalGuias}`, 20, 39)
  doc.text(`Total Unidades/Paquetes: ${totalUnidades}`, 105, 39)
  doc.text(`Valor Total Recaudo (Cobro contra entrega): $${totalRecaudo.toFixed(2)}`, 190, 39)

  // Prepare table data
  const tableRows = orders.map((o, idx) => [
    `${idx + 1}`,
    o.numeroGuia || 'N/A',
    o.cliente || 'Sin nombre',
    `${o.ciudad || ''}${o.departamento ? `, ${o.departamento}` : ''}`,
    o.telefono || 'N/A',
    o.direccion || 'Sin dirección',
    `${o.producto} (x${o.cantidad})`,
    `$${(o.totalOrden || 0).toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: 48,
    head: [['#', 'N° Guía', 'Destinatario', 'Ciudad / Destino', 'Teléfono', 'Dirección', 'Producto / Uds', 'Recaudo ($)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 35 },
      4: { cellWidth: 26 },
      5: { cellWidth: 55 },
      6: { cellWidth: 44 },
      7: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [51, 65, 85],
      overflow: 'linebreak',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      const currentPage = data.pageNumber
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Página ${currentPage} de ${totalPages} — Manifiesto de Despacho Imperio Import R&C`,
        148,
        205,
        { align: 'center' }
      )
    },
  })

  // Sign-off section on last page or below table
  const finalY = (doc as any).lastAutoTable.finalY || 140

  if (finalY + 45 > 195) {
    doc.addPage()
  }

  const signY = (finalY + 45 > 195) ? 25 : finalY + 8

  // Driver Sign-off box
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(203, 213, 225)
  doc.roundedRect(14, signY, 269, 32, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(15, 23, 42)
  doc.text('CONTROL Y RECEPCIÓN DE PAQUETES POR EL COURIER:', 18, signY + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(51, 65, 85)

  doc.text('Nombre Recolector/Chofer: _____________________________________', 18, signY + 16)
  doc.text('Cédula de Identidad: _______________________', 18, signY + 25)

  doc.text('Placa Vehículo: ____________________', 150, signY + 16)
  doc.text('Hora Retiro: ______ : ______', 150, signY + 25)

  doc.text('Firma Recolector Courier: ______________________', 210, signY + 16)
  doc.text('Firma Despachador Imperio Import: ______________________', 210, signY + 25)

  // Save PDF
  const filename = `manifiesto_${courierName.toLowerCase().replace(/\s+/g, '_')}_${manifestNumber}.pdf`
  doc.save(filename)
}

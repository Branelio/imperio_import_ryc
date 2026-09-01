import type { Product } from '@/lib/types'

export async function generateProductsPDF(products: Product[], categoryName: string = 'Todos') {
  if (typeof window === 'undefined') return

  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({
    orientation: 'portrait',
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

  // Color Palette
  const primaryColor = [15, 23, 42] // Slate 900
  const textColor = [51, 65, 85] // Slate 700

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 28, 'F')

  // Header Title
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('IMPERIO IMPORT R&C', 14, 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(251, 191, 36) // Amber 400
  doc.text('Catálogo Oficial de Productos', 14, 21)

  // Date on right
  doc.setTextColor(203, 213, 225) // Slate 300
  doc.setFontSize(8)
  doc.text(`Fecha: ${formattedDate}`, 196, 21, { align: 'right' })

  // Summary Metadata Card
  doc.setFillColor(248, 250, 252) // Slate 50
  doc.setDrawColor(226, 232, 240) // Slate 200
  doc.roundedRect(14, 34, 182, 18, 2, 2, 'FD')

  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(`Categoría: ${categoryName}`, 18, 45)
  doc.text(`Total Productos: ${products.length}`, 85, 45)
  
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  doc.text(`Stock Total: ${totalStock} uds.`, 150, 45)

  // Prepare table data
  const tableRows = products.map(p => [
    p.sku || 'N/A',
    p.name || 'Sin nombre',
    (p.categories && p.categories.length > 0) ? p.categories.join(', ') : 'General',
    `${p.stock || 0}`,
    `$${(p.price || 0).toFixed(2)}`,
    p.priceSuggested ? `$${p.priceSuggested.toFixed(2)}` : 'N/A',
  ])

  autoTable(doc, {
    startY: 56,
    head: [['SKU', 'Producto', 'Categoría', 'Stock', 'P. Mayorista', 'PVP Sugerido']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 64 },
      2: { cellWidth: 38 },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 23, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 23, halign: 'right' },
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [51, 65, 85],
      overflow: 'linebreak',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
      const currentPage = data.pageNumber
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Página ${currentPage} de ${totalPages} - Imperio Import R&C`,
        105,
        290,
        { align: 'center' }
      )
    },
  })

  // Download PDF
  const filename = `catalogo_imperio_import_${categoryName.toLowerCase().replace(/\s+/g, '_')}_${now.toISOString().slice(0,10)}.pdf`
  doc.save(filename)
}

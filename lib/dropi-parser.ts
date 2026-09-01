export interface DropiOrder {
  id: string
  ordenDropshipper: string
  fechaReporte: string
  fecha: string
  hora: string
  cliente: string
  telefono: string
  email: string
  numeroGuia: string
  estatus: string
  tipoEnvio: string
  departamento: string
  ciudad: string
  direccion: string
  notas: string
  transportadora: string
  totalOrden: number
  ganancia: number
  precioFlete: number
  precioProveedor: number
  sku: string
  producto: string
  cantidad: number
}

export function parseDropiCSV(csvText: string): DropiOrder[] {
  if (!csvText || !csvText.trim()) return []

  const lines = parseCSVLines(csvText)
  if (lines.length < 2) return []

  // Clean headers
  const headers = lines[0].map(h => h.trim().toUpperCase().replace(/^"|"$/g, ''))

  const getColIdx = (name: string) => headers.indexOf(name.toUpperCase())

  const idxGuia = getColIdx('NÚMERO GUIA') !== -1 ? getColIdx('NÚMERO GUIA') : getColIdx('NUMERO GUIA')
  const idxTransportadora = getColIdx('TRANSPORTADORA')
  const idxCliente = getColIdx('NOMBRE CLIENTE')
  const idxTelefono = getColIdx('TELÉFONO') !== -1 ? getColIdx('TELÉFONO') : getColIdx('TELEFONO')
  const idxCiudad = getColIdx('CIUDAD DESTINO')
  const idxDepartamento = getColIdx('DEPARTAMENTO DESTINO')
  const idxDireccion = getColIdx('DIRECCION')
  const idxProducto = getColIdx('PRODUCTO')
  const idxSku = getColIdx('SKU')
  const idxCantidad = getColIdx('CANTIDAD')
  const idxTotal = getColIdx('TOTAL DE LA ORDEN')
  const idxEstatus = getColIdx('ESTATUS')
  const idxFecha = getColIdx('FECHA')
  const idxHora = getColIdx('HORA')
  const idxNotas = getColIdx('NOTAS')
  const idxId = getColIdx('ID')

  const orders: DropiOrder[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
    if (!row || row.length === 0 || (row.length === 1 && !row[0].trim())) continue

    const getValue = (idx: number) => (idx !== -1 && row[idx]) ? row[idx].trim().replace(/^"|"$/g, '') : ''

    const parseNum = (val: string) => {
      if (!val) return 0
      const cleaned = val.replace(/\./g, '').replace(',', '.')
      const n = parseFloat(cleaned)
      return isNaN(n) ? 0 : n
    }

    const numeroGuia = getValue(idxGuia)
    const transportadora = getValue(idxTransportadora) || 'SIN ESPECIFICAR'
    const producto = getValue(idxProducto)

    if (!numeroGuia && !producto) continue // skip invalid rows

    orders.push({
      id: getValue(idxId) || `${i}`,
      ordenDropshipper: getValue(getColIdx('ORDEN DE DROPSHIPPER')),
      fechaReporte: getValue(getColIdx('FECHA DE REPORTE')),
      fecha: getValue(idxFecha),
      hora: getValue(idxHora),
      cliente: getValue(idxCliente) || 'Cliente Dropi',
      telefono: getValue(idxTelefono),
      email: getValue(getColIdx('EMAIL')),
      numeroGuia: numeroGuia || `S/G-${i}`,
      estatus: getValue(idxEstatus) || 'PENDIENTE',
      tipoEnvio: getValue(getColIdx('TIPO DE ENVIO')),
      departamento: getValue(idxDepartamento),
      ciudad: getValue(idxCiudad),
      direccion: getValue(idxDireccion),
      notas: getValue(idxNotas),
      transportadora: transportadora.toUpperCase(),
      totalOrden: parseNum(getValue(idxTotal)),
      ganancia: parseNum(getValue(getColIdx('GANANCIA'))),
      precioFlete: parseNum(getValue(getColIdx('PRECIO FLETE'))),
      precioProveedor: parseNum(getValue(getColIdx('PRECIO PROVEEDOR'))),
      sku: getValue(idxSku),
      producto: producto || 'Producto Varios',
      cantidad: parseInt(getValue(idxCantidad)) || 1,
    })
  }

  return orders
}

// Simple CSV parser handling quotes and commas
function parseCSVLines(text: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let entry = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        entry += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if ((char === ',' || char === ';') && !inQuotes) {
      row.push(entry)
      entry = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++
      }
      row.push(entry)
      result.push(row)
      row = []
      entry = ''
    } else {
      entry += char
    }
  }

  if (entry || row.length > 0) {
    row.push(entry)
    result.push(row)
  }

  return result
}

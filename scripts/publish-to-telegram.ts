import fs from 'fs'
import path from 'path'

// Helper to load .env or .env.local file if present
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env')
  ]

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      content.split('\n').forEach((line) => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=')
          const val = values.join('=').trim().replace(/^["']|["']$/g, '')
          if (key.trim() && !process.env[key.trim()]) {
            process.env[key.trim()] = val
          }
        }
      })
    }
  }
}

loadEnv()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://import-ryc.vercel.app'
const PHONE = '593959883921'

interface Product {
  id: number
  sku: string
  name: string
  slug: string
  description: string
  price: number
  priceSuggested: number
  categories: string[]
  approved: boolean
  inBodega: string | null
  images: string[]
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

function formatTelegramCaption(product: Product): string {
  const hasDiscount = product.priceSuggested > product.price && product.priceSuggested > 0
  const plainDesc = stripHtml(product.description || '')
  
  // Truncate description to fit Telegram 1024 char caption limit
  const maxDescLength = 350
  const truncatedDesc = plainDesc.length > maxDescLength 
    ? plainDesc.substring(0, maxDescLength) + '...' 
    : plainDesc

  const categoriesText = product.categories.join(', ')

  let caption = `🔥 <b>${product.name.toUpperCase()}</b>\n\n`
  caption += `💰 <b>Precio:</b> $${product.price.toFixed(2)}`
  if (hasDiscount) {
    caption += ` <s>$${product.priceSuggested.toFixed(2)}</s>`
  }
  caption += `\n`

  if (product.inBodega) {
    caption += `📦 <b>Bodega:</b> ${product.inBodega}\n`
  }

  if (categoriesText) {
    caption += `🏷️ <b>Categoría:</b> ${categoriesText}\n`
  }

  if (truncatedDesc) {
    caption += `\n📝 ${truncatedDesc}\n`
  }

  return caption
}

async function sendTelegramProduct(product: Product, isDryRun = false) {
  const caption = formatTelegramCaption(product)
  const productUrl = `${DOMAIN}/producto/${product.slug}`
  const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(`Hola, me interesa comprar: ${product.name} ($${product.price.toFixed(2)})`)}`

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🛒 Ver en la Web', url: productUrl },
        { text: '📱 Pedir por WhatsApp', url: whatsappUrl }
      ]
    ]
  }

  const imageUrl = product.images[0] || null

  if (isDryRun) {
    console.log('\n--- [DRY RUN] PUBLICACIÓN SIMULADA ---')
    console.log(`Producto ID: ${product.id}`)
    console.log(`Imagen URL: ${imageUrl}`)
    console.log(`Caption:\n${caption}`)
    console.log(`Botones:\n${JSON.stringify(inlineKeyboard, null, 2)}`)
    console.log('-------------------------------------\n')
    return { ok: true, result: 'dry_run' }
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error('TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no están configurados en .env')
  }

  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`

  const payload = {
    chat_id: CHAT_ID,
    photo: imageUrl,
    caption: caption,
    parse_mode: 'HTML',
    reply_markup: inlineKeyboard
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const result = await response.json()

  if (!result.ok) {
    console.error(`❌ Error publicando producto ID ${product.id}:`, result.description)
  } else {
    console.log(`✅ Producto ID ${product.id} ("${product.name}") publicado con éxito.`)
  }

  return result
}

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const isAll = args.includes('--all')
  const idArg = args.find((a) => a.startsWith('--id='))
  const limitArg = args.find((a) => a.startsWith('--limit='))

  const productId = idArg ? parseInt(idArg.split('=')[1], 10) : null
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null

  const dataPath = path.join(process.cwd(), 'data', 'productos.json')
  const rawData = fs.readFileSync(dataPath, 'utf8')
  const products: Product[] = JSON.parse(rawData).filter((p: Product) => p.approved)

  console.log(`📦 Se encontraron ${products.length} productos aprobados.`)

  if (productId) {
    const target = products.find((p) => p.id === productId)
    if (!target) {
      console.error(`❌ No se encontró ningún producto con ID ${productId}`)
      process.exit(1)
    }
    await sendTelegramProduct(target, isDryRun)
  } else if (isAll || limit) {
    const listToPublish = limit ? products.slice(0, limit) : products
    console.log(`🚀 Publicando ${listToPublish.length} productos a Telegram...`)

    for (let i = 0; i < listToPublish.length; i++) {
      const product = listToPublish[i]
      console.log(`[${i + 1}/${listToPublish.length}] Publicando: ${product.name}...`)
      try {
        await sendTelegramProduct(product, isDryRun)
      } catch (err: any) {
        console.error(`❌ Error al publicar producto ${product.id}:`, err.message)
      }

      // Pause 2 seconds between posts to respect Telegram API rate limits
      if (i < listToPublish.length - 1 && !isDryRun) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  } else {
    // Default mode: Dry run preview of 1 product
    console.log('\n💡 Modo de vista previa (Dry Run). Para enviar a Telegram real pasa tus tokens en .env y ejecuta con --all o --limit=X.\n')
    await sendTelegramProduct(products[0], true)
  }
}

main().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import type { Product } from '@/lib/types'

const dataFilePath = path.join(process.cwd(), 'data', 'productos.json')

async function readProductsFromFile(): Promise<Product[]> {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8')
    return JSON.parse(fileData) as Product[]
  } catch (error) {
    console.error('Error reading productos.json:', error)
    return []
  }
}

async function writeProductsToFile(products: Product[]): Promise<boolean> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing productos.json:', error)
    return false
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET() {
  try {
    const products = await readProductsFromFile()
    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error al obtener productos.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      sku,
      name,
      slug: customSlug,
      type,
      description,
      stock,
      price,
      priceSuggested,
      categories,
      approved,
      inBodega,
      hasImage,
      images,
      isDropi,
    } = body

    // Basic Validations
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'El nombre del producto es obligatorio.' },
        { status: 400 }
      )
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json(
        { success: false, message: 'El precio mayorista debe ser un número válido.' },
        { status: 400 }
      )
    }

    if (stock === undefined || stock === null || isNaN(Number(stock))) {
      return NextResponse.json(
        { success: false, message: 'El stock debe ser un número válido.' },
        { status: 400 }
      )
    }

    const products = await readProductsFromFile()

    // Generate unique ID
    const maxId = products.reduce((max, p) => (p.id && p.id > max ? p.id : max), 0)
    const newId = maxId + 1

    // SKU Generation if not provided
    const finalSku = (sku && typeof sku === 'string' && sku.trim())
      ? sku.trim().toUpperCase()
      : `IMP-${String(newId).padStart(4, '0')}`

    // Check SKU duplicate
    if (products.some(p => p.sku.toLowerCase() === finalSku.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `El SKU "${finalSku}" ya existe en el catálogo.` },
        { status: 400 }
      )
    }

    // Slug generation
    const finalSlug = (customSlug && typeof customSlug === 'string' && customSlug.trim())
      ? generateSlug(customSlug)
      : generateSlug(name)

    const cleanedImages = Array.isArray(images)
      ? images.filter((img: string) => typeof img === 'string' && img.trim() !== '')
      : []

    const newProduct: Product = {
      id: newId,
      sku: finalSku,
      name: name.trim(),
      slug: finalSlug,
      type: type || 'simple',
      description: description || '',
      stock: Number(stock),
      price: Number(price),
      priceSuggested: priceSuggested ? Number(priceSuggested) : Number(price),
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['General'],
      approved: approved !== undefined ? Boolean(approved) : true,
      inBodega: inBodega || null,
      hasImage: cleanedImages.length > 0 || Boolean(hasImage),
      images: cleanedImages,
      isDropi: Boolean(isDropi),
    }

    // Add new product at top of list
    products.unshift(newProduct)

    const saved = await writeProductsToFile(products)
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Error al guardar el producto en el servidor.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto creado exitosamente.',
      product: newProduct,
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/productos:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Error en el servidor al agregar producto.' },
      { status: 500 }
    )
  }
}

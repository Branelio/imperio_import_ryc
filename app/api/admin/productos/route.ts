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

    const maxId = products.reduce((max, p) => (p.id && p.id > max ? p.id : max), 0)
    const newId = maxId + 1

    const finalSku = (sku && typeof sku === 'string' && sku.trim())
      ? sku.trim().toUpperCase()
      : `IMP-${String(newId).padStart(4, '0')}`

    if (products.some(p => p.sku.toLowerCase() === finalSku.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `El SKU "${finalSku}" ya existe en el catálogo.` },
        { status: 400 }
      )
    }

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

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
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
      images,
      isDropi,
    } = body

    if (!id && !sku) {
      return NextResponse.json(
        { success: false, message: 'Se requiere el ID o SKU del producto a editar.' },
        { status: 400 }
      )
    }

    const products = await readProductsFromFile()
    const index = products.findIndex(p => p.id === Number(id) || (sku && p.sku.toLowerCase() === String(sku).toLowerCase()))

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado.' },
        { status: 404 }
      )
    }

    const targetProduct = products[index]

    if (name && typeof name === 'string' && name.trim()) {
      targetProduct.name = name.trim()
    }
    if (sku && typeof sku === 'string' && sku.trim()) {
      targetProduct.sku = sku.trim().toUpperCase()
    }
    if (customSlug && typeof customSlug === 'string' && customSlug.trim()) {
      targetProduct.slug = generateSlug(customSlug)
    } else if (name) {
      targetProduct.slug = generateSlug(name)
    }

    if (type) targetProduct.type = type
    if (description !== undefined) targetProduct.description = description
    if (stock !== undefined && !isNaN(Number(stock))) targetProduct.stock = Number(stock)
    if (price !== undefined && !isNaN(Number(price))) targetProduct.price = Number(price)
    if (priceSuggested !== undefined && !isNaN(Number(priceSuggested))) targetProduct.priceSuggested = Number(priceSuggested)
    if (Array.isArray(categories) && categories.length > 0) targetProduct.categories = categories
    if (approved !== undefined) targetProduct.approved = Boolean(approved)
    if (inBodega !== undefined) targetProduct.inBodega = inBodega || null
    if (isDropi !== undefined) targetProduct.isDropi = Boolean(isDropi)

    if (Array.isArray(images)) {
      const cleanedImages = images.filter((img: string) => typeof img === 'string' && img.trim() !== '')
      targetProduct.images = cleanedImages
      targetProduct.hasImage = cleanedImages.length > 0
    }

    products[index] = targetProduct

    const saved = await writeProductsToFile(products)
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Error al actualizar el producto en el servidor.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      product: targetProduct,
    })
  } catch (error: any) {
    console.error('Error in PUT /api/admin/productos:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Error al editar producto.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json(
        { success: false, message: 'ID de producto no especificado.' },
        { status: 400 }
      )
    }

    const targetId = Number(idParam)
    const products = await readProductsFromFile()
    const filtered = products.filter(p => p.id !== targetId)

    if (filtered.length === products.length) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado.' },
        { status: 404 }
      )
    }

    const saved = await writeProductsToFile(filtered)
    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'Error al eliminar el producto.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado correctamente.',
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/productos:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Error al eliminar el producto.' },
      { status: 500 }
    )
  }
}

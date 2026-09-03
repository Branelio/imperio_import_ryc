import { NextRequest, NextResponse } from 'next/server'
import { generateFacebookFeedXml } from '@/lib/facebook-feed'

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    const baseUrl = `${proto}://${host}`

    const xml = generateFacebookFeedXml(baseUrl)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating Facebook feed XML:', error)
    return new NextResponse('Error generating feed', { status: 500 })
  }
}

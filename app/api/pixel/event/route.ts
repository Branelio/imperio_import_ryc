import { NextRequest, NextResponse } from 'next/server'
import { sendMetaCapiEvent } from '@/lib/meta-capi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, eventSourceUrl, customData } = body

    if (!eventName) {
      return NextResponse.json({ success: false, message: 'eventName is required' }, { status: 400 })
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Send asynchronously to Meta Conversions API
    await sendMetaCapiEvent({
      eventName,
      eventSourceUrl: eventSourceUrl || request.headers.get('referer') || undefined,
      clientIp,
      userAgent,
      customData,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in /api/pixel/event route:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 })
  }
}

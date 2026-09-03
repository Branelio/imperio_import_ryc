const META_ACCESS_TOKEN = process.env.META_CAPI_TOKEN || 'EAAdZC2qdEpakBSfDGSficd9ZAdclz8TZAhbMw23cOm4B0x5f0VNZC5s5StCBQOB7nZBcwZAvqWZA2XtoPfPK4cHl6XY6FIwrBDPwTOFXpERT6ZAWJDTLSDS5qugpBds9YgZBExtZAk3ZADUdkNpOKq4TPwEoZComJClfCfYaQwCXqhrnLZCxHiFrTG3tFisnTdp878QZDZD'
const PIXEL_IDS = ['1406230474804893', '1138329888548484']

export interface CapiEventPayload {
  eventName: string
  eventSourceUrl?: string
  clientIp?: string
  userAgent?: string
  customData?: Record<string, any>
}

export async function sendMetaCapiEvent(payload: CapiEventPayload) {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000)

    const eventData = {
      event_name: payload.eventName,
      event_time: currentTimestamp,
      action_source: 'website',
      event_source_url: payload.eventSourceUrl || 'https://imperio-import-ryc.vercel.app',
      user_data: {
        client_ip_address: payload.clientIp || undefined,
        client_user_agent: payload.userAgent || undefined,
      },
      custom_data: payload.customData || undefined,
    }

    const promises = PIXEL_IDS.map(async (pixelId) => {
      const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${META_ACCESS_TOKEN}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
        }),
      })

      const resJson = await response.json()
      if (!response.ok) {
        console.error(`Meta CAPI error for Pixel ${pixelId}:`, resJson)
      }
      return resJson
    })

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Error sending Meta CAPI event:', error)
  }
}

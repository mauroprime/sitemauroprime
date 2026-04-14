'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Componente para inicializar o Facebook Pixel e rastrear PageViews em cada mudança de rota.
 */
export function FBPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Dev Mode] Facebook Pixel Inicialização ignorada.')
      return
    }

    const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

    if (!PIXEL_ID) return

    // Previne múltiplas inicializações
    if (!(window as any).fbq) {
      /* eslint-disable */
      // @ts-ignore
      !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window as any, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      /* eslint-enable */
      
      // @ts-ignore
      window.fbq('init', PIXEL_ID)
    }

    // Dispara PageView em cada mudança de rota
    // @ts-ignore
    window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

/**
 * Helper para disparar eventos Customizados/Standard no lado do cliente
 */
export function firePixelEvent(eventName: string, data?: object, eventID?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dev Mode] Evento Pixel Simulado: ${eventName}`, { data, eventID })
    return
  }

  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (eventID) {
      (window as any).fbq('track', eventName, data, { eventID })
    } else {
      (window as any).fbq('track', eventName, data)
    }
  }
}

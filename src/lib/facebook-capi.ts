/**
 * Utilitário para integração com a API de Conversões (CAPI) do Facebook.
 * Isso permite que enviemos eventos de conversão diretamente do servidor,
 * contornando bloqueadores de anúncios e limitações de navegadores (iOS 14+).
 */

export type FBCapiEvent = {
  event_name: 'Lead' | 'Contact' | 'PageView' | 'ViewContent' | 'InitiateCheckout';
  event_time?: number; // Unix timestamp em segundos
  event_source_url?: string;
  user_data: {
    em?: string[]; // Email (hashed SHA256)
    ph?: string[]; // Telefone (hashed SHA256)
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    timeframe?: string;
    [key: string]: any;
  };
};

/**
 * Função para gerar hash SHA256 (necessário para dados PII do Facebook CAPI)
 */
async function hash(data: string) {
  if (!data) return '';
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Envia um evento para a API de Conversões do Facebook
 */
export async function sendFBCapiEvent(event: FBCapiEvent) {
  const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Facebook Pixel ID ou Access Token ausentes. Evento CAPI ignorado.');
    return;
  }

  // Prepara os dados do evento
  const payload = {
    data: [
      {
        ...event,
        event_time: event.event_time || Math.floor(Date.now() / 1000),
        action_source: 'website',
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    
    if (result.error) {
      console.error('Erro na Facebook CAPI:', result.error);
    } else {
      console.log(`Evento CAPI [${event.event_name}] enviado com sucesso.`);
    }

    return result;
  } catch (error) {
    console.error('Falha ao enviar evento para Facebook CAPI:', error);
  }
}

/**
 * Helper para normalizar e hashear dados de usuário antes de enviar
 */
export async function prepareUserData(email?: string, phone?: string) {
  const em = email ? [await hash(email)] : undefined;
  const ph = phone ? [await hash(phone.replace(/\D/g, ''))] : undefined;
  return { em, ph };
}

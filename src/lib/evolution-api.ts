const EVO_BASE = process.env.EVOLUTION_API_URL || 'https://evoapi.agenciacaen.com.br'
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || 'mauroprime'
const EVO_API_KEY = process.env.EVOLUTION_API_KEY || 'B1B62A733EEF-4D95-B2DE-6AB941BC7D80'

export async function sendLeadToWhatsApp(lead: {
  name: string
  email: string
  phone: string | null
  intent: string | null
  project_type: string | null
  investment_range: string | null
  timeframe: string | null
  has_land: boolean
  message: string | null
  related_project?: string | null
}) {
  const notificationNumber = process.env.WHATSAPP_NOTIFICATION_NUMBER || '554195907430'

  const hasLand = lead.has_land ? 'Sim' : 'Não'

  const text = `
🔔 *Novo Lead - Construtora Prime*

*Nome:* ${lead.name}
*Email:* ${lead.email}
*Telefone:* ${lead.phone || '—'}
*Intenção:* ${lead.intent || '—'}
*Tipo do Projeto:* ${lead.project_type || '—'}
*Faixa de Investimento:* ${lead.investment_range || '—'}
*Prazo:* ${lead.timeframe || '—'}
*Possui Terreno:* ${hasLand}
${lead.related_project ? `*Projeto de Interesse:* ${lead.related_project}` : ''}
${lead.message ? `*Mensagem:* ${lead.message}` : ''}

📍 *Fonte:* ${lead.intent ? `Busca Hero (${lead.intent})` : 'Formulário do Site'}
  `.trim()

  try {
    const response = await fetch(`${EVO_BASE}/message/sendText/${EVO_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVO_API_KEY,
      },
      body: JSON.stringify({
        number: notificationNumber,
        text,
        delay: 1200,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[Evolution API] Erro ao enviar mensagem:', err)
    }
  } catch (err) {
    console.error('[Evolution API] Falha na requisição:', err)
  }
}

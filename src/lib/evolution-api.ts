const EVO_BASE = process.env.EVOLUTION_API_URL || 'https://evoapi.agenciacaen.com.br'
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || 'mauroprime'
const EVO_API_KEY = process.env.EVOLUTION_API_KEY || 'B1B62A733EEF-4D95-B2DE-6AB941BC7D80'

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return null
  if (digits.length === 10) return `55${digits}`
  if (digits.length === 11) return `55${digits}`
  if (digits.startsWith('55')) return digits
  return `55${digits}`
}

export async function sendLeadToWhatsApp(lead: {
  name: string
  phone: string | null
  intent: string | null
  project_type: string | null
  investment_range: string | null
  timeframe: string | null
  has_land: boolean
}) {
  if (!lead.phone) return

  const leadNumber = normalizePhone(lead.phone)
  if (!leadNumber) return

  const hasLand = lead.has_land ? 'Sim' : 'Não'

  const text = `Olá ${lead.name}, tudo bem? Aqui é o Mauro Consultor da Construtora Prime. Recebi seu contato aqui!

Nome: ${lead.name}
Telefone: ${lead.phone}
Possui terreno: ${hasLand}
Faixa de investimento: ${lead.investment_range || '—'}
Prazo estimado: ${lead.timeframe || '—'}

Para agilizar seu atendimento você confirma essas respostas?`

  try {
    const response = await fetch(`${EVO_BASE}/message/sendText/${EVO_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVO_API_KEY,
      },
      body: JSON.stringify({
        number: leadNumber,
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

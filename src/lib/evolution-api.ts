const EVO_BASE = process.env.EVOLUTION_API_URL || 'https://evoapi.agenciacaen.com.br'
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || 'mauroprime'
const EVO_INSTANCE_KEY = process.env.EVOLUTION_API_KEY || 'B1B62A733EEF-4D95-B2DE-6AB941BC7D80'
const EVO_GLOBAL_KEY = process.env.EVOLUTION_GLOBAL_API_KEY || '39da3d9864a9b02f6f469325b4a574d9'

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return null
  if (digits.length === 10) return `55${digits}`
  if (digits.length === 11) return `55${digits}`
  if (digits.startsWith('55')) return digits
  return `55${digits}`
}

async function sendRequest(number: string, text: string): Promise<boolean> {
  // Tenta com a chave global (Authorization Bearer)
  if (EVO_GLOBAL_KEY) {
    const res = await fetch(`${EVO_BASE}/message/sendText/${EVO_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EVO_GLOBAL_KEY}`,
      },
      body: JSON.stringify({ number, text, delay: 1200 }),
    })
    if (res.ok) return true
    console.error('[Evolution API] Global key falhou:', res.status, await res.text().catch(() => ''))
  }

  // Tenta com a chave da instância (apikey)
  const res = await fetch(`${EVO_BASE}/message/sendText/${EVO_INSTANCE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVO_INSTANCE_KEY,
    },
    body: JSON.stringify({ number, text, delay: 1200 }),
  })
  if (res.ok) return true
  console.error('[Evolution API] Instance key falhou:', res.status, await res.text().catch(() => ''))
  return false
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

  await sendRequest(leadNumber, text)
}

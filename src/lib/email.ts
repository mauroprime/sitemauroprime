import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Email] SMTP não configurado. Configure SMTP_HOST, SMTP_USER e SMTP_PASS.')
    }
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return transporter
}

export async function sendLeadEmail(lead: {
  name: string
  email: string
  phone: string | null
  message: string | null
  intent: string | null
  location: string | null
  project_type: string | null
  investment_range: string | null
  timeframe: string | null
  has_land: boolean
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  related_project?: string | null
}) {
  const t = getTransporter()
  if (!t) return

  const to = process.env.NOTIFICATION_EMAIL
  if (!to) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Email] NOTIFICATION_EMAIL não configurado.')
    }
    return
  }

  const hasLand = lead.has_land ? 'Sim' : 'Não'

  const html = `
    <h2 style="color:#d4af37;">Novo Lead Recebido</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
      ${renderRow('Nome', lead.name)}
      ${renderRow('Email', lead.email)}
      ${renderRow('Telefone', lead.phone || '—')}
      ${renderRow('Intenção', lead.intent || '—')}
      ${renderRow('Possui Terreno', hasLand)}
      ${renderRow('Tipo do Projeto', lead.project_type || '—')}
      ${renderRow('Investimento', lead.investment_range || '—')}
      ${renderRow('Prazo', lead.timeframe || '—')}
      ${renderRow('Mensagem', lead.message || '—')}
      ${renderRow('Projeto de Interesse', lead.related_project || '—')}
      ${renderRow('Origem', lead.source || '—')}
      ${renderRow('UTM Source', lead.utm_source || '—')}
      ${renderRow('UTM Medium', lead.utm_medium || '—')}
      ${renderRow('UTM Campaign', lead.utm_campaign || '—')}
    </table>
    <hr>
    <p style="color:#888;font-size:12px;">Este email foi enviado automaticamente pelo site.</p>
  `.trim()

  try {
    await t.sendMail({
      from: `"Site Mauro" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: `Novo Lead: ${lead.name} - ${lead.intent || 'Contato'} - ${lead.project_type || ''}`.trim(),
      html,
    })
  } catch (err) {
    console.error('[Email] Falha ao enviar notificação:', err)
  }
}

function renderRow(label: string, value: string): string {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#333;white-space:nowrap;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555;">${value}</td></tr>`
}

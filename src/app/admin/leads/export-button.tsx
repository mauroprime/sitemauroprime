'use client'

import { Download } from 'lucide-react'

export function ExportLeadsButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
    >
      <Download size={16} />
      Exportar CSV
    </a>
  )
}

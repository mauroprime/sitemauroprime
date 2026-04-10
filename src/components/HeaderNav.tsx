'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const links = [
    { name: 'Início', href: '/' },
    { name: 'Projetos', href: '/projetos' },
    { name: 'Depoimentos', href: '/#depoimentos' },
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Contato', href: '/#contato' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href === '/projetos') {
      return pathname.startsWith('/projetos')
    }
    if (href.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname === href
  }

  return (
    <div className="ml-10 flex items-baseline space-x-8">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`${
            isActive(link.href) 
              ? 'text-white' 
              : 'text-zinc-400'
          } hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  )
}

'use client'

import React from 'react'
import { firePixelEvent } from './FBPixel'
import { cn } from '@/lib/utils'

interface TrackEventButtonProps {
  eventName: 'Contact' | 'InitiateCheckout' | 'Lead' | 'ViewContent';
  eventData?: object;
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

/**
 * Um wrapper para links que precisam disparar eventos do Pixel no clique.
 */
export function TrackEventButton({ 
  eventName, 
  eventData, 
  href, 
  children, 
  className,
  target,
  rel
}: TrackEventButtonProps) {
  
  const handleClick = () => {
    firePixelEvent(eventName, eventData)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`FBPixel: Evento [${eventName}] disparado via clique`, eventData)
    }
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={cn(className)}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  )
}

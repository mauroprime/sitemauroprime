'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  images: string[]
  aspectRatio?: string
  className?: string
  showArrows?: boolean
  objectFit?: 'cover' | 'contain'
}

export function ImageCarousel({ 
  images, 
  aspectRatio = "aspect-[4/3]",
  className,
  showArrows = true,
  objectFit = 'cover'
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={cn("bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm", aspectRatio, className)}>
        Sem imagem
      </div>
    )
  }

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setDirection(1)
    setIndex((prev) => (prev + 1) % images.length)
  }

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setDirection(-1)
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  }

  return (
    <div className={cn("relative overflow-hidden group", aspectRatio, className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            className={cn(
              objectFit === 'cover' ? 'object-cover' : 'object-contain',
              "transition-all duration-500"
            )}
            sizes="100vw"
            quality={95}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navegação se houver mais de uma imagem */}
      {images.length > 1 && showArrows && (
        <>
          <button
            onClick={prevStep}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextStep}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
            aria-label="Próximo"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores (Pontinhos) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1.5 rounded-full bg-black/10 backdrop-blur-sm">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === i ? "bg-white scale-125" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

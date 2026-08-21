'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 560)
    update(); window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <AnimatePresence>{visible && <motion.button initial={{ opacity: 0, y: 12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .9 }} transition={{ duration: .25 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-background/80 shadow-xl backdrop-blur-xl transition hover:border-primary/50 hover:text-primary" aria-label="Scroll to top"><ArrowUp className="size-4" /></motion.button>}</AnimatePresence>
}

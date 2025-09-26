"use client"

import { useTheme } from 'next-themes'
import { LineShadowText } from '@/components/ui/line-shadow-text'

export default function HeroClient() {
  const theme = useTheme()
  const shadowColor = theme.resolvedTheme === 'dark' ? 'white' : 'black'
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        Hey I'm{' '}
        <LineShadowText className="italic" shadowColor={shadowColor}>
          Rafi Ferdos
        </LineShadowText>
      </h1>
    </div>
  )
}

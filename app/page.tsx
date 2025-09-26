import Hero from '@/components/Home/Hero/Hero'
import { SmoothCursor } from '@/components/ui/smooth-cursor'

export default function Home() {
  return (
    <div className='min-h-screen p-5 max-w-7xl mx-auto w-11/12'>
      <Hero />
      <SmoothCursor />
    </div>
  )
}

import Hero from '@/components/Home/Hero/Hero'
import { SmoothCursor } from '@/components/ui/smooth-cursor'

const metadata = {
  title: 'Rafi Ferdos | Portfolio',
  description: 'Rafi Ferdos - A MERN Stack Developer specializing in building dynamic and responsive web applications. Explore my portfolio to see my projects and skills in action. Technologies including NextJS, React, Node.js, Express, and MongoDB.',
}

export default function Home() {
  return (
    <div className="min-h-screen p-5 max-w-7xl mx-auto w-11/12">
      <Hero />
      <SmoothCursor />
    </div>
  )
}

'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface GsapTextProps {
    children: string
    className?: string
    delay?: number
    speed?: number
    stagger?: number
}

export function GsapText({
    children,
    className,
    delay = 0,
    speed = 1,
    stagger = 0.1
}: GsapTextProps) {
    const container = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const chars = container.current?.querySelectorAll('.char')
            if (!chars) return

            gsap.fromTo(
                chars,
                {
                    yPercent: 130,
                    opacity: 0,
                    rotateX: -90,
                    scale: 0.3,
                    transformOrigin: '50% 0%',
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    rotateX: 0,
                    scale: 1,
                    duration: 1.2 / speed,
                    stagger: stagger,
                    ease: 'back.out(2)', // Signature GSAP "pop"
                    delay: delay,
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reset'
                    }
                }
            )
        },
        { scope: container }
    )

    // Split text into words and chars manually
    const words = children.split(' ')

    return (
        <div ref={container} className={className} style={{ overflow: 'visible' }}>
            {words.map((word, i) => (
                <div
                    key={i}
                    className="inline-block overflow-hidden"
                    style={{
                        marginRight: '0.25em',
                        perspective: '500px', // Crucial for 3D flip effect
                        overflow: 'hidden',
                        verticalAlign: 'bottom' // Fix alignment
                    }}
                >
                    {word.split('').map((char, j) => (
                        <span
                            key={j}
                            className="char inline-block will-change-transform" // Hardware acceleration
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

interface GsapRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
    speed?: number
}

export function GsapReveal({
    children,
    className,
    delay = 0,
    speed = 1,
}: GsapRevealProps) {
    const container = useRef<HTMLSpanElement>(null)
    const element = useRef<HTMLSpanElement>(null)

    useGSAP(
        () => {
            if (!container.current || !element.current) return

            gsap.fromTo(
                element.current,
                {
                    yPercent: 130,
                    autoAlpha: 0,
                    rotateX: -90,
                    rotation: -10, // Add slight tumble
                    scale: 0.3,
                    transformOrigin: '50% 0%',
                },
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    rotateX: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 1.2 / speed,
                    ease: 'back.out(2)',
                    delay: delay,
                    scrollTrigger: {
                        trigger: container.current,
                        start: 'top 85%', // Fire a bit earlier to ensure visibility
                        toggleActions: 'restart none none reset' // Force restart every time
                    }
                }
            )
        },
        { scope: container }
    )

    return (
        <span
            ref={container}
            className={className}
            style={{
                perspective: '500px',
                overflow: 'visible',
                display: 'inline-block'
            }}
        >
            <span
                ref={element}
                className="will-change-transform"
                style={{
                    transformStyle: 'preserve-3d',
                    display: 'inline-block',
                    opacity: 0 // Start hidden, let GSAP autoAlpha reveal it
                }}
            >
                {children}
            </span>
        </span>
    )
}

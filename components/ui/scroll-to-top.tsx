'use client'

import { useEffect, useRef } from 'react'
import IconCircleArrowUp from '@/components/icons/ArrowUp'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

export function ScrollToTop() {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const isVisible = useRef(false)

    useEffect(() => {
        gsap.registerPlugin(ScrollToPlugin)
        const context = gsap.context(() => {
            // Initial state
            gsap.set(buttonRef.current, { y: 20, opacity: 0, display: 'none' })
        }, buttonRef)

        const handleScroll = () => {
            const shouldShow = window.scrollY > 300

            if (shouldShow && !isVisible.current) {
                isVisible.current = true
                gsap.to(buttonRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    display: 'block',
                    overwrite: true
                })
            } else if (!shouldShow && isVisible.current) {
                isVisible.current = false
                gsap.to(buttonRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                    display: 'none',
                    overwrite: true
                })
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            context.revert()
        }
    }, [])

    const scrollToTop = () => {
        gsap.to(window, {
            scrollTo: { y: 0, autoKill: false },
            duration: 1.5,
            ease: 'power4.inOut'
        })
    }

    return (
        <button
            ref={buttonRef}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 hidden opacity-0 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg transition-all duration-300"
            aria-label="Scroll to top"
        >
            <IconCircleArrowUp
                size="48"
                style={{
                    // @ts-ignore
                    '--nc-gradient-1-color-1': 'transparent',
                    // @ts-ignore
                    '--nc-gradient-1-color-2': 'transparent',
                }}
            />
        </button>
    )
}

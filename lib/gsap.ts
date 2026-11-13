import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase)

// Opt-in for the scroll QA scripts (sessionStorage 'st-debug'): they read ScrollTrigger.getAll().length to look for leaked triggers.
if (typeof window !== 'undefined' && window.sessionStorage?.getItem('st-debug')) Object.assign(window, { __ST: ScrollTrigger })

CustomEase.create('out', '.16,1,.3,1')
CustomEase.create('inOut', '.76,0,.24,1')

export const duration = { micro: 0.25, hover: 0.45, ui: 0.7, display: 1.1 } as const
export const stagger = { chars: 0.035, words: 0.05, lines: 0.08 } as const

export { gsap, ScrollTrigger, SplitText, useGSAP }

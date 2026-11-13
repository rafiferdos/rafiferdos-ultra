import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { gsap } from '@/lib/gsap'

// Registered here, not in lib/gsap.ts, so only the route that drags (the home gallery) ships these two plugins.
gsap.registerPlugin(Draggable, InertiaPlugin)

export { Draggable }

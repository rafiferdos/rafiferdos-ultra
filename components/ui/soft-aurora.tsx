'use client'

import { cn } from '@/lib/utils'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'

type SoftAuroraProps = {
  className?: string
  speed?: number
  scale?: number
  brightness?: number
  color1?: string
  color2?: string
  enableMouseInteraction?: boolean
  mouseInfluence?: number
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }
`

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;
#define TAU 6.28318

vec3 gradientHash(vec3 p) {
  p = vec3(dot(p, vec3(127.1,311.7,234.6)), dot(p, vec3(269.5,183.3,198.3)), dot(p, vec3(169.5,283.3,156.9)));
  vec3 h = fract(sin(p) * 43758.5453123);
  float phi = acos(2.0 * h.x - 1.0);
  float theta = TAU * h.y;
  return vec3(cos(theta) * sin(phi), sin(theta) * cos(phi), cos(phi));
}
float smooth5(float t) { float t2=t*t; float t3=t*t2; return 6.0*t3*t2-15.0*t2*t2+10.0*t3; }
float perlin3D(float amp, float freq, float px, float py, float pz) {
  float x=px*freq; float y=py*freq; float fx=floor(x); float fy=floor(y); float fz=floor(pz);
  float cx=ceil(x); float cy=ceil(y); float cz=ceil(pz);
  vec3 g000=gradientHash(vec3(fx,fy,fz)); vec3 g100=gradientHash(vec3(cx,fy,fz));
  vec3 g010=gradientHash(vec3(fx,cy,fz)); vec3 g110=gradientHash(vec3(cx,cy,fz));
  vec3 g001=gradientHash(vec3(fx,fy,cz)); vec3 g101=gradientHash(vec3(cx,fy,cz));
  vec3 g011=gradientHash(vec3(fx,cy,cz)); vec3 g111=gradientHash(vec3(cx,cy,cz));
  float sx=smooth5(x-fx); float sy=smooth5(y-fy); float sz=smooth5(pz-fz);
  float lx00=mix(dot(g000,vec3(x-fx,y-fy,pz-fz)),dot(g100,vec3(x-cx,y-fy,pz-fz)),sx);
  float lx10=mix(dot(g010,vec3(x-fx,y-cy,pz-fz)),dot(g110,vec3(x-cx,y-cy,pz-fz)),sx);
  float lx01=mix(dot(g001,vec3(x-fx,y-fy,pz-cz)),dot(g101,vec3(x-cx,y-fy,pz-cz)),sx);
  float lx11=mix(dot(g011,vec3(x-fx,y-cy,pz-cz)),dot(g111,vec3(x-cx,y-cy,pz-cz)),sx);
  return amp * mix(mix(lx00,lx10,sy),mix(lx01,lx11,sy),sz);
}
float glow(float t, vec2 shift, float offset) {
  vec2 uv=gl_FragCoord.xy/uResolution.y + shift; float noise=0.0; float freq=2.5; float amp=1.0;
  for(float i=0.0;i<3.0;i+=1.0){ noise += perlin3D(amp,freq,uv.x*uScale,uv.y*uScale,t+offset); amp*=0.1; freq*=2.0; }
  float band=uv.y*10.0-5.0; return 0.3*max(exp(1.0*(1.0-1.1*abs(noise+band))),0.0);
}
void main() {
  vec2 uv=gl_FragCoord.xy/uResolution.xy; vec2 shift=vec2(0.0);
  if(uEnableMouse) shift=(uMouse-0.5)*uMouseInfluence;
  float t=uSpeed*0.4*uTime;
  vec3 wave1=(0.5+0.5*cos(TAU*(uv.x+uTime*uSpeed*0.2+vec3(.3,.2,.2))))*uColor1;
  vec3 wave2=(0.5+0.5*cos(TAU*(vec3(2.,1.,0.)*uv.x+uTime*uSpeed*0.1+vec3(.5,.2,.25))))*uColor2;
  vec3 col=(.99*glow(t,shift,0.0)*wave1+.99*glow(t,shift,.7)*wave2)*uBrightness;
  gl_FragColor=vec4(col,clamp(length(col),0.0,1.0));
}
`

function hexToVec3(hex: string) {
  const value = hex.replace('#', '')
  return [0, 2, 4].map(
    (index) => parseInt(value.slice(index, index + 2), 16) / 255
  )
}

export function SoftAurora({
  className,
  speed = 0.45,
  scale = 1.5,
  brightness = 1,
  color1 = '#f59e0b',
  color2 = '#8b5cf6',
  enableMouseInteraction = true,
  mouseInfluence = 0.2
}: SoftAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    let currentMouse = [0.5, 0.5]
    let targetMouse = [0.5, 0.5]
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uBrightness: { value: brightness },
        uColor1: { value: hexToVec3(color1) },
        uColor2: { value: hexToVec3(color2) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: mouseInfluence },
        uEnableMouse: { value: enableMouseInteraction }
      }
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      ]
    }
    const move = (event: MouseEvent) => {
      const rect = gl.canvas.getBoundingClientRect()
      targetMouse = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height
      ]
    }
    const leave = () => {
      targetMouse = [0.5, 0.5]
    }
    let frame = 0
    let visible = true
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    const update = (time: number) => {
      frame = requestAnimationFrame(update)
      if (!visible) return
      program.uniforms.uTime.value = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
        ? 0
        : time * 0.001
      currentMouse = currentMouse.map(
        (value, index) => value + 0.05 * (targetMouse[index] - value)
      )
      program.uniforms.uMouse.value.set(currentMouse)
      renderer.render({ scene: mesh })
    }
    container.appendChild(gl.canvas)
    gl.canvas.className = 'size-full'
    resize()
    observer.observe(container)
    window.addEventListener('resize', resize)
    if (enableMouseInteraction) {
      gl.canvas.addEventListener('mousemove', move)
      gl.canvas.addEventListener('mouseleave', leave)
    }
    frame = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      gl.canvas.removeEventListener('mousemove', move)
      gl.canvas.removeEventListener('mouseleave', leave)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [
    brightness,
    color1,
    color2,
    enableMouseInteraction,
    mouseInfluence,
    scale,
    speed
  ])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('size-full', className)}
    />
  )
}

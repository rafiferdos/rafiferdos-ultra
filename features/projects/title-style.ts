// Shared by the project page and the click-through overlay, so the two titles cannot drift apart.
export const titleClass = 'font-extrabold uppercase leading-[0.9] font-stretch-[75%]'
export const fitFallback = (title: string) => Math.max(2, title.length * 0.5)

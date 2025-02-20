import { fileURLToPath, URL } from 'node:url'

export const DIR_WORKS = fileURLToPath(new URL('../workers', import.meta.url))

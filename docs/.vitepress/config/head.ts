import { APP_DESCRIPTION, APP_TITLE, APP_URL } from '../meta'
import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/favicon.ico' }],
  ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ['meta', { name: 'theme-color', href: '#ffffff' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:title', content: APP_TITLE }],
  ['meta', { property: 'og:url', content: APP_URL }],
  ['meta', { property: 'og:description', content: APP_DESCRIPTION }],
  // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  // ['meta', { name: 'twitter:image', content: `${APP_URL}/og.png` }],
]

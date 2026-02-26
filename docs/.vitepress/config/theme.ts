import { version } from '../../../package.json'
import { REPOSITORY_SLUG } from '../meta'
import type { DefaultTheme } from 'vitepress'

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  {
    text: 'Release Notes',
    link: `https://github.com/${REPOSITORY_SLUG}/releases`,
  },
]

export function getThemeConfig() {
  const config: DefaultTheme.Config = {
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    editLink: {
      text: 'Suggest changes to this page',
      pattern: `https://github.com/${REPOSITORY_SLUG}/edit/main/docs/:path`,
    },

    socialLinks: [
      { icon: 'x', link: `https://twitter.com/ntnyq` },
      { icon: 'github', link: `https://github.com/${REPOSITORY_SLUG}` },
    ],

    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],
  }

  return config
}

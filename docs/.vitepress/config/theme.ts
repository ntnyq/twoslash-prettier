import { version } from '../../../package.json'
import { appTitle } from '../meta'
import type { DefaultTheme } from 'vitepress'

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  {
    text: `Release Notes`,
    link: `https://github.com/ntnyq/${appTitle}/releases`,
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
      pattern: `https://github.com/ntnyq/${appTitle}/edit/main/docs/:path`,
    },

    socialLinks: [
      { icon: 'x', link: `https://twitter.com/ntnyq` },
      { icon: 'github', link: `https://github.com/ntnyq/${appTitle}` },
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

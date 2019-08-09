const { resolve } = require('path')

module.exports = {
  base: '/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vapper',
      description: 'A Vue-based server-side rendering framework'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vapper',
      description: 'Vue SSR 框架'
    }
  },
  themeConfig: {
    home: true,
    displayAllHeaders: true,
    sidebarDepth: 2,
    locales: {
      '/': {
        label: 'English',
        sidebar: [
          '/'
        ]
      },
      '/zh/': {
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        sidebar: [
          ['/zh/introduction', 'Introduction'],
          ['/zh/usage', 'Usage']
        ],
        nav: [
          // { text: '捐赠者名单', link: '/zh/donor-list' },
        ]
      }
    },
    repo: 'vapperjs/vapper',
    docsDir: 'docs',
    editLinks: true,
    sidebar: 'auto'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@as': resolve(__dirname, './assets'),
        '@imgs': resolve(__dirname, './assets/imgs')
      }
    }
  }
}

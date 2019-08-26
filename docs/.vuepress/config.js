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
          {
            title: 'Guide',
            children: [
              ['/zh/introduction', 'Introduction'],
              ['/zh/usage', 'Usage'],
              ['/zh/entry', '入口文件'],
              ['/zh/data-prefetching', '数据预取'],
              ['/zh/routes-meta', '路由 Meta'],
              ['/zh/error-handling', '错误处理'],
              ['/zh/management-head', '管理 <head>'],
              ['/zh/assets', '静态资源'],
              ['/zh/caching', '使用缓存'],
              ['/zh/using-plugin', '使用插件'],
              ['/zh/injection', 'Vapper 注入']
            ]
          },
          {
            title: 'Advanced',
            children: [
              ['/zh/write-plugin', '插件开发'],
              ['/zh/custom-server', '自定义 Server'],
              ['/zh/configer', 'Configer']
            ]
          },
          ['/zh/config', '配置文件']
        ],
        nav: [
          { text: 'Guide', link: '/zh/introduction' },
          { text: 'Advanced', link: '/zh/node-api' },
          { text: '配置文件', link: '/zh/config' }
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

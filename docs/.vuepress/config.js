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
      description: 'A Vue-based server-side rendering framework'
    }
  },
  themeConfig: {
    home: true,
    sidebarDepth: 2,
    locales: {
      '/': {
        label: 'English',
        editLinkText: 'Edit this page on GitHub',
        sidebar: [
          {
            title: 'Guide',
            children: [
              ['/introduction', 'Introduction'],
              ['/usage', 'Usage'],
              ['/entry', 'Entry file'],
              ['/data-prefetching', 'Data prefetch'],
              ['/routes-meta', 'Routes Meta'],
              ['/error-handling', 'Error Handling'],
              ['/management-head', 'Management <head>'],
              ['/assets', 'Static Resource'],
              ['/mode', 'mode and environment variables'],
              ['/caching', 'Caching'],
              ['/using-plugin', 'Using Plugin'],
              ['/injection', 'Vapper Injection'],
              ['/typescript', 'Use TypeScript']
            ]
          },
          {
            title: 'Advanced',
            children: [
              ['/write-plugin', 'Writing a plugin'],
              ['/custom-server', 'Custom Server'],
              ['/configer', 'Configer']
            ]
          },
          ['/config', 'Configuration']
        ],
        nav: [
          { text: 'Guide', link: '/introduction' },
          { text: 'Advanced', link: '/write-plugin' },
          { text: 'Configuration', link: '/config' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
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
              ['/zh/mode', 'mode 和环境变量'],
              ['/zh/caching', '使用缓存'],
              ['/zh/using-plugin', '使用插件'],
              ['/zh/injection', 'Vapper 注入'],
              ['/zh/typescript', '使用 TypeScript'],
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
          { text: 'Advanced', link: '/zh/write-plugin' },
          { text: '配置文件', link: '/zh/config' },
          { text: '常见问题', link: '/zh/troubleshooting' }
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

# 页面模板

`Vapper` 的特性之一就是当错误发生时会回退 `SPA` 模式，以及[可选的 SSR](/zh/routes-meta.html#可选的-ssr)。但是 `SPA` 和 `SSR` 会使用不同的 `html` 模板。

## SSR 的页面模板

默认的模板文件内容如下：

```html
<!DOCTYPE html>
<html data-vue-meta-server-rendered lang="en" {{{ meta.inject().htmlAttrs.text() }}}>
  <head {{{ meta.inject().headAttrs.text() }}}>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" />
    {{{ meta.inject().meta.text() }}}
    {{{ meta.inject().title.text() }}}
    {{{ meta.inject().link.text() }}}
    {{{ meta.inject().style.text() }}}
    {{{ meta.inject().script.text() }}}
    {{{ meta.inject().noscript.text() }}}
  </head>
  <body {{{ meta.inject().bodyAttrs.text() }}}>
    <!--vue-ssr-outlet-->
    {{{ meta.inject().script.text({ body: true }) }}}
  </body>
</html>
```

`SSR` 渲染的内容会替换 `<!--vue-ssr-outlet-->`。

可以通过配置文件的 [template](/zh/config.html#template) 选项自定义模板。

## SPA 的页面模板

- [Vue CLI](https://cli.vuejs.org/) 在构建 `SPA` 资源的时候会使用 `public/index.html` 作为模板。

- [Poi](https://poi.js.org/) 有默认的 `html` 模板，同样可以自定义：[https://poi.js.org/config.html#output-html](https://poi.js.org/config.html#output-html)。
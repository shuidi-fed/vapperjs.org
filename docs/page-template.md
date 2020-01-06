# Using a Page Template

One of the features of `Vapper` is that it will fall back to the SPA mode when an error occurs, and [optional SSR](/routes-meta.html#optional-ssr). But `SPA` and` SSR` will use different `html` templates.

## Page template for SSR

The default template file content is as follows:

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

The content rendered by `Vapper` will replace `<!-Vue-ssr-outlet->`. You can customize the template through the [template](/config.html#template) option of the configuration file.

## Page template for SPA

- [Vue CLI](https://cli.vuejs.org/) will use `public/index.html` as a template when building `SPA` resources.

- [Poi](https://poi.js.org/) has a default `html` template, which can also be customized: [https://poi.js.org/config.html#output-html](https: //poi.js.org/config.html#output-html).
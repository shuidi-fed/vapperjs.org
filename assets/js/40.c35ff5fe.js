(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{281:function(t,s,a){"use strict";a.r(s);var n=a(38),e=Object(n.a)({},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"从-v0-x-迁移到-v1-0"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#从-v0-x-迁移到-v1-0","aria-hidden":"true"}},[t._v("#")]),t._v(" 从 v0.x 迁移到 v1.0")]),t._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#入口文件中-createapp-函数的返回值"}},[t._v("入口文件中 createApp 函数的返回值")])]),a("li",[a("a",{attrs:{href:"#移除-ctx-replacestate"}},[t._v("移除 ctx.replaceState()")])]),a("li",[a("a",{attrs:{href:"#vapper-plugin-cookie"}},[t._v("@vapper/plugin-cookie")])]),a("li",[a("a",{attrs:{href:"#context-对象的变更"}},[t._v("context 对象的变更")]),a("ul",[a("li",[a("a",{attrs:{href:"#客户端-context"}},[t._v("客户端 context")])]),a("li",[a("a",{attrs:{href:"#服务端-context"}},[t._v("服务端 context")])])])]),a("li",[a("a",{attrs:{href:"#错误处理-自定义错误页面"}},[t._v("错误处理 - 自定义错误页面")])])])]),a("p"),t._v(" "),a("h2",{attrs:{id:"入口文件中-createapp-函数的返回值"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#入口文件中-createapp-函数的返回值","aria-hidden":"true"}},[t._v("#")]),t._v(" 入口文件中 "),a("code",[t._v("createApp")]),t._v(" 函数的返回值")]),t._v(" "),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v0.x")]),t._v(" 中：")])]),t._v(" "),a("p",[a("code",[t._v("createApp")]),t._v(" 函数的返回值是一个对象，其中包含应用实例("),a("code",[t._v("new Vue()")]),t._v(")、路由实例等：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createApp")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" router "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("VueRouter")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{attrs:{class:"token comment"}},[t._v("/* ... */")]),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Vue")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{attrs:{class:"token comment"}},[t._v("/* ... */")]),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" app"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" router "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中：")])]),t._v(" "),a("p",[a("code",[t._v("createApp")]),t._v(" 函数要求返回根组件选项("),a("code",[t._v("rootOptions")]),t._v(")：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createApp")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" router "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("VueRouter")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{attrs:{class:"token comment"}},[t._v("/* ... */")]),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// rootOptions")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    router"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    render"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" h "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("h")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'div'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" app\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"移除-ctx-replacestate"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#移除-ctx-replacestate","aria-hidden":"true"}},[t._v("#")]),t._v(" 移除 "),a("code",[t._v("ctx.replaceState()")])]),t._v(" "),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v0.x")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("创建 "),a("code",[t._v("store")]),t._v(" 实例后，需要立即调用 "),a("code",[t._v("ctx.replaceState()")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token comment"}},[t._v("// The Entry file")]),t._v("\n\n"),a("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createApp")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// Create store instance")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" store "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createStore")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  ctx"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("replaceState")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("store"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// This is necessary, vapper will use it to mix data(from server to client).")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// return")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" app"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" router"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" store "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("不再需要调用 "),a("code",[t._v("ctx.replaceState()")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token comment"}},[t._v("// The Entry file")]),t._v("\n\n"),a("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createApp")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// Create store instance")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" store "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createStore")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n    store\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),a("span",{attrs:{class:"token comment"}},[t._v("// return")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" app\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"vapper-plugin-cookie"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vapper-plugin-cookie","aria-hidden":"true"}},[t._v("#")]),t._v(" "),a("code",[t._v("@vapper/plugin-cookie")])]),t._v(" "),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v0.x")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("为了在组件内访问到 "),a("code",[t._v("$cookie")]),t._v("，我们需要手动编写 "),a("code",[t._v("mixin")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{attrs:{class:"token comment"}},[t._v("// Entry file")]),t._v("\n\nVue"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("mixin")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token function"}},[t._v("created")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("this")]),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$cookie "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("this")]),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$root"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$options"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$cookie\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("createApp")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ctx"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Vue")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    $cookie"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" ctx"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$cookie\n    "),a("span",{attrs:{class:"token comment"}},[t._v("// other options...")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("不再需要手动编写 "),a("code",[t._v("mixin")]),t._v(" 即可直接在组件中使用。")]),t._v(" "),a("h2",{attrs:{id:"context-对象的变更"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#context-对象的变更","aria-hidden":"true"}},[t._v("#")]),t._v(" context 对象的变更")]),t._v(" "),a("h3",{attrs:{id:"客户端-context"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#客户端-context","aria-hidden":"true"}},[t._v("#")]),t._v(" 客户端 context")]),t._v(" "),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v0.x")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("客户端的 "),a("code",[t._v("context")]),t._v(" 对象如下：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("context "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  Vue"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{attrs:{class:"token comment"}},[t._v("// the Vue constructor")]),t._v("\n  type"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token constant"}},[t._v("TYPE")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// type is 'server' or 'client'")]),t._v("\n  pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" createApp"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pluginRuntimeOptions  "),a("span",{attrs:{class:"token comment"}},[t._v("// createApp.pluginRuntimeOptions")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("去掉了 "),a("code",[t._v("Vue")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("context "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  type"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token constant"}},[t._v("TYPE")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// type is 'server' or 'client'")]),t._v("\n  pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" createApp"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pluginRuntimeOptions  "),a("span",{attrs:{class:"token comment"}},[t._v("// createApp.pluginRuntimeOptions")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"服务端-context"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#服务端-context","aria-hidden":"true"}},[t._v("#")]),t._v(" 服务端 context")]),t._v(" "),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v0.x")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("服务端的 "),a("code",[t._v("context")]),t._v(" 对象如下：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("context "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  Vue"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{attrs:{class:"token comment"}},[t._v("// Vue 构造函数")]),t._v("\n  type"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token constant"}},[t._v("TYPE")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// type 是 'server' 或者 'client'")]),t._v("\n  pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" createApp"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{attrs:{class:"token comment"}},[t._v("// createApp.pluginRuntimeOptions")]),t._v("\n  req"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" context"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("req"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// 请求对象")]),t._v("\n  res"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" context"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("res"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// 响应对象")]),t._v("\n  isFake  "),a("span",{attrs:{class:"token comment"}},[t._v("// 布尔值，标识着是否进行真正的渲染")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中：")])]),t._v(" "),a("p",[t._v("去掉了 "),a("code",[t._v("Vue")]),t._v("，并添加了 "),a("code",[t._v("context.url")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("context "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  type"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token constant"}},[t._v("TYPE")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// type 是 'server' 或者 'client'")]),t._v("\n  pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" createApp"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pluginRuntimeOptions"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{attrs:{class:"token comment"}},[t._v("// createApp.pluginRuntimeOptions")]),t._v("\n  req"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" context"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("req"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// 请求对象")]),t._v("\n  res"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" context"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("res"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token comment"}},[t._v("// 响应对象")]),t._v("\n  isFake"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{attrs:{class:"token comment"}},[t._v("// 布尔值，标识着是否进行真正的渲染")]),t._v("\n  url"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" req"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("url  "),a("span",{attrs:{class:"token comment"}},[t._v("// 请求的 url")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"错误处理-自定义错误页面"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#错误处理-自定义错误页面","aria-hidden":"true"}},[t._v("#")]),t._v(" 错误处理 - 自定义错误页面")]),t._v(" "),a("p",[t._v("在 "),a("code",[t._v("v1.0")]),t._v(" 中我们对错误处理进行了重构，核心规则如下：")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("如果 "),a("code",[t._v("enableCustomErrorPage: false")]),t._v("，则回退 "),a("code",[t._v("SPA")]),t._v("。")])]),t._v(" "),a("li",[a("p",[t._v("如果 "),a("code",[t._v("enableCustomErrorPage: true")]),t._v("，但是没有提供 "),a("code",[t._v("ErrorComponent")]),t._v(" 组件，则回退 "),a("code",[t._v("SPA")]),t._v("。")])]),t._v(" "),a("li",[a("p",[t._v("如果 "),a("code",[t._v("enableCustomErrorPage: true")]),t._v("，并且提供了 "),a("code",[t._v("ErrorComponent")]),t._v(" 组件，但 "),a("code",[t._v("ErrorComponent")]),t._v(" 组件内部出错，则回退 "),a("code",[t._v("SPA")]),t._v("。")])])]),t._v(" "),a("p",[a("strong",[t._v("换句话说，可以有选择的在 "),a("code",[t._v("ErrorComponent")]),t._v(" 组件内抛出错误，来实现在自定义错误页面和回退 "),a("code",[t._v("SPA")]),t._v(" 这两个模式间自由切换。")])]),t._v(" "),a("p",[t._v("详情请阅读："),a("router-link",{attrs:{to:"/zh/error-handling.html#自定义错误页面"}},[t._v("错误处理 - 自定义错误页面")])],1)])},[],!1,null,null,null);s.default=e.exports}}]);
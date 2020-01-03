# Mode and Environment variables

Take [Vue CLI](https://cli.vuejs.org/) as an example, `mode` is a very important concept in [Vue CLI](https://cli.vuejs.org/): [Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#modes).

## Mode in Vapper

There are only two modes in `Vapper`, which are `production` and `development`:

- `development` is used by `vapper dev`。
- `production` is used by `vapper build`。

In [Custom Server](/custom-server.html), `mode` is used as a parameter of the` Vapper` constructor:

```js {5}
const Vapper = require('@vapper/core')

async function starter () {
  // 1. Create a Vapper instance and Vapper will automatically load the configuration file
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2. using the default or from the port and host in the configuration file,
  //    you can also manually specify the port and host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3. Waiting for Vapper setup is complete
  await vapper.setup()

  // 4. Listening
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

## Start the production server correctly

When customizing `Server`, we usually have the following script:

```js
// package.json
{
  "scripts": {
    // Local development, start development server
    "dev": "NODE_ENV=development node ./server/index.js",
    // test environment
    "test": "NODE_ENV=test node ./server/index.js",
    // production environment
    "start": "NODE_ENV=production node ./server/index.js",
  }
}
```

As shown in the script above, we specified `NODE_ENV=test` in the` test` script, the purpose is to distinguish that our code running in the test environment, and our server code may use the value of `NODE_ENV` for environment discrimination, such as distinguishing API domain names in different environments. However, it should be noted that we should properly start the production server. In other words, although `NODE_ENV=test`, we still need to start the production server in the `node ./server/index.js` script, as shown in the highlighted code below:

```js {5,6}
const Vapper = require('@vapper/core')

async function starter () {
  // 1. Create a Vapper instance and Vapper will automatically load the configuration file
  const isProd = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
  const vapper = new Vapper({ mode: isProd ? 'production' : 'development' })

  // 2. using the default or from the port and host in the configuration file,
  //    you can also manually specify the port and host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3. Waiting for Vapper setup is complete
  await vapper.setup()

  // 4. Listening
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

## The build scripts in different environments

There are two steps to deploying a project. First, we need to build the project. After the build is complete, we need to start the production server. Above we explained how to properly start the production server, in this section we will introduce the build process in different environments. Usually we have the following script:

```js
// package.json
{
  // Test environment build
  "build:test": "vapper build --vueCliMode=test",
  // Production environment build
  "build": "vapper build --vueCliMode=production",
}
```

As shown in the code above, we specify the build environment through `--vueCliMode=xxx`, so what is `--vueCliMode=xxx`? In fact, `--vueCliMode=xxx` specifies the [Vue CLI's mode](https://cli.vuejs.org/guide/mode-and-env.html#modes).

When executing `npm run build` or` yarn build`, it will be as described in [Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#modes): load the `.env` file so that we can assign the corresponding values to the environment variables in the corresponding `.env` file:

```sh
# .env.test
NODE_ENV=production
VUE_APP_API_HOST=www.foo.com
```

```sh
# .env.production
NODE_ENV=production
VUE_APP_API_HOST=www.bar.com
```
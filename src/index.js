import * as vue3 from './vue3'
import * as vue2 from './vue2'
//import { existsSync, mkdirSync } from 'fs'
import {TAG} from './util/tag'
const {
  semver,
  loadModule,
  error,
  info
} = require('@vue/cli-shared-utils')

function loadVue2TemplateCompiler(api) {
  return loadModule('vue-template-compiler', api.service.context)
    || loadModule('vue-template-compiler', __dirname)
}

function loadVue3Compiler(api) {
  return loadModule('@vue/compiler-sfc', api.service.context)
    || loadModule('@vue/compiler-sfc', __dirname)
}

const plugin = (api, options) => {

  const pluginOptions = Object.assign(
    //default configuration
    {
      path: './src/components',
      extensions: ['vue', 'js', 'ts'],
      initializer: '',
      ignore: [
        '**/*.stories.js', // ignore storybook files
      ],
      rules: [] //{ pattern: '^a-(.*)', importer: 'import $1 from "ant-design-vue/es/$2"', installer: 'Vue.use($1)' }
                //$0 it is the tag's kebab name
                //$1 it is the tag's pascal name
                //$2 it is the tag matched part kebab name.
                //$3 it is the tag matched part pascal name.
                
    },
    // users provided configuration
    options.pluginOptions?.easyimport
  )

  if (!pluginOptions.pattern) {
    pluginOptions.pattern = `**/*.{${pluginOptions.extensions.join(',')},}`
  }

  // resolve the configured path
  pluginOptions.path = api.resolve(pluginOptions.path)

  // check the components path exists
  // if (!existsSync(pluginOptions.path)) {
  //   // if not we should create it so we don't error out
  //   mkdirSync(pluginOptions.path)
  //   // warn the user, possible misconfiguration?
  //   info('The components path "' + pluginOptions.path + '" was created.', '')
  // }
  if (pluginOptions.desc) {
    info(pluginOptions.desc, TAG)
  }
  info(JSON.stringify(pluginOptions), TAG)

  const vue = loadModule('vue', api.service.context) || loadModule('vue', __dirname)
  if (!vue) {
    error('Aborting, failed to load vue module.', TAG)
    return
  }

  const vueVersion = semver.major(vue.version)
  pluginOptions.vueVersion = vueVersion

  if (vueVersion === 2) {
    pluginOptions.extractor = vue2.extractTagsFromSfc
    pluginOptions.compiler = loadVue2TemplateCompiler(api)
  } else if (vueVersion >= 3) {
    pluginOptions.extractor = vue3.extractTagsFromSfc
    pluginOptions.compiler = loadVue3Compiler(api)
  } else {
    error('Aborting, vue version ' + vueVersion + ' not supported', TAG)
    return
  }

  // extend the base webpack configuration
  api.chainWebpack(webpackConfig => {
    // use oneOf so we're not running the loader when it's not required?
    webpackConfig.module
      .rules
      .get('vue')
      // add our custom components loader before the vue-loader
      .use('easyimport')
      .loader(require.resolve('./loader'))
      .options(pluginOptions)
      .before('vue-loader')
      .end()
  })

  // need to return something for typescript
  return true
}

export default plugin

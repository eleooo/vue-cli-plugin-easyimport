
<h2 align='center'><samp>vue-cli-plugin-easyimport</samp></h2>

<p align='center'>Easy import vue components in your Vue app with Vue CLI, supporting Vue 2 and 3.</p>


## Install

Install using Vue CLI. (Vue CLI 4+ is recommended)

```bash
vue add easyimport
```
or
```bash
npm i vue-cli=plugin-easyimport -D
```

---

## Usage

### Easy import app's defined components

Add components to your `components/` folder.

```bash
| components/
---| ComponentFoo.vue
---| ComponentBar.vue
```

Use them in any `.vue` as you would normally. Access your components with either PascalCase or kebab-case.

```html
<template>
<div>
  <ComponentFoo />
  <component-bar />
</div>
</template>
```

Remove `imports` and `components` from the `script` section.

### Easy import popular third-party components 
Add your third-party component, for example ant-design-vue
- install `ant-design-vue`  
```bash
npm i --save ant-design-vue 
```
- add configuration to `vue.config.js` file  
```js
module.exports = {
    pluginOptions: {
        easyimport: {
            rules: [
                //$0 it is the tag's kebab name
                //$1 it is the tag's pascal name
                //$2 it is the tag matched part kebab name.
                //$3 it is the tag matched part pascal name.                
                { pattern: '^a-(.*)', importer: 'import $1 from "ant-design-vue/es/$2"', installer: 'Vue.use($1)' }
            ]
        }
    }
}
```
- import ant-design-vue style in the `main.js`   
```js
import 'ant-design-vue/dist/antd.css';
```

- Enjoy other components in the vue file   
```vue
<template>
  <div>
    <a-button type="primary" loading>
      Loading
    </a-button>
    <a-button type="primary" size="small" loading>
      Loading
    </a-button>
    <a-button type="primary" loading />
    <a-button type="primary" shape="circle" loading />
    <a-button type="danger" shape="round" loading />
  </div>
</template>
```

## Configuration

You can change the behaviour of the plugin by modifying the options in `./vue.config.js`. 

```js
// vue.config.js
module.exports = {
  pluginOptions: {
    easyimport: {
      ...
    }
  }
}
```

### Options

All options are optional.

#### path - String

The path used for scanning to find components. Note: It should be relative to your project root. 

Default: `./src/components`

#### pattern - String

Regex to find the files within the `path`. Note: If you omit the pattern it will use the configured `extensions`

Default: `**/*.{${extensions.join(',')},}`

#### ignore - String[]

Regex to ignore files within the `path`. 

Default: `[ '**/*.stories.js' ],`

#### mapComponent - (component : Component) => Component | false

A function which you can use to filter out paths you don't want to be scanned.

For example, if we wanted to access your automatically components only when they're prefixed them with `auto`, you could use the below code.
```js
// vue.config.js
module.exports = {
  pluginOptions: {
    easyimport: {
      // prefix all automatically imported components with an auto prefix
      mapComponent (component) {
        component.pascalCase = 'Auto' + upperFirst(component.pascalCase)
        component.kebabName = 'auto-' + component.pascalCase
        return component
      }
    }
  }
}
```

#### rules - Object[]

Config third-party components rules,
```js
// vue.config.js
module.exports = {
    pluginOptions: {
        easyimport: {
            rules: [
                //$0 it is the tag's kebab name
                //$1 it is the tag's pascal name
                //$2 it is the tag matched part kebab name.
                //$3 it is the tag matched part pascal name.                
                { pattern: '^a-(.*)', importer: 'import $1 from "ant-design-vue/es/$2"', installer: 'Vue.use($1)' }
            ]
        }
    }
}
```

#### extensions - String[]

When scanning the path for components, which files should be considered components.

Default: `['.js', '.vue', '.ts']`

### Limitations

**Static Imports Only**

Only components that are statically defined within your template will work.

```vue
<template>
  <component :is="dynamicComponent"/>
</template>
```

**Using folders as namespaces**

It is assumed you are using the Vue conventions for naming your components. The below would not work without manually mapping
the components.

```bash
| components/
---| Foo.vue
------| Namespace/Foo.vue
```

It would create a conflict with two components called `Foo.vue`. You should name your component files with the namespace.
i.e `NamespaceFoo.vue`.

**Javascript Components**

You may need to refresh your browser when you are updating them. The hot module reloading 
seems to be a little buggy sometimes.

It's recommended that you stick with `.vue` SFC components.

## License

[MIT](LICENSE)

module.exports = {
    pluginOptions: {
        easyimport: {
            desc: '自定义组件加载',
            debug: true,
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
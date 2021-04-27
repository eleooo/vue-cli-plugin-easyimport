//import { loader } from 'webpack'

export default function compileTemplateFromDescriptor (
  sfcDescriptor,
  compiler
) {

  // check we have a template to work with
  if (!sfcDescriptor?.template?.content) {
    return
  }

  let content = sfcDescriptor.template.content

  // need to compile pug to html so that we can compile it using the vue/compiler-sfc
  if (sfcDescriptor.template.lang === 'pug') {
    const pug = require('pug')
    content = pug.render(content, { filename: this.resourcePath })
  }

  const tags = []

  let compiled = compiler.compile(content, {
    modules: [{
      postTransformNode: (node) => {
        tags.push(node.tag)
      }
    }]
  })
  compiled.tags = tags
  return compiled
}

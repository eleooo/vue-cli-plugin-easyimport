//import { info } from '@vue/cli-shared-utils'
import { TAG } from './tag'
export function injectComponents(source, components, options) {
  let importers = [], installers = [], coms = [];
  components.forEach(item => {
    if (item.import) {
      importers.push(item.import)
    }
    if (item.pascalName) {
      coms.push(item.pascalName)
    }
    if (item.install) {
      installers.push(item.install)
    }
  });
  if (installers.length > 0) {
    if (options.initializer) {
      importers.push(options.initializer)
    } else {
      importers.push('import Vue from "vue";');
    }
  }
  importers = importers.concat(installers)
  const newContent =
    `/* ${TAG} Begin */
    ${importers.join('\n')}
    script.components = Object.assign({}, { ${coms.join(', ')} }, script.components);
    /* ${TAG} End */`

  const hotReload = source.indexOf('/* hot reload */')
  if (hotReload > -1) {
    source = source.slice(0, hotReload) + newContent + '\n\n' + source.slice(hotReload)
  } else {
    source += '\n\n' + newContent
  }
  return source
}

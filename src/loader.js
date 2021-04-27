import { getOptions } from 'loader-utils';
import scanComponents from './util/scanComponents'
import componentMatcher from './util/componentMatcher'
import { injectComponents } from './util/injectComponents'
import { resolve } from 'upath'
import { TAG } from './util/tag'
import { info } from '@vue/cli-shared-utils'

export default async function (source) {
  //info(TAG + ' loader is runing', TAG)
  this.cacheable()

  const loaderContext = this

  // bail out if we're dealing with a resource with a query
  // we only want to be dealing with the 'virtual-module' of the SFC
  if (loaderContext.resourceQuery) {
    return source
  }

  const options = getOptions(loaderContext);

  const tags = options.extractor.call(this, options)

  // we only need to match the tags if we have some
  if (!tags || tags.length <= 0) {
    return source
  }

  const scannedComponents = await scanComponents(options, resolve('./src'))

  // make sure cache invalidation and recompile in watch mode
  scannedComponents.forEach(c => this.addDependency(c.filePath))

  // the components to import
  const components = componentMatcher(tags, scannedComponents, options)

  // only if we have components to inject
  if (components.length <= 0) {
    return source
  }

  let injectedSource = injectComponents(source, components)
  if (options.debug) {
    info('\r\n' + injectedSource, TAG)
  }
  return injectedSource
}


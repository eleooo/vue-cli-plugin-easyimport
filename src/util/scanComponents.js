import { basename, extname, join, dirname, resolve } from 'upath'
import globby from 'globby'
import { camelCase, kebabCase, upperFirst } from 'lodash'
import { existsSync } from 'fs'

const pascalCase = (str) => upperFirst(camelCase(str))

export default async function scanComponents(options, srcDir) {
  const components = []
  const { path, pattern, ignore = [] } = options
  if (!existsSync(path)) return components
  const filePaths = new Set()
  const scannedPaths = []



  const resolvedNames = new Map()

  for (const _file of await globby(pattern, { cwd: path, ignore })) {
    let filePath = resolve(join(path, _file))

    if (scannedPaths.find(d => filePath.startsWith(d))) {
      continue
    }

    if (filePaths.has(filePath)) {
      continue
    }
    filePaths.add(filePath)

    let fileName = basename(filePath, extname(filePath))
    if (fileName === 'index') {
      fileName = basename(dirname(filePath), extname(filePath))
    }

    if (resolvedNames.has(fileName)) {
      // eslint-disable-next-line no-console
      console.warn(`Two component files resolving to the same name \`${fileName}\`:\n` +
        `\n - ${filePath}` +
        `\n - ${resolvedNames.get(fileName)}`
      )
      continue
    }
    resolvedNames.set(fileName, filePath)

    const pascalName = pascalCase(fileName)
    const kebabName = kebabCase(fileName)
    const shortPath = filePath.replace(srcDir, '@')

    let component = {
      filePath,
      pascalName,
      kebabName,
      shortPath,
    }

    let resolvedComponent = component
    // allow someone to configure the component mapping
    if (options.mapComponent) {
      resolvedComponent = options.mapComponent(component)
    }

    // if a component was resolved as false, then we shouldn't push it
    if (resolvedComponent) {
      // resolve the import variable in case the user wanted to modify paths or the casing
      resolvedComponent.import = `import ${pascalName} from "${shortPath}";`
      components.push(resolvedComponent)
    }
  }

  scannedPaths.push(path)
  return components
}



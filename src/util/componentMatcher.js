import { first, filter } from 'lodash'
import ruledMatcher from './ruledMatcher'

/**
 * Match tags to components.
 *
 * @param tags An array of unique tags, should be unique for casing already
 * @param componentsToMatch Array of components from your project
 */
 export default function matcher (tags, componentsToMatch, options) {

    const components = []
    tags.forEach(tag => {
      const component = first(
        filter(componentsToMatch, (component) => {
          return tag === component.pascalName || tag === component.kebabName
        })
      )
      if (component) {
        components.push(component)
      } else {
        const ruledComponent = ruledMatcher(tag, options)
        if (ruledComponent) {
          components.push(ruledComponent)
        }
      }
    })
    return components
  }
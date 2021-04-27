import { camelCase, kebabCase, upperFirst, startsWith, isFunction } from 'lodash'
const pascalCase = (str) => upperFirst(camelCase(str))

function replace(str, searcher, replacement) {
    return str.split(searcher).join(replacement)
}

function genComponet(tagKebabName, rule, regExp) {
    let matchedKebabName = kebabCase(regExp[1])
    let matchedPascalName = pascalCase(matchedKebabName)
    let tagPascalName = pascalCase(tagKebabName)
    let importer = genComponetImport(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName, rule)
    let installer = genComponetInstaller(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName, rule)
    if (!importer) return false
    return {
        import: importer,
        install: installer
    }
}

function genComponetInstaller(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName, rule) {
    let str
    if (isFunction(rule.installer)) {
        str = rule.installer(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName)
    } else {
        str = replace(rule.installer, '$0', tagKebabName)
        str = replace(str, '$1', tagPascalName)
        str = replace(str, '$2', matchedKebabName)
        str = replace(str, '$3', matchedPascalName)
    }
    if (str && str.charAt(str.length - 1) != ';') {
        str = str + ';'
    }
    return str
}

function genComponetImport(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName, rule) {
    let str
    if (isFunction(rule.importer)) {
        str = rule.importer(tagKebabName, tagPascalName, matchedKebabName, matchedPascalName)
    } else {
        str = replace(rule.importer, '$0', tagKebabName)
        str = replace(str, '$1', tagPascalName)
        str = replace(str, '$2', matchedKebabName)
        str = replace(str, '$3', matchedPascalName)
    }
    if (!str) return false
    if (!startsWith(str, 'import ')) {
        str = 'import ' + str
    }
    if (str.charAt(str.length - 1) != ';') {
        str = str + ';'
    }
    return str
}

export default function (kebabTag, options) {
    if (!(Array.isArray(options.rules) && options.rules.length > 0)) {
        return
    }
    let component;
    options.rules.forEach(rule => {
        if (rule.pattern && rule.importer) {
            let p = new RegExp(rule.pattern)
            let matched = p.exec(kebabTag)
            if (matched) {
                component = genComponet(kebabTag, rule, matched)
            }
        }
    });
    return component
}
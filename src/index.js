const startTagRegex = /\<(\w+)?[\s\w=\"\'\/]*\>/g
const tagNameRegex = /^\<(\w+)([\s\w=\"\']*)\/?\>$/
const selfClosingTagRegex = /^\<(\w+)([\s\w=\"\']*)\/\>$/

const parseHtmlProperties = (props) => {
    const properties = props.replace(/(\s+|\t)/, ' ').trim()

    const propsEntries = properties.split(/\s+/).map(prop => {
        const [key, value] = prop.split('=')
        if (key && value) {
            return [key, value.replace(/^(\'|\")(.+)(\'|\")$/, '$2')]
        } else if (key) {
            return [key, true]
        }

        return null
    }).filter(Boolean)

    return Object.fromEntries(propsEntries)
}

const parseFirstTag = (html) => {
    html = html.replace(/\n/g, '').replace(/(\s{2,}|\t)/g, ' ').trim()

    const startTag = (html.match(startTagRegex) || [null])[0] || null
    const [,name,properties] = tagNameRegex.exec(startTag) || [null, null, null]

    if (!name) return null

    if (selfClosingTagRegex.test(html)) {
        return {
            name: name,
            outerHtml: startTag,
            properties: properties ? parseHtmlProperties(properties) : []
        }
    }

    const innerHtmlRegex = new RegExp(`<${name}.*?>(.*?)</${name}>`)
    const [outerHtml, innerHtml] = innerHtmlRegex.exec(html.trim()) || ['', '']
    
    return {
        name,
        innerHtml,
        outerHtml : outerHtml || startTag,
        properties: properties ? parseHtmlProperties(properties) : []
    }
}

module.exports = parseHtml = (html) => {
    const upperTags = []
    let content = html.replace(/\n/g, '').replace(/(\s{2,}|\t)/g, ' ').trim()

    while(content && content.trim() !== '') {
        const tag = parseFirstTag(content)
        
        if (!tag) break

        upperTags.push(tag)

        content = content.substring(tag.outerHtml.length)
    }

    return upperTags.map(tag => {
        if (tag.innerHtml) {
            tag.children = parseHtml(tag.innerHtml)
        }

        return tag
    })
}
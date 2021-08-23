# SIMPLE HTML PARSER

a simple html parser.

## Usage :
```javascript
const htmlParser = require('simple-html-parser')
const elements = htmlParser()
```

returns a array of elements objects

```typescript
interface HTMLElement {
    name : string,
    innerHtml?: string,
    outerHtml: string,
    properties: object[],
    children?: HTMLElement[],
}
```
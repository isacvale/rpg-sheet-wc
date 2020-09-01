// const getElement = (template) => {
//     const parser = newDOMParser()
//     const doc = parser.parseFromString(template, 'text/html')
//     return doc.body
// }

// const getHTML = async (name, classRef, path) => {
//     const html = await fetch(path)
//     const text = await html.text()
//     template = text
//     customElements.define(name, classRef)
// }

// function loader (tag, classRef, path) {
//     let template
//     this.getElement = getElement
//     this.getHTML = getHTML
// }

// export { getElement, getHTML }

async function loader (tag, classRef, path) {
    const html = await fetch(path)
    const text = await html.text()
    customElements.define(tag, classRef)

    return () => {
        const parser = newDOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        return doc.body
    }
}

export default loader

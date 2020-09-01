(async function getHTML () {
    // Fetching and parsing component
    const html = await fetch('/neo_components/fichaStyle')
    const text = await html.text()
    const parser = new DOMParser()
    const docBody = parser.parseFromString(text, 'text/html').body

    // Remove styles and add them to <body>
    const body = document.querySelector('body')
    const styles = [...docBody.querySelectorAll('style')]
    styles.forEach(x => body.appendChild(x))
}())
let component

class TextInput extends HTMLElement {
    constructor () {
        super()
        this.append(component.cloneNode([true]))
        this.elLabel = this.querySelector('.text-input-label')
        this.elValue = this.querySelector('.text-input-field')

        this.setLabel(this.dataset.label || 'Label')
        this.setValue(this.dataset.value || '')
    }

    static get observedAttributes () {
        return ['data-label', 'data-value']
    }

    attributeChangedCallback (attr, oldValue, newValue) {
        switch (attr) {
            case 'data-label':
                this.setLabel(newValue)
                return
            case 'data-value':
                this.setValue(newValue)
                return
        }
    }

    setLabel (value) {
        this.elLabel.textContent = value
    }

    setValue (value) {
        this.elValue.value = value
    }
}

(async function getHTML () {
    // Fetching and parsing component
    const html = await fetch('/neo_components/textInput')
    const text = await html.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    // Remove styles and add to <body>
    const body = document.querySelector('body')
    const styles = [...doc.querySelectorAll('body > style')]
    styles.forEach(x => body.appendChild(x))

    // Save component stripped from style
    component = doc.body.firstChild

    customElements.define('text-input', TextInput)
}())
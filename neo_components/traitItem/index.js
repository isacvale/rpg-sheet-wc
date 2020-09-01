let component

class TraitItem extends HTMLElement {
  constructor () {
    super ()
    this.append(component.cloneNode([true]))

    this.elNome = this.querySelector('[data-traitlabel]')
    this.elNome.textContent = this.dataset.nome
    this.elValue = this.querySelector('[data-traitvalue]')

    this.store = {
      traitName: 'Trait',
      traitValue: 0
    }
    this.proxy = new Proxy(this.store, this.handler)
  }

  connectedCallback () {
    const ev = new CustomEvent('qaz', {})
    setTimeout(() => this.dispatchEvent(ev), 1000)
  }

  handler = {
    set: (store, prop, value) => {
      switch (prop) {
        case 'traitValue':
          this.elValue.textContent = String(value)
          store[prop] = value
          return true
        case 'traitName':
          this.elNome.textContent = String(value)
          return true
      }
    }
  }

  setItemValue (value) {
    this.proxy.traitValue = value || 0
  }

  setItemName (value) {
    this.proxy.traitName = value || 'Trait'
  }
}

(async function getHTML () {
  // Fetching and parsing component
  const html = await fetch('/neo_components/traitItem')
  const text = await html.text()
  const parser = new DOMParser()
  const docBody = parser.parseFromString(text, 'text/html').body

  // Remove styles and add them to <body>
  const body = document.querySelector('body')
  const styles = [...docBody.querySelectorAll('style')]
  styles.forEach(x => body.appendChild(x))

  // Save component stripped from style
  component = docBody.firstChild

  customElements.define('trait-item', TraitItem)
}())

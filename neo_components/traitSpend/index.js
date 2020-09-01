let component

class TraitSpend extends HTMLElement {
  constructor () {
    super()
    this.append(component.cloneNode([true]))

    this.elNome = this.querySelector('[data-traitlabel]')
    this.elCurrent = this.querySelector('[data-traitcurrent]')
    this.elMax = this.querySelector('[data-traitmax]')

    this.btnPlus = this.querySelector('[data-spend-button="plus"]')
    this.btnMinus = this.querySelector('[data-spend-button="minus"]')

    this.updateValues()
    this.dataset.rich = {}

    window.richtest = this.richtest.bind(this)
  }

  richtest () {
    console.log('rich', this.dataset.rich)
    Object.assign(this.dataset.rich, {a: 1})
  }

  connectedCallback () {
    this.btnPlus.addEventListener('click', ev => this.changeValue('plus'))
    this.btnMinus.addEventListener('click', ev => this.changeValue('minus'))
  }

  changeValue (type) {
      const { current, max } = this.dataset
      if (type == 'plus' && current < max) {
        this.dataset.current = +this.dataset.current + 1
      } else  if (type == 'minus' && current > 0) {
        this.dataset.current = +this.dataset.current - 1
      }
  }

  static get observedAttributes () {
    return ['data-label', 'data-current', 'data-max', 'data-rich']
  }

  updateValues () {
    this.elNome.textContent = this.dataset.label || 'Trait'
    this.elCurrent.textContent = this.dataset.current || 5
    this.elMax.textContent = this.dataset.max || 10
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    this.updateValues()
    if (attr == 'data-rich') {
      alert('wow')
    }
  }
}

(async function getHTML () {
  // Fetching and parsing component
  const html = await fetch('/neo_components/traitSpend')
  const text = await html.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  // Remove styles and add to <body>
  const body = document.querySelector('body')
  const styles = [...doc.querySelectorAll('body > style')]
  styles.forEach(x => body.appendChild(x))

  // Save component stripped from style
  component = doc.body.firstChild

  customElements.define('trait-spend', TraitSpend)
}())
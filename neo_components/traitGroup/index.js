import Stamp from '/node_modules/@dvo/stamp/lib/stamp.js'

let component

class TraitGroup extends HTMLElement {
  constructor () {
    super()
    this.append(component.cloneNode([true]))

    this.store = {
      title: this.dataset.title || 'Title',
      traitList: [],
    }

    this.buildChildren()
    this.dataset.uid = Math.random()

    this.elTitle = this.querySelector('.trait-group-title')
    this.elTitle.textContent = this.store.title

  }

  static get observedAttributes () {
    return ['data-title']
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    switch (attr) {
      case 'data-title':
        this.store.title = newValue
        this.elTitle.textContent = newValue
        return true
    }
  }

  loadTraitList (newList) {
      this.store.traitList = newList
      this.clear()
      this.buildChildren()
  }

  loadTraitSpend (label, max, current, alias) {
    Stamp('.tpl-trait-group-spend',
    {
      override: true,
      context: this
    })
      .stamp(x => {
        x.dataset.label = label
        x.dataset.max = max
        x.dataset.current = current
      })
  }

  clear () {
      this.querySelector('.trait-group > div').innerHTML=''
  }

  updateItem (item, data) {
    if (item.setItemName && item.setItemValue) {
      item.setItemName(data.name)
      item.setItemValue(data.value)
    } else {
      window.requestAnimationFrame(() => this.updateItem(item, data))
    }
  }

  updateItemSimple (item, data) {
    item.setItemName(data.name)
    item.setItemValue(data.value)
  }

  buildChildren () {
    this.store.traitList.forEach((data, idx) => {
      this.dataset.uid && Stamp('.tpl-trait-group-item')
        .target(`[data-uid="${this.dataset.uid}"] > .trait-group`)
        .stamp(x => this.updateItemSimple(x, data))
    })
  }
}

(async function getHTML () {
// Fetching and parsing component
  const html = await fetch('/neo_components/traitGroup')
  const text = await html.text()
  const parser = new DOMParser()
  const docBody = parser.parseFromString(text, 'text/html').body

  // Remove styles and add them to <body>
  const body = document.querySelector('body')
  const styles = [...docBody.querySelectorAll('style')]
  styles.forEach(x => body.appendChild(x))

  // Save component stripped from style
  component = docBody.firstChild

  customElements.define('trait-group', TraitGroup)
}())
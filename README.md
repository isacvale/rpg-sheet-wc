# rpg-sheet-wc

This rpg character sheet is actually a study on web components technology. The goal is to refine a pattern to use and share web components that are: 1) web-component-framework-free and 2) don't rely on writing "markup in code" though template string and neither "code in markup", as through a templating languages.

## What I learned so far
It's very important to keep in mind that:

- **Every web component must be registered with a unique name**, and

- **It's cleaner to write JS in JS file, and markup/style in an HTML file.**

These tidbits of truth allow us to simplify the use of web components into a rather enjoyable experience. Keep them in mind when reading through each learned lesson below.

---

### 1. Separate JS from markup/CSS.
You could have your JS code inlined within a single HTML file, but then it couln't be `type='module'`, preventing you from importing ES6 modules - a _terrible_ trade off!

Keeping the "separation of technologies" allows you to keep any tooling you want to use because you're not bound to any particular tool (such as templating languages and compilers).

---

### 2. Load component code with NPM, and have it fetch the markup
If every component is composed of two files (index.js and index.html), then you can import it as an ES6 module, which can then fetch and include the markup and styling. That's easy to do because you know exactly the path to the HTML file (since it is an NPM package). The "loading code" would look something like:
```javascript
let component

class MyComponent extends HTMLElement {
  constructor () {
    super ()
    this.append(component.cloneNode([true]))
  }
}

(async function getHTML () {
  // Fetching and parsing component
  const html = await fetch('/node_modules/package_name')
  const text = await html.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  // Remove styles and add to <body>
  const body = document.querySelector('body')
  const styles = [...doc.querySelectorAll('body > style')]
  styles.forEach(x => body.appendChild(x))

  // Save component stripped from style
  component = doc.body.firstChild

  customElements.define('my-component', MyComponent)
}())
```
Note that by doing this, you don't need to encapsule your markup in a template tag.

---

### 3. Use dataset for local state
You can use data-* attributes and element.dataset to keep local state. Whatever framework you use (or don't use), you can interface with the component through data-* attributes and have `observedAttributes` and `changedAttributeCallback` respond to the attributes. It will allow using the component declaratively, while the code that listens to changes is written imperatively (which is much more performant).

---

### 4. Go for multiple components instead of a component that render multiple sets of data.
Instead of writing a wrapper component that takes an array of data and generates inner components, it's simpler and more flexible to let your containers be containers, and use the array of data to append children to it. There's a couple of reasons for it:

- First, you can't pass rich data (objects and arrays) as data-attributes. You can add them to dataset, but `changedAttributeCallback` wouldn't respond to changes within the object.

- Second, components are meant for componentization. Not specializing on a particular kind of content will make your component more reusable and, by extention, your code less repetitve.

### 5. You don't need Shadow DOM.
No, you don't. Really. There are two problems regarding CSS in web components:
- **Not letting internal style spill out**. This is trivial: every web component's name is guaranteed to be unique, so you should add it as an ancestor of your CSS rules, like so:  `my-component h1 { ... }`.
- **Managing the style that comes in**. I refuse to accept the notion that authors may _prevent_ users from styling any part of web components. The goal is to prevent them to _unwittingly_ overwrite styles. Adding the component's name as an ancestor to the CSS rules (as above) may not be the ideal solution, but it does provide a marginal increased specificity to internal styling, protecting it while still allowing for needed changes.
---
### 6. If you do use Shadow DOM, expose it all.
As mentioned before, the idea that authors may _prevent_ users from styling any part of a component is ludicrous because _authors cannot predict all of the user's needs_. The ideal way to treat this problem was CSS `::shadow` but that specification was dropped. We can reconstruct it through CSS `::part`, albeit a tad more verbose. What you need is basically expose all of the component inside a `part` (I propose always calling it 'component' for simplicity).
```html
<my-component>
  ::shadowRoot
    <div part='component'>
      ...
    </div>
</my-component>

<style>
  my-component::part(component) {
      ...
  }
</style>
```
---
### 7. Use base style components.
The best use-case for web components is implementing components of a design system. In this scenario, if each component was to have his complete set of styles, there'd be a lot of repetition inside their CSS. You can keep it DRY by creating a base component that loads all the common CSS and make it a dependency of all the other components.
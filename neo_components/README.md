# rpg-sheet-wc

This rpg character sheet is actually a study on web components technology. The goal is to refine a pattern to use and share web components that are: 1) web-component-framework-free and 2) don't rely on writing "markup in code" though template string and neither "code in markup", as through a templating languages.

## What I learned so far
It's very important to keep in mind that:

**Every web component must be registered with a unique name.**

and

**It's cleaner to write JS in JS file, and markup/style in an HTML file.**

These tidbits of truths allow us to simplify the use of web components into a rather enjoyable experience. Keep it in mind when reading through each tidbit of learned lesson below.

### 1. Separate JS from markup/CSS.
> You could have your JS code inlined within an HTML file, but then it couln't be `type='module'`, preventing you from importing modules - a _terrible_ trade off!

> Keeping the "separation of technologies" allows you to keep any tooling you want to use because it allows not to depend on any particular tool (such as templating languages and compilers).

### 2. Load component code with NPM, and have it fetch the markup
> If every component is composed of two files (index.js and index.html), then the JS can fetch and include the markup and styling. That's easy to do because you know exactly the path to the HTML file (since it is an NPM package). The "loading code" would look something like:
```javascript
let component

// Your class declaration goes here

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

  customElements.define('my-component', myComponent)
}())
```
> Note that by doing this, you don't need to encapsule your markup in a template tag.
### 3. Use dataset for local state
> You can use data-* attributes and element.dataset to keep local state. Whatever framework you use (or don't use), you can interface with the component through data-* attributes and have `observedAttributes` and `changedAttributeCallback` respond to the attributes. It will allow using the component declaratively, while the code that listens to changes is written imperatively (which is much more performant).

### 4. Go for multiple components instead of a component that render multiple sets of data.
> Instead of writing a wrapper component that takes an array of data and generates inner components, it's simpler and more flexible to let your containers be containers, and use the array of data to append children to it. There's a couple of reasons for it:

> First, you can't pass rich data (objects and arrays) as data-attributes. You can add them to dataset, but `changedAttributeCallback` wouldn't respond to changes within the object.

> Second, components are meant for componentization. Not specializing on a particular kind of content will make your component more reusable and, by extention, your code less repetitve.

### 5. You don't need Shadow DOM.
> No, you don't. Really. There are two problems regarding CSS code in components:
> - **Not letting internal style spill out**. This is trivial: every web component name is guaranteed to be unique, so you should add it as an ancestor of your CSS rules, like:  `my-component h1 { ... }`.
> - **Managing the style that comes in**. I refuse the notion authors may _prevent_ users from style any part of web components. The idea is manage it so users don't unwittingly overwritee styles. Adding the components name as an ancestor to the CSS rules (as above) may not be the ideal solution, but it does provide a marginal increased specificity to internal styling, protecting it while still making any needed changes.
### 6. If you do use Shadow DOM, expose it all.
> As mentioned, the idea that authors may _prevent_ users from styling any part of a component is ludicrous, on the basis that authors cannot predict all of the users needs. The ideal way to treat this problem was CSS ::shadow, but that specification was dropped. We can reconstruct it through CSS ::part, albeit a tad more verbose. What you need is basically expose all the component inside a part (I propose calling it 'component').
```html
<div part='component'>
    ...
</div>
```
```css
my-component::part-component {
    ...
}
```

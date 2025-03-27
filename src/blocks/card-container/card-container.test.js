import {
  describe, it, expect, beforeEach,
} from 'vitest';
import decorate from './card-container.js';

function parseHTML(htmlString) {
  return new DOMParser().parseFromString(htmlString, 'text/html').body.firstChild;
}

function normalizeDOM(node) {
  if (!node) return null;

  // Clone to avoid modifying original DOM
  const clone = node.cloneNode(true);

  // Recursively trim text nodes
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null);
  for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) {
    textNode.nodeValue = textNode.nodeValue.trim();
  }

  // Sort attributes to ensure they are compared in the same order
  function sortAttributes(el) {
    if (el.nodeType === 1) {
      const attrs = Array.from(el.attributes)
        .sort((a, b) => a.name.localeCompare(b.name));

      // Remove all attributes and re-add them in sorted order
      attrs.forEach((attr) => el.removeAttribute(attr.name));
      attrs.forEach((attr) => el.setAttribute(attr.name, attr.value.trim()));
    }
    Array.from(el.children).forEach(sortAttributes);
  }

  sortAttributes(clone);

  return clone;
}

describe('Card', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="content"></div>';
    container = document.getElementById('content');
  });

  it('Should be able to apply listing to a card', () => {
    const starting = `<div id="shady" 
    data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554" 
    data-aue-type="container" 
    data-aue-behavior="component" 
    data-aue-model="cards" 
    data-aue-label="Cards" 
    data-aue-filter="cards" 
    class="cards highlight dark horizontal">
    <div data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554/item" 
         data-aue-type="component" 
         data-aue-model="card" 
         data-aue-label="Card">
            <div><picture><img src="/content/dam/doe-experimentation/content-at-scale.png" data-aue-prop="image" data-aue-label="Image" data-aue-type="media"></picture></div>
        
            <div><a href="https://www.yahoo.com/" data-aue-prop="linkText" data-aue-label="Headline" data-aue-type="text">This is the headline</a></div>
        
            <div data-richtext-prop="text" data-richtext-label="Text" data-richtext-filter="text">This is some text</div>
       </div>
    </div>`;

    const expected = parseHTML(`
     <div id="shady"
     data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554" 
     data-aue-type="container" 
     data-aue-behavior="component" 
     data-aue-model="cards" 
     data-aue-label="Cards" 
     data-aue-filter="cards" 
     class="cards highlight dark horizontal">
      <ul class="nsw-grid">
          <li class="nsw-col nsw-col-md-6 nsw-col-lg-4" 
          data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554/item" 
          data-aue-type="component" data-aue-model="card" data-aue-label="Card">
              <div class="nsw-card nsw-card--highlight nsw-card--dark nsw-card--horizontal">
                <div class="nsw-card__image">
                   <picture>
                      <source srcset="/content/dam/doe-experimentation/content-at-scale.png?width=750&amp;format=webply&amp;optimize=medium"
                              type="image/webp">
                      <img alt="" data-aue-label="Image" data-aue-prop="image" data-aue-type="media" loading="lazy"
                           src="/content/dam/doe-experimentation/content-at-scale.png?width=750&amp;format=png&amp;optimize=medium">
                  </picture> 
                </div>
                <div class="nsw-card__content">
                    <div class="nsw-card__title">
                       <a href="https://www.yahoo.com/" data-aue-prop="linkText" data-aue-label="Headline" data-aue-type="text">This is the headline</a>
                    </div>
                    
                    <div class="nsw-card__copy"  data-richtext-prop="text" data-richtext-label="Text" data-richtext-filter="text">
                       This is some text
                    </div>
                    
                    <span aria-hidden="true" class="material-icons nsw-material-icons" focusable="false">east</span>
                </div>
              </div>
          </li>
      </ul>
    </div>`);

    container.insertAdjacentHTML('beforeend', starting);
    const insertedBlock = container.children[0];

    // Apply the decoration
    decorate(insertedBlock);

    const startingNormalised = normalizeDOM(parseHTML(insertedBlock.outerHTML)).outerHTML;
    const expectedNormalised = normalizeDOM(expected).outerHTML;

    expect(startingNormalised).toBe(expectedNormalised);
  });
});

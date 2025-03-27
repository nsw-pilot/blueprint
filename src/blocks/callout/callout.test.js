import {
  describe, it, expect, beforeEach,
} from 'vitest';
import decorate from './callout.js';
import { normalizeDOM, parseHTML } from '../../scripts/test-helpers.js';

describe('Card', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="content"></div>';
    container = document.getElementById('content');
  });

  it('Card retains its instrumentation', () => {
    const starting = `
    <div 
    data-aue-resource="urn:aemconnection:/content/doe/sws/schools/a/albury-h/index/jcr:content/root/section_2/block_2128512099"  
    data-aue-type="component" 
    data-aue-behavior="component" 
    data-aue-model="callout" 
    data-aue-label="callout" 
    class="callout">
      <div>
        <div data-aue-prop="title" data-aue-label="Title" data-aue-type="text"><p>Hi there</p></div>
      </div>
      <div>
        <div data-richtext-prop="description" data-richtext-label="Description" data-richtext-filter="text"><p>How are you going?</p></div>
      </div>
    </div>`;

    const expected = parseHTML(`
     <div class="callout nsw-callout"
     data-aue-resource="urn:aemconnection:/content/doe/sws/schools/a/albury-h/index/jcr:content/root/section_2/block_2128512099"
     data-aue-type="component" data-aue-behavior="component" data-aue-model="callout" data-aue-label="callout">
         <div class="nsw-callout__content">
             <p class="nsw-h4" data-aue-prop="title" data-aue-label="Title" data-aue-type="text">Hi there</p>
             <p data-richtext-prop="description" data-richtext-label="Description" data-richtext-filter="text">How are you going?</p>
        </div>
     </div>
     `);

    container.insertAdjacentHTML('beforeend', starting);
    const insertedBlock = container.children[0];

    // Apply the decoration
    decorate(insertedBlock);

    const startingNormalised = normalizeDOM(parseHTML(insertedBlock.outerHTML)).outerHTML;
    const expectedNormalised = normalizeDOM(expected).outerHTML;

    expect(startingNormalised).toBe(expectedNormalised);
  });
});

import 'https://da.live/nx/public/sl/components.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import { LitElement, html } from 'da-lit';

const style = await getStyle(import.meta.url);

class Generator extends LitElement {
  async connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
  }

  render() {
    return html`
      <div class="main-container">
        <h1>Create your site</h1>
      </div>
    `;
  }
}

customElements.define('da-generator', Generator);

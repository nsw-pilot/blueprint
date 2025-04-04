import 'https://da.live/nx/public/sl/components.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import { LitElement, html, nothing } from 'da-lit';
import { createSite } from './create-site.js';

const style = await getStyle(import.meta.url);

class Generator extends LitElement {
  static properties = {
    loading: { type: Boolean, state: true, attribute: false },
    error: { type: String, state: true, attribute: false },
    message: { type: String, state: true, attribute: false },
  };

  constructor() {
    super();
    this.loading = false;
    this.error = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
  }

  onSubmit(e) {
    e.preventDefault();
    this.loading = true;
    const formData = new FormData(e.target.closest('form'));
    const data = Object.fromEntries(formData.entries());
    createSite(data, (message) => { this.message = message;})
      .then(() => { this.loading = false; })
      .catch((e) => {
        this.loading = false;
        this.message = null;
        this.error = e.message;
      });
  }

  render() {
    return html`
      <div class="main-container">
        <h1>Create your site</h1>
        <form>
          <sl-input type="text" name="school-name" label="School name"></sl-input>
          <sl-input type="text" name="principal-name" label="Principal's name"></sl-input>
          <sl-button ?disabled=${this.loading} @click=${this.onSubmit}>Create site</sl-button>
        </form>
        <div class="status">
          ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
          ${this.message ? html`<p class="status">${this.message}</p>` : nothing}
        </div>
      </div>
    `;
  }
}

customElements.define('da-generator', Generator);

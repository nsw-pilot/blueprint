// TODO update to da.live once https://github.com/da-sites/nexter/pull/31 is merged
import 'https://main--nexter--hannessolo.aem.live/nx/public/sl/components.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import { LitElement, html, nothing } from 'da-lit';
import { createSite } from './create-site.js';

const style = await getStyle(import.meta.url);

class Generator extends LitElement {
  static properties = {
    loading: { type: Boolean, state: true, attribute: false },
    error: { type: String, state: true, attribute: false },
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
    createSite(data)
      .then(() => { this.loading = false; })
      .catch((e) => {
        this.loading = false;
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
        ${this.error ? html`${this.error}` : nothing}
      </div>
    `;
  }
}

customElements.define('da-generator', Generator);

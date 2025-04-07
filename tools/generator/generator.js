import 'http://localhost:6456/nx/public/sl/components.js';
import getStyle from 'https://da.live/nx/utils/styles.js';
import { LitElement, html, nothing } from 'da-lit';
import { ORG, createSite } from './create-site.js';

const style = await getStyle(import.meta.url);

class Generator extends LitElement {
  static properties = {
    _data: { state: true },
    _loading: { state: true },
    _status: { state: true },
    _time: { state: true },
  };

  async connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
  }

  calculateCrawlTime(startTime) {
    const crawlTime = Date.now() - startTime;
    return `${String(crawlTime / 1000).substring(0, 4)}s`;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this._time = null;
    this._loading = true;
    const formData = new FormData(e.target.closest('form'));
    const entries = Object.fromEntries(formData.entries());

    const empty = Object.keys(entries).some((key) => !entries[key]);
    if (empty) {
      this._status = { type: 'error', message: 'Some fields empty.' };
      return;
    }

    const startTime = Date.now();
    const getTime = setInterval(() => {
      this._time = this.calculateCrawlTime(startTime);
    }, 100);
    
    this._data = {
      ...entries,
      siteName: entries.schoolName.replaceAll(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
    };

    const setStatus = (status) => { this._status = status; };

    try {
      await createSite(this._data, setStatus);
    } catch (e) {
      this._status = e;
    }

    clearTimeout(getTime);
    this._status = { type: 'success', message: `Site created in ${this.calculateCrawlTime(startTime)}.` };
  }

  get _heading() {
    return this._status?.type === 'success' ? 'Next steps' : 'Create your site';
  }

  renderSuccess() {
    return html`
      <div class="success-panel">
        <h2>Edit content</h2>
        <p><a href="https://da.live/edit#/${ORG}/${this._data.siteName}/nav" target="_blank">Edit main navigation</a></p>
        <p><a href="https://da.live/edit#/${ORG}/${this._data.siteName}/footer" target="_blank">Edit footer</a></p>
        <p><a href="https://da.live/#/${ORG}/${this._data.siteName}" target="_blank">View all content</a></p>
      </div>
      <div class="success-panel">
        <h2>View site</h2>
        <p><a href="https://main--${this._data.siteName}--${ORG}.aem.page" target="_blank">Visit site</a></p>
      </div>
      <p class="status ${this._status.type || 'note'}">${this._status.message}</p>
    `;
  }

  renderForm() {
    return html`
      <form>
        <div class="fieldgroup">
          <label>School name</label>
          <sl-input type="text" value="My School" name="schoolName" placeholder="Add name"></sl-input>
        </div>
        <div class="fieldgroup">
          <label>School tagline</label>
          <sl-textarea class="tagline" value="My Tagline" name="schoolTagline" resize="none" placeholder="Add tagline"></sl-textarea>
        </div>
        <div class="fieldgroup">
          <label>Principal's name</label>
          <sl-input type="text" value="Her name" name="principalName" placeholder="Enter name"></sl-input>
        </div>
        <div class="fieldgroup">
          <label>Principal's message</label>
          <sl-textarea value="Her message" class="message" resize="none" name="principalMessage" placeholder="Enter message"></sl-textarea>
        </div>
        <div class="form-footer">
          <div>
          </div>
          <div class="time-actions">
            <p>${this._time}</p>
            <sl-button ?disabled=${this._loading} @click=${this.handleSubmit}>Create site</sl-button>
          </div>
        </div>
        ${this._status ? html`<p class="status ${this._status?.type || 'note'}">${this._status?.message}</p>` : nothing}
      </form>
    `
  }

  render() {
    return html`
      <h1>${this._heading}</h1>
      ${this._status?.type === 'success' ? this.renderSuccess() : this.renderForm()}
    `;
  }
}

customElements.define('da-generator', Generator);

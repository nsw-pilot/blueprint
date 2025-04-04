const ORG = 'nsw-pilot';
const BLUEPRINT = 'blueprint';
const COPY_FROM = `/${ORG}/${BLUEPRINT}/`;
import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

async function copyContent(data) {
  const formData = new FormData();
  formData.set('destination', `/${ORG}/${data['school-name']}`);
  const res = await fetch(`https://admin.da.live/copy${COPY_FROM}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to copy content: ${res.statusText}`);
  }
}

async function createConfig(data) {
  const { token } = await DA_SDK;

  const res = await fetch(`https://admin.hlx.page/config/${ORG}/sites/${data['school-name']}.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      version: 1,
      content: {
        source: {
          url: `https://content.da.live/nsw-pilot/${data['school-name'].replaceAll(' ', '-')}/`,
          type: 'markup',
        }
      },
      extends: {
        profile: 'nsw-schools',
      }
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create config: ${res.statusText}`);
  }
}

async function replaceTemplate(data) {
  // get index
  const indexRes = await fetch(`https://admin.da.live/source/${ORG}/${data['school-name']}/index.html`);
  if (!indexRes.ok) {
    throw new Error(`Failed to fetch index.html: ${indexRes.statusText}`);
  }

  // replace template values
  const indexText = await indexRes.text();
  const templatedText = indexText
    .replaceAll('{{school name}}', data['school-name'])
    .replaceAll('{{principal name}}', data['principal-name']);

  // update index
  const formData = new FormData();
  const blob = new Blob([templatedText], { type: 'text/html' });
  formData.set('data', blob);
  const updateRes = await fetch(`https://admin.da.live/source/${ORG}/${data['school-name']}/index.html`, {
    method: 'PUT',
    body: formData,
  });
  if (!updateRes.ok) {
    throw new Error(`Failed to update index.html: ${updateRes.statusText}`);
  }
}

class ThrottledQueue {
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
    this.queue = [];
    this.isProcessing = false;
  }

  async processQueue() {
    if (this.queue.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const nextItem = this.queue.shift();
      this.callback(nextItem);
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
    this.isProcessing = false;
  }

  add(item) {
    this.queue.push(item);
    this.processQueue();
  }

  async waitForComplete() {
    while (this.queue.length > 0 || this.isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

const failed = {}
async function previewItem(url) {
  await fetch(url, { method: 'POST' }).catch((e) => { failed[url] = e; });
}

const previewQueue = new ThrottledQueue(previewItem, 200);

async function addToPreviewQueue(item, data) {
  // remove org/site
  const path = item.path.split('/').slice(3).join('/');
  const url = `https://admin.hlx.page/preview/${ORG}/${data['school-name']}/main/${path}`;
  previewQueue.add(url);
}


async function publishPages(data) {
  const { results } = crawl({ path: `/${ORG}/${data['school-name']}`, callback: (item) => addToPreviewQueue(item, data) });
  await results;
  await previewQueue.waitForComplete();

  if (Object.keys(failed).length) {
    throw new Error(`Failed to publish pages: ${JSON.stringify(failed)}`);
  }
}

export async function createSite(data, setMessage) {
  setMessage('Copying content...');
  await copyContent(data);
  setMessage('Templating content...');
  await replaceTemplate(data);
  setMessage('Creating new site config...');
  await createConfig(data);
  setMessage('Publishing pages...');
  await publishPages(data);
  setMessage(`Done! Check out your new site at https://main--${data['school-name']}--${ORG}.aem.page`);
}

import { crawl } from 'https://da.live/nx/public/utils/tree.js';
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
const { token } = await DA_SDK;

const DA_ORIGIN = 'https://admin.da.live';
const AEM_ORIGIN = 'https://admin.hlx.page';

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
};

export const ORG = 'nsw-pilot';
const BLUEPRINT = 'blueprint';
const COPY_FROM = `/${ORG}/${BLUEPRINT}/`;

function getConfig(siteName) {
  return {
    version: 1,
    content: {
      source: {
        url: `https://content.da.live/nsw-pilot/${siteName}/`,
        type: 'markup',
      }
    },
    extends: {
      profile: 'nsw-schools',
    }
  }
}

async function createConfig(data) {
  const { siteName } = data;
  const config = getConfig(siteName);

  const opts = {
    method: 'POST',
    body: JSON.stringify(config),
    headers: HEADERS,
  };

  const res = await fetch(`${AEM_ORIGIN}/config/${ORG}/sites/${data.siteName}.json`, opts);
  if (!res.ok) throw new Error(`Failed to create config: ${res.statusText}`);
}

async function replaceTemplate(data) {
  const templatePaths = ['/index.html', '/nav.html', '/footer.html'];

  await Promise.all(templatePaths.map(async (path) => {
    const daPath = `https://admin.da.live/source/${ORG}/${data.siteName}${path}`;

    // get index
    const indexRes = await fetch(daPath);
    if (!indexRes.ok) throw new Error(`Failed to fetch index.html: ${indexRes.statusText}`);

    // replace template values
    const indexText = await indexRes.text();
    const templatedText = indexText
      .replaceAll('{{name-of-school}}', data.schoolName)
      .replaceAll('{{school-tagline}}', data.schoolTagline)
      .replaceAll('{{principal-name}}', data.principalName)
      .replaceAll('{{principal-message}}', data.principalMessage);
      

    // update index
    const formData = new FormData();
    const blob = new Blob([templatedText], { type: 'text/html' });
    formData.set('data', blob);
    const updateRes = await fetch(daPath, { method: 'POST', body: formData });
    if (!updateRes.ok) {
      throw new Error(`Failed to update index.html: ${updateRes.statusText}`);
    }
  }));
}

async function previewOrPublishPages(data, action, setStatus) {
  const parent = `/${ORG}/${data.siteName}`;

  const label = action === 'preview' ? 'Previewing' : 'Publishing';

  const opts = { method: 'POST', headers: { Authorization: `Bearer ${token}` } };

  const callback = async (item) => {
    if (item.path.endsWith('.svg') || item.path.endsWith('.png') || item.path.endsWith('.jpg')) return;
    setStatus({ message: `${label}: ${item.path.replace(parent, '').replace('.html', '')}` });
    const aemPath = item.path.replace(parent, `${parent}/main`).replace('.html', '');
    const resp = await fetch(`${AEM_ORIGIN}/${action}${aemPath}`, opts);
    if (!resp.ok) throw new Error({ type: 'error', message: `Could not preview ${aemPath}` });
  }

  // Get the library
  crawl({ path: `${parent}/.da`, callback, concurrent: 5, throttle: 250 });
  const { results } = crawl({ path: parent, callback, concurrent: 5, throttle: 250 });

  await results;
}

async function copyContent(data) {
  const formData = new FormData();
  const destination = `/${ORG}/${data.siteName}`;

  formData.set('destination', `/${ORG}/${data.siteName}`);

  const opts = {  method: 'POST', body: formData };

  // TODO: Remove force delete. Copying tree doesn't seem to work
  const del = await fetch(`${DA_ORIGIN}/source${destination}`, { method: 'DELETE' });

  const res = await fetch(`${DA_ORIGIN}/copy${COPY_FROM}`, opts);

  if (!res.ok) throw new Error(`Failed to copy content: ${res.statusText}`);
}

export async function createSite(data, setStatus) {
  setStatus({ message: 'Copying content.' });
  await copyContent(data);
  setStatus({ message: 'Templating content.' });
  await replaceTemplate(data);
  setStatus({ message: 'Creating new site.' });
  await createConfig(data);
  setStatus({ message: 'Previewing pages.' });
  await previewOrPublishPages(data, 'preview', setStatus);
  setStatus({ message: 'Publishing pages.' });
  await previewOrPublishPages(data, 'live', setStatus);
  setStatus({ message: 'Done!' });
}

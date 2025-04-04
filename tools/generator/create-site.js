const ORG = 'nsw-pilot';
const BLUEPRINT = 'blueprint';
const COPY_FROM = `/${ORG}/${BLUEPRINT}/`;

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
  const res = await fetch(`https://admin.hlx.page/config/${ORG}/sites/${data['school-name']}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
  formData.set('data', templatedText);
  const updateRes = await fetch(`https://admin.da.live/source/${ORG}/${data['school-name']}/index.html`, {
    method: 'POST',
    body: formData,
  });
  if (!updateRes.ok) {
    throw new Error(`Failed to update index.html: ${updateRes.statusText}`);
  }
}

async function publishPages(data) {
  // start job
  const res = await fetch(`https://admin.hlx.page/preview/${ORG}/${data['school-name']}/main/*`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to start bulk preview job: ${res.statusText}`);
  }

  const previewDetails = await res.json();
  const job = previewDetails.job;
  const jobStatusURL = `https://admin.hlx.page/job/${ORG}/${data['school-name']}/main/${job.topic}/${job.name}`;

  // get status
  let done = false;
  do {
    const res = await fetch(jobStatusURL);
    if (!res.ok) {
      throw new Error(`Failed to fetch job status: ${res.statusText}`);
    }
    const details = await res.json();
    if (details.status === 'done') {
      done = true;
    } else if (details.status === 'failed') {
      throw new Error(`Job failed: ${details.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } while (!done);
}

export async function createSite(data) {
  await copyContent(data);
  await replaceTemplate(data);
  await createConfig(data);
  await publishPages(data);
}

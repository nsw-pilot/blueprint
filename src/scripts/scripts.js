import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  buildBlock,
  getMetadata,
  loadBlock,
  decorateBlock,
  fetchPlaceholders,
  sampleRUM,
} from './aem.js';
import { isUniversalEditorMode } from './utils.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(from, to, [...from.attributes]
    .map(({ nodeName }) => nodeName)
    .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')));
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  // eslint-disable-next-line import/no-unresolved, import/extensions
  await import('Styles/fonts.scss');
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function createPageTemplateContainer() {
  const nswContainer = document.createElement('div');
  nswContainer.classList.add('nsw-container');
  return nswContainer;
}

function createPageTemplateLayout(main) {
  const nswLayout = document.createElement('div');
  nswLayout.classList.add('nsw-layout');
  nswLayout.append(main);
  return nswLayout;
}

function createPageTemplateSidebar() {
  const aside = document.createElement('aside');
  aside.classList.add('nsw-layout__sidebar', 'nsw-layout__sidebar--desktop');
  return aside;
}

function decorateBreadcrumb(nswContainer, nswLayout) {
  const breadcrumb = buildBlock('breadcrumb', '');
  if (breadcrumb) {
    nswContainer.insertBefore(breadcrumb, nswLayout);
    decorateBlock(breadcrumb);
    loadBlock(breadcrumb);
  }
}

export function decoratePageTemplate(main) {
  const meta = getMetadata('template');
  if (meta !== 'page-template' || document.body.classList.contains('page-template-loaded')) {
    return;
  }

  document.body.classList.add('page-template-loaded');
  main.classList.add('nsw-layout__main');
  const nswContainer = createPageTemplateContainer();
  const nswLayout = createPageTemplateLayout(main);
  nswContainer.append(nswLayout);
  const aside = createPageTemplateSidebar();
  nswLayout.prepend(aside);
  document.body.insertBefore(nswContainer, document.querySelector('footer'));
  decorateBreadcrumb(nswContainer, nswLayout);
  const sidebar = buildBlock('sidebar', '');
  if (sidebar) {
    aside.appendChild(sidebar);
    decorateBlock(sidebar);
    loadBlock(sidebar);
  }
}

function decorateSearchTemplate(main) {
  const meta = getMetadata('template');
  if (meta !== 'search-template' || document.body.classList.contains('search-template-loaded')) {
    return;
  }

  document.body.classList.add('search-template-loaded');

  // find the first section inside main (the first div)
  const firstSection = main.querySelector('div') || main.appendChild(document.createElement('div'));
  if (firstSection) {
    const search = buildBlock('search', '');
    if (search) {
      firstSection.append(search);
    }
  }

  const nswContainer = createPageTemplateContainer();
  const nswLayout = createPageTemplateLayout(main);
  nswContainer.append(nswLayout);
  decorateBreadcrumb(nswContainer, nswLayout);
  document.body.insertBefore(nswContainer, document.querySelector('footer'));
}

/**
 * Decorates <ul> lists by:
 * - Wrapping them inside <div class="nsw-link-list">.
 * - Adding the class "linklist" to <ul>.
 * - Ensuring <li> contains:
 *    - <a> tag with a <span class="material-icons nsw-material-icons">east</span>.
 *    - <a> must also have additional text (excluding <span> text).
 *    - The additional text is moved inside a new <span>.
 */
// eslint-disable-next-line consistent-return
const decorateLinklist = (main) => {
  // Skip if in universal editor mode
  if (isUniversalEditorMode()) return false;

  try {
    const anchors = main.querySelectorAll('ul li a');
    const validLists = new Set();

    anchors.forEach((anchor) => {
      const span = anchor.querySelector('span.icon');

      if (span && span.dataset.icon === 'east') {
        const li = anchor.closest('li');
        const ul = li?.closest('ul');

        if (li && ul) {
          // Extract the full text inside <a> (excluding the <span> text)
          const linkText = anchor.textContent.trim().replace(span.textContent.trim(), '').trim();

          if (linkText.length > 0) {
            // Remove all existing text from <a>
            anchor.innerHTML = '';

            // Create and append new <span> for text
            const textSpan = document.createElement('span');
            textSpan.textContent = linkText;
            anchor.appendChild(textSpan);

            // Append the existing <span> (icon)
            anchor.appendChild(span);
          }

          validLists.add(ul);
        }
      }
    });

    // Add class to all valid <ul> elements and wrap in a div
    validLists.forEach((ul) => {
      ul.classList.add('linklist');

      // Check if ul is already wrapped to avoid duplicate divs
      if (!ul.parentElement.classList.contains('nsw-link-list')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'nsw-link-list';

        moveInstrumentation(ul, wrapper);

        ul.parentNode.insertBefore(wrapper, ul); // Insert wrapper before ul
        wrapper.appendChild(ul); // Move ul inside wrapper
      }
    });
  } catch (error) {
    console.error('Error in decorateLinklist:', error);
  }
};

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Applies a theme to the error page based on placeholder values.
 *
 * This function checks if the current page is an error page. If it is,
 * it fetches placeholder data and applies the corresponding error page theme
 * as a CSS class to the `<body>` element.
 *
 * @async
 * @function errorPageTheme
 */
async function decorateNotFoundTemplate(main) {
  if (!window.isErrorPage) return;
  const { errorpagetheme: theme } = await fetchPlaceholders() || {};
  if (theme) main.closest('body').classList.add(theme);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decoratePageTemplate(main);
  decorateSearchTemplate(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateLinklist(main);
  decorateNotFoundTemplate(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  // eslint-disable-next-line import/no-unresolved, import/extensions
  import('Styles/lazy.scss');
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  // skip if in test mode
  if ((typeof process !== 'undefined') && process?.env?.VITEST) {
    return;
  }

  if (window.isErrorPage) {
    sampleRUM('404', { source: document.referrer });
  }

  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

export async function fetchSearch() {
  window.searchData = window.searchData || {};
  if (Object.keys(window.searchData).length === 0) {
    const placeholders = await fetchPlaceholders();
    const path = placeholders.pagesindexurl;
    const resp = await fetch(path);
    window.searchData = JSON.parse(await resp.text()).data;
  }
  return window.searchData;
}

loadPage();

import nsw from 'nsw-design-system/dist/js/main.js';
import { getMetadata, fetchPlaceholders } from '../../scripts/aem.js';
import { loadFragment } from '../content-fragment/content-fragment.js';

import 'nsw-design-system/src/components/main-nav/_main-nav.scss';
import 'nsw-design-system/src/components/header/_header.scss';
import 'nsw-design-system/src/components/masthead/_masthead.scss';

import './header.scss';

const SEARCH_PLACEHOLDER_KEY = 'searchpagepath';

// Helper Functions
let idCounter = 0;
function generateId() {
  idCounter += 1;
  return idCounter;
}

function createMastheadSection(mastheadContent) {
  if (!mastheadContent) return '';
  return `<div class="nsw-container">${mastheadContent}</div>`;
}

function createHeaderMain(headerDom) {
  return `
    <div class="nsw-header__main">
      <div class="nsw-header__waratah">
        <a href="/">
          ${headerDom?.querySelector('picture')?.outerHTML}
          <span class="sr-only">NSW Government</span>
        </a>
      </div>
      <div class="nsw-header__name">
        <div class="nsw-header__title">${headerDom?.children?.[1]?.innerHTML}</div>
        ${headerDom.children?.[2] ? `<div class="nsw-header__subtitle">${headerDom?.children?.[2]?.innerHTML}</div>` : ''}
      </div>
    </div>
  `;
}

function createHeaderControls() {
  return `
    <div class="nsw-header__menu">
      <button type="button" class="js-open-nav" aria-expanded="false" aria-controls="main-nav">
        <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">menu</span>
        <span><span class="sr-only">Open</span> Menu</span>
      </button>
    </div>
    <div class="nsw-header__search">
      <button type="button" class="js-open-search" aria-expanded="false" aria-controls="header-search">
        <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">search</span>
        <span><span class="sr-only">Show</span> Search</span>
      </button>
    </div>
  `;
}

function createSearchArea(searchPagePath) {
  return `
    <div class="nsw-header__search-area js-search-area" id="header-search" hidden>
      <form role="search" action='${searchPagePath}'>
        <label for="nsw-header-input" class="sr-only">Search site for:</label>
        <input class="nsw-header__input js-search-input" type="text" autocomplete="off" id="nsw-header-input" name="q"/>
        <button class="nsw-icon-button nsw-icon-button--flex" type="submit" aria-controls="header-search">
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">search</span>
          <span class="sr-only">Search</span>
        </button>
      </form>
      <button class="nsw-icon-button js-close-search" aria-expanded="true" aria-controls="header-search">
        <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">close</span>
        <span class="sr-only">Close search</span>
      </button>
    </div>
  `;
}

function createHeaderSection(headerDom, searchPagePath) {
  return `
    <div class="nsw-header__container">
      <div class="nsw-header__inner">
        ${createHeaderMain(headerDom)}
        ${createHeaderControls()}
      </div>
      ${createSearchArea(searchPagePath)}
    </div>
  `;
}

// Navigation Functions
function parseNavigationList(ulElement) {
  return Array.from(ulElement.children).map((li) => {
    const anchor = li.querySelector('a');
    const item = {
      id: generateId(),
      text: anchor ? anchor.textContent.trim() : '',
      href: anchor ? anchor.href : '',
      subItems: [],
    };

    const sublist = li.querySelector('ul');
    if (sublist) {
      item.subItems = parseNavigationList(sublist);
    }

    return item;
  });
}

function parseNavigationStructure(elements) {
  const navigationArr = [];
  let currentSection = null;

  elements.forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      const anchor = el.querySelector('a');
      currentSection = {
        id: generateId(),
        title: anchor ? anchor.textContent.trim() : el.textContent.trim(),
        titleHref: anchor ? anchor.href : '',
        description: '',
        links: [],
      };
      navigationArr.push(currentSection);
    } else if (currentSection && el.tagName === 'P') {
      currentSection.description = el.textContent.trim();
    } else if (currentSection && el.tagName === 'UL') {
      currentSection.links = parseNavigationList(el);
    }
  });

  return navigationArr;
}

function createSubNavigation(subItem) {
  if (!subItem.subItems.length) return '';

  return `
    <div class="nsw-main-nav__sub-nav" role="region" aria-label="${subItem.text} Submenu" id="sub-nav-${subItem.id}">
      <div class="nsw-main-nav__header">
        <button class="nsw-icon-button nsw-icon-button--flex js-close-sub-nav" type="button" aria-expanded="true" aria-controls="sub-nav-${subItem.id}">
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">keyboard_arrow_left</span>
          <span>Back<span class="sr-only"> to previous menu</span></span>
        </button>
        <button class="nsw-icon-button js-close-nav" type="button" aria-expanded="true">
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">close</span>
          <span class="sr-only">Close Menu</span>
        </button>
      </div>
      <div class="nsw-main-nav__title">
        <a href="${subItem.href}">
          <span>${subItem.text}</span>
        </a>
      </div>
      <ul class="nsw-main-nav__sub-list">
        ${subItem.subItems.map((subChild) => `
          <li>
            <a href="${subChild.href}">
              <span>${subChild.text}</span>
            </a>
          </li>`).join('')}
      </ul>
    </div>
  `;
}

function createNavigationItem(item) {
  if (!item.links.length) {
    return `
      <li>
        ${item.titleHref ? `<a href="${item.titleHref}"><span>${item.title}</span></a>` : `<span>${item.title}</span>`}
      </li>
    `;
  }

  return `
    <li>
      <a href="${item.titleHref}" role="button" aria-expanded="false" aria-controls="sub-nav-${item.id}">
        <span>${item.title}</span>
        <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">keyboard_arrow_right</span>
      </a>
      <div class="nsw-main-nav__sub-nav" role="region" aria-label="${item.title} Submenu" id="sub-nav-${item.id}">
        <div class="nsw-main-nav__header">
          <button class="nsw-icon-button nsw-icon-button--flex js-close-sub-nav" type="button" aria-expanded="true" aria-controls="sub-nav-${item.id}">
            <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">keyboard_arrow_left</span>
            <span>Back<span class="sr-only"> to previous menu</span></span>
          </button>
          <button class="nsw-icon-button js-close-nav" type="button" aria-expanded="true">
            <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">close</span>
            <span class="sr-only">Close Menu</span>
          </button>
        </div>
        <div class="nsw-main-nav__title">
          ${item.titleHref ? `
            <a href="${item.titleHref}">
              <span>${item.title}</span>
              <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">east</span>
            </a>
          ` : `<span>${item.title}</span>`}
        </div>
        <div class="nsw-main-nav__description">${item.description || ''}</div>
        <ul class="nsw-main-nav__sub-list">
          ${item.links.map((subItem) => `
            <li>
              <a href="${subItem.href}" role="button" aria-expanded="false" aria-controls="sub-nav-${subItem.id}">
                <span>${subItem.text}</span>
                ${subItem.subItems.length ? `
                  <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">keyboard_arrow_right</span>
                ` : ''}
              </a>
              ${createSubNavigation(subItem)}
            </li>
          `).join('')}
        </ul>
      </div>
    </li>
  `;
}

function createNavigationMenu(navigationArr) {
  return `
    <nav class="nsw-main-nav js-mega-menu" id="main-nav" aria-label="Main menu">
      <div class="nsw-main-nav__header">
        <div class="nsw-main-nav__title">Menu</div>
        <button class="nsw-icon-button js-close-nav" type="button" aria-expanded="true">
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">close</span>
          <span class="sr-only">Close Menu</span>
        </button>
      </div>
      <ul class="nsw-main-nav__list">
        ${navigationArr.map(createNavigationItem).join('')}
      </ul>
    </nav>
  `;
}

function createSkipLinks() {
  return `
    <nav class="nsw-skip" aria-label="Skip to links">
      <a href="#main-nav"><span>Skip to navigation</span></a>
      <a href="#"><span>Skip to content</span></a>
    </nav>
  `;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Load navigation fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Get header sections and search path
  const headerSections = Array.from(fragment.children);
  const response = await fetchPlaceholders();
  const searchPagePath = response?.[SEARCH_PLACEHOLDER_KEY] || '/search';

  // Because the Masthead is the first section, and it is optional,
  // the amount of sections will vary between 2 and 3.
  const headerDom = headerSections.length === 3
    ? headerSections[1]?.querySelector('.default-content-wrapper')
    : headerSections[0]?.querySelector('.default-content-wrapper');

  const navDom = headerSections.length === 3
    ? headerSections[2]?.querySelector('.default-content-wrapper')
    : headerSections[1]?.querySelector('.default-content-wrapper');

  if (!navDom) return;

  // Create masthead content
  const mastheadContent = headerSections.length === 3
    ? headerSections?.[0].querySelector('p')?.innerHTML
    : '';

  // Parse navigation structure
  const navigationArr = parseNavigationStructure(Array.from(navDom.children));

  // Build header HTML
  const headerHTML = `
    ${createSkipLinks()}
    <div class="nsw-masthead">
      ${createMastheadSection(mastheadContent)}
    </div>
    <div class="nsw-header">
      ${createHeaderSection(headerDom, searchPagePath)}
    </div>
    ${createNavigationMenu(navigationArr)}
  `;

  // Update DOM and initialize components
  block.innerHTML = headerHTML;
  new nsw.Navigation(block.querySelector('#main-nav')).init();
  block.querySelectorAll('button.js-open-search, button.js-close-search').forEach((button) => {
    new nsw.SiteSearch(button).init();
  });
}

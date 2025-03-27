import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../content-fragment/content-fragment.js';

import './footer.scss';

const FOOTER_SECTIONS = {
  0: 'footer__section--school-info',
  1: 'footer__section--contact-us',
  2: 'footer__section--acknowledgement',
  3: 'footer__section--links',
};

function createFooterContainer() {
  const container = document.createElement('div');
  container.classList.add('footer__container');
  return container;
}

function decorateSection(section, sectionIndex) {
  section.classList.add('footer__section', FOOTER_SECTIONS[sectionIndex] || `footer__section--extra-${sectionIndex}`);
}

function wrapHeadingWithList(heading) {
  const ul = heading.nextElementSibling;

  if (ul && ul.tagName.toLowerCase() === 'ul') {
    const wrapper = document.createElement('div');
    wrapper.classList.add('content-group');

    heading.before(wrapper);
    wrapper.appendChild(heading);
    wrapper.appendChild(ul);
  }
}

function decorateContactSection(footer) {
  const contactWrapper = footer.querySelector('.footer__section--contact-us .default-content-wrapper');
  if (!contactWrapper) return;

  const headings = contactWrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(wrapHeadingWithList);
}

function modifyLastSection(footer) {
  const lastSection = footer.lastElementChild;
  if (!lastSection) return;

  // Find all <p> tags inside the last section
  const paragraphs = lastSection.querySelectorAll('p');
  if (paragraphs.length < 2) return; // Ensure there are at least 2 <p> tags

  const firstP = paragraphs[0];
  const secondP = paragraphs[1];

  // Create an <a> tag
  const link = document.createElement('a');
  link.classList.add('footer__logo-cta');
  link.href = secondP.textContent.trim(); // Set href from the second <p> text
  link.append(...firstP.childNodes); // Move contents of the first <p> inside <a>

  // Replace the first <p> with the <a> tag
  firstP.replaceWith(link);

  // Remove the second <p> tag
  secondP.remove();
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // Create and populate footer container
  const footer = createFooterContainer();
  let sectionIndex = 0;

  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    decorateSection(section, sectionIndex);
    footer.append(section);
    sectionIndex += 1;
  }

  // Ensure last section gets decorated
  if (footer.lastElementChild) {
    decorateSection(footer.lastElementChild, sectionIndex);
    modifyLastSection(footer);
  }

  // Decorate contact section
  decorateContactSection(footer);

  // Update block content
  block.textContent = '';
  block.append(footer);
}

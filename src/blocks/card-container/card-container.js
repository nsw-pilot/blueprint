import 'nsw-design-system/src/components/card/_card.scss';
import './card-container.css';
import {
  ul as ulElem,
  li as liElem,
  div as divElem,
  span as spanElem,
  moveChildrenTo,
} from '../../scripts/dom-helpers.js';

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const CardClasses = {
  highlight: 'nsw-card--highlight',
  dark: 'nsw-card--dark',
  light: 'nsw-card--light',
  horizontal: 'nsw-card--horizontal',
};

function decorateImageColumn(imageColumn) {
  // Make the first column the image container if there is an image
  if (imageColumn.querySelector('picture')) {
    imageColumn.className = 'nsw-card__image';
  }
}

function decorateHeadlineColumn(headlineColumn) {
  // the Second column always has a headline
  headlineColumn.classList.add('nsw-card__content');

  const titleWrapper = divElem({ class: 'nsw-card__title' });

  // move the children of the second column to the titleWrapper
  moveChildrenTo(headlineColumn, titleWrapper);

  // remove the button wrapper around the <a> tag
  const a = titleWrapper.querySelector('a');
  if (a) {
    const p = a.closest('p');
    if (p) {
      p.replaceWith(a);
      a.classList.remove('button');
    }
  }

  headlineColumn.append(titleWrapper);
}

function decorateTextColumn(textColumn, headlineColumn) {
  // ===== Column (3) - Copy text (optional) =====
  if (textColumn.innerHTML.trim()) {
    textColumn.classList.add('nsw-card__copy');

    // insert inside the third div
    headlineColumn.append(textColumn);
  } else {
    // remove the third column if empty
    textColumn.remove();
  }
}

function addArrowIcon(headlineColumn) {
  // Add the arrow icon to indicate that the card is clickable
  const span = spanElem({
    class: 'material-icons nsw-material-icons',
    'aria-hidden': 'true',
    focusable: 'false',
  }, 'east');

  headlineColumn.append(span);
}

function addCardVariationClasses(block, cardContainer) {
  // add variation classes
  Object.keys(CardClasses).forEach((key) => {
    if (block.classList.contains(key)) {
      cardContainer.classList.add(CardClasses[key]);
    }
  });

  if (!cardContainer.querySelector('.nsw-card__copy')) {
    cardContainer.classList.add('nsw-card--headline');
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = ulElem({ class: 'nsw-grid' });

  [...block.children].forEach((card) => {
    const cardContainer = divElem({ class: 'nsw-card' });
    moveChildrenTo(card, cardContainer);

    // check if the page is page-template
    const cardLayout = document.querySelector('.page-template') ? 'nsw-col nsw-col-md-6 nsw-col-lg-6' : 'nsw-col nsw-col-md-6 nsw-col-lg-4';

    const gridItem = liElem({ class: cardLayout }, cardContainer);
    moveInstrumentation(card, gridItem);

    const [imageColumn, headlineColumn, textColumn] = cardContainer.children;

    decorateImageColumn(imageColumn);

    decorateHeadlineColumn(headlineColumn);

    decorateTextColumn(textColumn, headlineColumn);

    addArrowIcon(headlineColumn);

    addCardVariationClasses(block, cardContainer);

    ul.append(gridItem);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}

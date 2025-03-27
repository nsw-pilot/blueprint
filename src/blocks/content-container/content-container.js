import 'nsw-design-system/src/components/content-block/_content-block.scss';
import './content-container.scss';
import { div as divElem } from '../../scripts/dom-helpers.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

function decorateImageColumn(imageColumn) {
  // Make the first column the image container if there is an image
  if (imageColumn.querySelector('picture')) {
    imageColumn.className = 'nsw-content-block__image';
  }
}

function decorateTextColumn(textColumn) {
  textColumn.classList.add('nsw-content-block__content');
  [...textColumn.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName)) {
      child.classList.add('nsw-content-block__title');
    } else if (child.tagName === 'P') {
      const hasAnchorTag = child.querySelector('a') !== null;
      if (hasAnchorTag) {
        child.classList.add('nsw-content-block__link');
      } else {
        child.classList.add('nsw-content-block__copy');
      }
    }
  });
}

export default function decorate(block) {
  const grid = divElem({ class: 'nsw-grid' });
  [...block.children].forEach((contentBlock) => {
    contentBlock.classList.add('nsw-col', 'nsw-col-md-6', 'nsw-col-lg-4');
    const [imageColumn, textColumn] = contentBlock.children;
    decorateImageColumn(imageColumn);
    decorateTextColumn(textColumn);
    grid.append(contentBlock);
  });
  grid.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(grid);
}

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import 'nsw-design-system/src/components/card/_card.scss';
import './hero-banner.scss';

// TODO: Use the card styling for the hero content, rather than rebuilding
// the same styles.
const CUSTOM_CLASSES = {
  content: {
    0: 'nsw-card__title',
    1: 'nsw-card__copy',
  },
  image: {
    0: 'hero__image__desktop',
    1: 'hero__image__mobile',
  },
};

function createWrapper(className) {
  const wrapper = document.createElement('div');
  wrapper.classList.add(className);
  return wrapper;
}

/**
 * Creates a card wrapper with predefined classes.
 * @returns {object} An object containing `cardWrapper` and `cardContentWrapper`.
 */
function createCardWrapper() {
  const cardWrapper = createWrapper('nsw-card');
  cardWrapper.classList.add('nsw-card--highlight');

  const cardContentWrapper = createWrapper('nsw-card__content');
  return { cardWrapper, cardContentWrapper };
}

function handleTitle(titleRow, bodyWrapper) {
  const titleColumn = titleRow.firstElementChild;
  if (!titleColumn) return;

  titleColumn.classList.add(CUSTOM_CLASSES.content[0]);
  const anchor = titleRow.querySelector('a');
  const redirectUrl = anchor?.getAttribute('href') || '';

  if (redirectUrl === '#' || redirectUrl === '') {
    const titleEl = document.createElement('h4');
    titleEl.innerHTML = anchor?.innerHTML || '';
    moveInstrumentation(anchor, titleEl);
    bodyWrapper.appendChild(titleEl);
  } else {
    bodyWrapper.appendChild(titleColumn);
  }
}

function handleDescription(descriptionRow, bodyWrapper) {
  const descriptionColumn = descriptionRow.firstElementChild;
  if (!descriptionColumn) return;
  moveInstrumentation(descriptionRow.querySelector('p'), descriptionColumn);
  descriptionColumn.classList.add(CUSTOM_CLASSES.content[1]);
  bodyWrapper.appendChild(descriptionColumn);
}

function processImages(heroImage) {
  const imageWrapper = createWrapper('hero__image');
  const paragraphs = [...heroImage.querySelectorAll('p')];
  const pictures = [...heroImage.querySelectorAll('picture')];

  // Handle alt text (text after the last picture)
  const hasTextParagraph = paragraphs.length > 2
    || (paragraphs.length === 2 && !paragraphs.every((p) => p.querySelector('picture')));
  const lastParagraph = hasTextParagraph ? paragraphs.at(-1) : null;
  const altText = lastParagraph?.innerText.trim() || '';

  if (altText) {
    pictures.forEach((picture) => {
      picture.querySelector('img')?.setAttribute('alt', altText);
    });
    lastParagraph.remove();
  }

  // Add appropriate classes to pictures
  if (pictures.length === 2) {
    pictures.forEach((pic, i) => pic.parentNode.classList.add(CUSTOM_CLASSES.image[i], 'hero-banner-image'));
  } else if (pictures.length === 1) {
    pictures[0].parentNode.classList.add('hero-banner-image');
  }

  imageWrapper.append(...heroImage.childNodes);
  return imageWrapper;
}

function addArrowIcon(bodyWrapper) {
  const anchorTag = bodyWrapper.querySelector('a');
  if (!anchorTag?.textContent?.trim()) return;

  const iconSpan = document.createElement('span');
  iconSpan.className = 'material-icons nsw-material-icons';
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.setAttribute('focusable', 'false');
  iconSpan.textContent = 'east';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'icon';
  iconDiv.appendChild(iconSpan);
  bodyWrapper.appendChild(iconDiv);
  bodyWrapper.classList.add('hero__content--with-link');
}

export default function decorate(block) {
  const bodyWrapper = createWrapper('hero__content');
  const blockRows = Array.from(block.children);
  const { cardWrapper, cardContentWrapper } = createCardWrapper();

  // Process content (first two rows)
  handleTitle(blockRows[0], cardContentWrapper);
  handleDescription(blockRows[1], cardContentWrapper);

  // Process images (third row)
  const imageWrapper = processImages(blockRows[2]);
  imageWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false);
    img.closest('picture').replaceWith(optimizedPic);
  });
  // Add arrow icon if needed
  addArrowIcon(cardContentWrapper);

  // Replace block content
  block.innerHTML = '';
  cardWrapper.appendChild(cardContentWrapper);
  bodyWrapper.appendChild(cardWrapper);
  block.append(bodyWrapper, imageWrapper);
  const heroContent = block.querySelector('.hero__content');

  if (heroContent) {
    let resizeObserver;
    let updateCount = 0;
    let lastUpdateTime = 0;

    const updateHeight = () => {
      const currentTime = performance.now();

      // If updates are happening too frequently, stop observing
      if (updateCount > 1000) {
        // eslint-disable-next-line no-console
        console.warn('Hero content height update is being called too frequently');
        resizeObserver.disconnect();
        return;
      }

      // Check if update is happening too quickly
      if (currentTime - lastUpdateTime < 100) {
        updateCount += 1;
      } else {
        // Reset update tracking if it's been more than 100ms
        updateCount = 1;
      }

      lastUpdateTime = currentTime;

      const height = heroContent.offsetHeight;
      document.documentElement.style.setProperty('--hero-content-height', `${height / 2}px`);
    };

    resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(heroContent);

    // Initial height update after 100ms
    setTimeout(updateHeight, 100);
  }
}

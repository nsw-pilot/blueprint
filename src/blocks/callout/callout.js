import 'nsw-design-system/src/components/callout/_callout.scss';
import './callout.scss';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('nsw-callout');

  const content = document.createElement('div');
  content.className = 'nsw-callout__content';

  const [titleRow, descriptionRow] = Array.from(block.children);

  const [titleColumn, descriptionColumn] = [titleRow, descriptionRow].map((row) => row.children[0]);

  Array.from(titleColumn.children).forEach((titleChild) => {
    if (titleChild.nodeType === 1) {
      titleChild.classList.add('nsw-h4');
      moveInstrumentation(titleColumn, titleChild);
    }

    content.append(titleChild);
  });

  titleRow.remove();

  Array.from(descriptionColumn.children).forEach((descriptionChild) => {
    if (descriptionChild.nodeType === 1) {
      moveInstrumentation(descriptionColumn, descriptionChild);
    }

    content.append(descriptionChild);
  });

  descriptionRow.remove();

  block.append(content);
}

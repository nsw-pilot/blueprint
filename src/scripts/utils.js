/**
 * Checks if the current window is running in Universal Editor mode.
 *
 * @returns {boolean} - Returns `true` if both strings are found in the URL, otherwise `false`.
 */

import { IS_AUTHOR_MODE } from './constants.js';

// eslint-disable-next-line import/prefer-default-export
export const isUniversalEditorMode = () => {
  // Check if the current environment is author mode
  if (!IS_AUTHOR_MODE) return false;

  try {
    if (window.self !== window.top) { // Ensure running inside an iframe
      const parentUrl = window.top.location.href;
      return parentUrl.includes('ui#') && parentUrl.includes('universal-editor');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking Universal Editor mode: Possible cross-origin issue.', error);
  }
  return false;
};

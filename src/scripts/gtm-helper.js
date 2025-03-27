/* eslint-disable import/prefer-default-export */
import { fetchPlaceholders } from './aem.js';
import { IS_AUTHOR_MODE } from './constants.js';

// Constants for placeholder keys
const PLACEHOLDER_KEYS = {
  GTM_ID: 'gtmid',
  GTM_AUTH_PARAMS: 'gtmauthparams',
  GTM_URL: 'gtmurl',
};

// Default GTM URL if not provided in placeholders
const DEFAULT_GTM_IFRAME_URL = 'https://www.googletagmanager.com/ns.html';
const DEFAULT_GTM_SCRIPT_URL = 'https://www.googletagmanager.com/gtm.js';

// Configuration object
const gtmConfig = { data: null };

/**
 * Creates the GTM initialization script
 * @param {string} gtmId - The GTM ID
 * @param {string} gtmScriptUrl - The GTM script URL
 * @param {string} authParams - Optional authentication parameters
 * @returns {string} The GTM script as a string
 */
function getGtmScript(gtmId, gtmScriptUrl, authParams = '') {
  return `
    (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); 
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l !== 'dataLayer' ? '&l=' + l : ''; 
        j.async = true;
        j.src = '${(`${gtmScriptUrl}/gtm.js`) || DEFAULT_GTM_SCRIPT_URL}?id=' + i + dl + '${authParams}';
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', '${gtmId}');
  `;
}

/**
 * Inserts a noscript fallback for GTM
 * @param {string} gtmId - The GTM ID
 * @param {string} gtmUrl - The GTM script URL
 * @param {string} authParams - Optional authentication parameters
 */
function insertGtmNoscriptFallback(gtmId, gtmUrl, authParams = '') {
  const noscriptTag = document.createElement('noscript');
  const iframe = document.createElement('iframe');

  iframe.setAttribute(
    'src',
    `${`${gtmUrl}/ns.html` || DEFAULT_GTM_IFRAME_URL}?id=${gtmId}${authParams}`,
  );
  iframe.setAttribute('height', '0');
  iframe.setAttribute('width', '0');
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';

  noscriptTag.appendChild(iframe);
  document.body.insertAdjacentElement('afterbegin', noscriptTag);
}

/**
 * Loads Google Tag Manager using configuration from placeholders
 */
// eslint-disable-next-line consistent-return
export const loadGTM = async () => {
  // Skip GTM loading in author mode
  if (IS_AUTHOR_MODE) return false;
  try {
    // Load placeholder data if not already loaded
    if (!gtmConfig.data) {
      gtmConfig.data = await fetchPlaceholders();
    }

    // Extract GTM configuration values
    const gtmId = gtmConfig.data[PLACEHOLDER_KEYS.GTM_ID];
    const authParams = gtmConfig.data[PLACEHOLDER_KEYS.GTM_AUTH_PARAMS] || '';
    const gtmUrl = gtmConfig.data[PLACEHOLDER_KEYS.GTM_URL] || DEFAULT_GTM_SCRIPT_URL;

    // Exit if no GTM ID is provided
    if (!gtmId) {
      // eslint-disable-next-line no-console
      console.info('GTM ID not provided, skipping GTM initialization');
      // eslint-disable-next-line consistent-return
      return;
    }

    // Insert GTM script
    const script = document.createElement('script');
    script.textContent = getGtmScript(gtmId, gtmUrl, authParams);
    document.head.appendChild(script);

    // Insert noscript fallback
    insertGtmNoscriptFallback(gtmId, gtmUrl, authParams);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load GTM:', error);
  }
};

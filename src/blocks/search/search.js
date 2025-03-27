import 'nsw-design-system/src/components/list-item/_list-item.scss';
import 'nsw-design-system/src/components/form/_form.scss';
import './search.css';

import { fetchPlaceholders } from '../../scripts/aem.js';

// render the search results block
async function renderSearchBlock(block, parameter) {
  const placeholders = await fetchPlaceholders();
  let url = placeholders.searchurl;
  if (parameter !== '') {
    url += `&query=+${parameter}`;
  }
  let searchResultContent = '<ol>';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results.length === 0) {
      const noResult = `<div class="nsw-results-bar__info">Sorry, no results found for your search</div>
      <div class="error-message">
        <h4>Didn’t find what you were looking for?</h4>
        <ul>
          <li>Try using different or fewer keywords </li>
          <li>Check your spelling</li>
          <li>Try broader or general search terms</li>
        </ul>
      </div>
      <div class="error-message">
        <h4>Contact us</h4>
        <p>Call 13 33 33 to find your local office or email <a href="mailto:help@customerservice.nsw.gov.au">help@customerservice.nsw.gov.au</a>. </p>
      </div>
      `;
      block.querySelector('.nsw-search-results').innerHTML = noResult;
      return;
    }
    data.results.forEach((element) => {
      searchResultContent += `<li class='nsw-list-item'>
                        <div class="nsw-list-item__content">
                          <div class="nsw-list-item__title"><a href='${element.url}'>${element.title}</a></div>
                          <div class="nsw-list-item__link">${element.url}</div>
                          <div class="nsw-list-item__copy">${element.content}</div>
                        </div>
                      </li>`;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error);
  }
  searchResultContent += '</ol>';

  block.querySelector('.nsw-search-results').innerHTML = searchResultContent;
}

/**
 * loads and decorates the search
 * @param {Element} block The search block element
 */
export default async function decorate(block) {
  const container = document.createElement('div');
  container.classList = 'searchlist-container';

  // read searchparameter from the url
  const params = new URL(window.location.href).searchParams;
  const searchParams = params.get('q')?.trim() || '';

  const newFormDiv = `
            <h1> Search </h1>
          <form id="searchForm"><div class="nsw-form__input-group">
          
            <label class="sr-only" for="search-input">Search</label>
            <input class="nsw-form__input" type="text" id="searchInput" name="search-input" value="${searchParams}">
            <button class="nsw-button nsw-button--dark nsw-button--flex" type="submit">Search</button>
          
          </div> </form>
          <div class="nsw-search-results">
          </div>`;

  container.innerHTML = newFormDiv;
  block.append(container);

  // bind the onclick event for form submit
  document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value;
    renderSearchBlock(block, searchTerm);
  });

  renderSearchBlock(block, searchParams);
}

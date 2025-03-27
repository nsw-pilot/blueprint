import Breadcrumbs from 'nsw-design-system/src/components/breadcrumbs/breadcrumbs.js';
import { fetchSearch } from '../../scripts/scripts.js';
import 'nsw-design-system/src/components/breadcrumbs/_breadcrumbs.scss';
import './breadcrumb.scss';

export default async function decorate(block) {
  // Fetch all pages (e.g. pages with their paths and titles)
  const allSitePages = await fetchSearch();

  // Remove leading/trailing slashes from pathname and split into segments.
  // For example, '/hello/world/' becomes ['hello', 'world']
  const cleanedPath = window.location.pathname.replace('^/(.*?)/?$', '$1');
  const pathSegments = cleanedPath.split('/');
  const { origin } = window.location;

  // Initialize variables for building breadcrumb links.
  let accumulatedPath = '';
  let segmentIndex = 1;
  const breadcrumbList = document.createElement('ol');

  pathSegments.forEach((segment) => {
    accumulatedPath += segment;
    const listItem = document.createElement('li');

    // Special handling of the homepage
    if (!accumulatedPath) {
      listItem.innerHTML = `<a href='${origin}' title='Home'>Home</a>`;
      breadcrumbList.append(listItem);
    } else {
      const matchingPages = allSitePages.filter((item) => item.path === accumulatedPath);

      if (matchingPages && matchingPages.length === 1) {
        segmentIndex += 1;
        const pageInfo = matchingPages[0];
        // Use navTitle if available, otherwise fall back to the title.
        const label = pageInfo.navTitle || pageInfo.title;
        const linkElement = document.createElement('a');

        // Set up the link attributes and text.
        linkElement.className = 'breadcrumb';
        linkElement.title = label;
        linkElement.textContent = label;

        // If this is the last segment, mark it as the current page.
        if (pathSegments.length === segmentIndex) {
          linkElement.classList = 'current';
          linkElement.setAttribute('aria-current', 'page');
        } else {
          linkElement.href = origin + accumulatedPath;
        }

        // Append the link to the list item.
        listItem.append(linkElement);
        breadcrumbList.append(listItem);
      }
    }

    // Append a trailing slash for the next iteration's path accumulation.
    accumulatedPath += '/';
  });

  // Create a <nav> element to wrap the breadcrumbs, for accessibility and styling.
  const navEle = document.createElement('nav');
  navEle.className = 'nsw-breadcrumbs js-breadcrumbs';
  navEle.setAttribute('aria-label', 'Breadcrumbs');
  navEle.appendChild(breadcrumbList);
  block.innerHTML = navEle.outerHTML;
  const breadcrumbs = block.querySelectorAll('.js-breadcrumbs');
  if (breadcrumbs) {
    breadcrumbs.forEach((element) => {
      new Breadcrumbs(element).init();
    });
  }
}

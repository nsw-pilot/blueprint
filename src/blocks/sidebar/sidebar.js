import { fetchSearch } from '../../scripts/scripts.js';
import 'nsw-design-system/src/components/side-nav/_side-nav.scss';
import './sidebar.scss';
import { fetchPlaceholders } from '../../scripts/aem.js';
import { IS_AUTHOR_MODE } from '../../scripts/constants.js';

let IS_CHILD_PAGE = false;

let CURRENT_PATH = window.location.pathname;

function getPageTitle(indexPage) {
  return indexPage.title || indexPage.navTitle;
}

function buildNavMenu(pages, basePath) {
  const activePath = window.location.pathname;

  // Extract segments for base and active paths
  const baseSegments = basePath.split('/').filter(Boolean);
  const activeSegments = activePath.split('/').filter(Boolean);

  const isBasePage = activeSegments.length === baseSegments.length;
  const isChildPage = activeSegments.length > baseSegments.length;

  let menu = {};

  if (isBasePage) {
    // Case 1: User is on the base page
    const topLevelPages = pages.filter(({ path }) => path.split('/').filter(Boolean).length === 1);
    const basePageEntry = pages.find(({ path }) => path === basePath);
    const baseChildren = pages.filter(({ path }) => {
      const childSegments = path.split('/').filter(Boolean);
      return (
        childSegments.length === baseSegments.length + 1
        && path.startsWith(basePath)
        && path !== basePath
      );
    });

    // Add top-level pages
    topLevelPages.forEach((page) => {
      const { path } = page;
      const navTitle = getPageTitle(page);
      menu[navTitle] = {
        path,
        title: navTitle,
        children: {},
        isActive: activePath.startsWith(path),
      };
    });

    // Add base page and its direct children
    if (basePageEntry) {
      baseChildren.forEach((page) => {
        const { path } = page;
        const navTitle = getPageTitle(page);
        menu[getPageTitle(basePageEntry)].children[navTitle] = {
          path,
          title: navTitle,
          children: {},
          isActive: activePath.startsWith(path),
        };
      });
    }
  } else if (isChildPage) {
    // Case 2: User is inside a child/sub-child of the base page
    menu = {};

    // Get all children and sub-children of the base page
    const allChildren = pages.filter(({ path }) => path.startsWith(basePath) && path !== basePath);

    allChildren.forEach((page) => {
      const { path } = page;
      const navTitle = getPageTitle(page);
      const parts = path.replace(basePath, '').split('/').filter(Boolean);
      let currentLevel = menu;

      parts.forEach((part) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            path,
            title: navTitle || part,
            children: {},
            isActive: activePath.startsWith(path),
          };
        }
        currentLevel = currentLevel[part].children;
      });
    });
  }

  return menu;
}

function isAncestorCheck(children, currentPath) {
  return Object.values(children).some((item) => {
    const itemPathArr = item.path.split('/');
    let ancestorPath = item.path;

    if (itemPathArr.length > 2) {
      ancestorPath = itemPathArr.slice(1, 3).join('/');
    }
    return currentPath.includes(ancestorPath);
  });
}

function createNavElement(menu, parentElement) {
  const ul = document.createElement('ul');

  Object.values(menu).forEach(({ path, title, children }) => {
    const hasChildren = children && Object.keys(children).length;
    const li = document.createElement('li');
    const a = Object.assign(document.createElement('a'), { href: path, textContent: title });

    // Highlight the current active page
    if (CURRENT_PATH === path) a.classList.add('current');

    // Expand the menu if the current page is under this path
    if (hasChildren && CURRENT_PATH.startsWith(path)) li.classList.add('active');

    li.appendChild(a);

    // If the menu item has children, recursively create sub-navigation
    if (hasChildren) {
      const shouldRenderChildren = !IS_CHILD_PAGE || isAncestorCheck(children, CURRENT_PATH);
      if (shouldRenderChildren) {
        createNavElement(children, li);
      }
    }

    ul.appendChild(li);
  });

  parentElement.appendChild(ul);
}

export default async function decorate(block) {
  const allPages = await fetchSearch(); // Fetch dynamic navigation data

  if (IS_AUTHOR_MODE) {
    const response = await fetchPlaceholders();
    const baseSiteUrl = response?.basesiteurl;
    if (baseSiteUrl) {
      CURRENT_PATH = CURRENT_PATH.split(baseSiteUrl)?.[1];
    } else {
      const getCurrentPath = (inputPath) => {
        const validBasePaths = allPages
          .map((item) => item.path)
          .filter((path) => path.split('/').length === 2);
        // Remove `.html` extension from the input path
        const cleanedPath = inputPath.replace(/\.html$/, '');

        // Split the cleaned path into parts using '/'
        const pathParts = cleanedPath.split('/');

        // Iterate through the path segments to find the first matching base path
        for (let i = 1; i < pathParts.length; i += 1) {
          const potentialBasePath = `/${pathParts[i]}`;

          // If a valid base path is found, return everything from that point onward
          if (validBasePaths.includes(potentialBasePath)) {
            return cleanedPath.substring(cleanedPath.indexOf(potentialBasePath));
          }
        }

        return '';
      };
      CURRENT_PATH = getCurrentPath(CURRENT_PATH);
    }
  }
  const basePath = `/${CURRENT_PATH.split('/').filter(Boolean)[0] || ''}`; // Extract base path

  // Create the main navigation container
  const navContainer = document.createElement('nav');
  navContainer.className = 'nsw-side-nav';
  navContainer.setAttribute('aria-labelledby', 'dynamic-nav');

  const isBasePage = CURRENT_PATH === basePath;

  // Case 2: Show Header only when the user is inside a child page
  if (!isBasePage) {
    const header = document.createElement('div');
    header.className = 'nsw-side-nav__header';
    header.id = 'dynamic-nav';

    const baseItem = allPages.find(({ path }) => path === basePath);
    if (baseItem) {
      const baseLink = Object.assign(document.createElement('a'), {
        href: baseItem.path,
        textContent: getPageTitle(baseItem),
      });

      const backIcon = document.createElement('span');
      backIcon.className = 'material-icons nsw-material-icons';
      backIcon.setAttribute('focusable', 'false');
      backIcon.setAttribute('aria-hidden', 'true');
      backIcon.textContent = 'west';

      baseLink.prepend(backIcon); // Insert backIcon inside the anchor
      header.appendChild(baseLink);
    }

    navContainer.appendChild(header);
  }

  // Build navigation menu based on current page
  let menu;

  if (isBasePage) {
    // Case 1: When base page is the current page
    menu = buildNavMenu(allPages, basePath);

    // Ensure Home (`'/'`) appears at the top (as a sibling)
    const homeItem = allPages.find(({ path }) => path === '/');
    if (homeItem) {
      createNavElement({ Home: { path: '/', title: 'Home', children: {} } }, navContainer);
    }

    createNavElement(menu, navContainer);
  } else {
    // Case 2: When inside a child page
    IS_CHILD_PAGE = true;
    menu = buildNavMenu(allPages, basePath);
    createNavElement(menu, navContainer);
  }

  // Append navigation to block
  block.textContent = '';
  block.appendChild(navContainer);
}

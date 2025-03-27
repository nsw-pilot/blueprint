export function parseHTML(htmlString) {
  return new DOMParser().parseFromString(htmlString, 'text/html').body.firstChild;
}

export function normalizeDOM(node) {
  if (!node) return null;

  // Clone to avoid modifying original DOM
  const clone = node.cloneNode(true);

  // Recursively trim text nodes
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null);
  for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) {
    textNode.nodeValue = textNode.nodeValue.trim();
  }

  // Sort attributes to ensure they are compared in the same order
  function sortAttributes(el) {
    if (el.nodeType === 1) {
      const attrs = Array.from(el.attributes)
        .sort((a, b) => a.name.localeCompare(b.name));

      // Remove all attributes and re-add them in sorted order
      attrs.forEach((attr) => el.removeAttribute(attr.name));
      attrs.forEach((attr) => el.setAttribute(attr.name, attr.value.trim()));
    }
    Array.from(el.children).forEach(sortAttributes);
  }

  sortAttributes(clone);

  return clone;
}

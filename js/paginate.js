/**
 * paginate.js
 * -----------
 * A tiny, generic "flow content across A4 pages" engine.
 *
 * Why this exists: the assignment PDFs show a real footer with
 * "Page X of Y" and the number of pages changes depending on how
 * much data is on the form (more expense rows / longer comments =
 * more pages). Hard-coding "page 1 of 3" would not be dynamic, so
 * instead we:
 *   1. Build the form content as an array of DOM "blocks"
 *      (one block per section / table / paragraph).
 *   2. Render those blocks off-screen once to measure their real
 *      heights (fonts, wrapping, etc. all affect this).
 *   3. Walk through the blocks, packing them onto pages until a
 *      page is full, then starting a new page.
 *   4. Render the final pages with a header (page 1 only) and a
 *      footer (every page) that reports the real page count.
 *
 * This is intentionally framework-free so it is easy to read in
 * the code walkthrough part of the demo video.
 */

function paginateDocument({
  mountEl,          // element to render the finished pages into
  blocks,           // array of already-built DOM elements (content only)
  buildHeader,      // () => DOM element, rendered on page 1 only
  buildFooter,      // (pageNumber, totalPages) => DOM element, rendered on every page
}) {
  // ---- 1. Build a hidden page (off-screen) to measure against ----
  const hidden = document.createElement('div');
  hidden.className = 'page';
  hidden.style.position = 'fixed';
  hidden.style.left = '-99999px';
  hidden.style.top = '0';
  hidden.style.visibility = 'hidden';
  document.body.appendChild(hidden);

// Full page height, including the page's padding.
const PAGE_HEIGHT = hidden.getBoundingClientRect().height;

// The CSS page has 12mm top padding and 16mm bottom padding.
// Remove those areas from the usable content height.
const styles = getComputedStyle(hidden);
const paddingTop = parseFloat(styles.paddingTop) || 0;
const paddingBottom = parseFloat(styles.paddingBottom) || 0;

const CONTENT_HEIGHT = PAGE_HEIGHT - paddingTop - paddingBottom;

// Header height (page 1 only)
const headerEl = buildHeader();
hidden.appendChild(headerEl);
const headerHeight = headerEl.getBoundingClientRect().height;
hidden.removeChild(headerEl);

// Footer height
const sampleFooter = buildFooter(1, 1);
hidden.appendChild(sampleFooter);
const footerHeight = sampleFooter.getBoundingClientRect().height;
hidden.removeChild(sampleFooter);

// Safety gap so content doesn't touch the footer.
const SAFETY = 48;

const firstPageBudget =
  CONTENT_HEIGHT - headerHeight - footerHeight - SAFETY;

const otherPageBudget =
  CONTENT_HEIGHT - footerHeight - SAFETY;



  // ---- 2. Measure every block's real rendered height ----
  const measureWrap = document.createElement('div');
  measureWrap.className = 'page-content';
  hidden.appendChild(measureWrap);
  const heights = blocks.map((block) => {
  measureWrap.appendChild(block);

  const rect = block.getBoundingClientRect();
  const styles = getComputedStyle(block);

  const marginTop = parseFloat(styles.marginTop) || 0;
  const marginBottom = parseFloat(styles.marginBottom) || 0;

  const h = rect.height + marginTop + marginBottom;

  measureWrap.removeChild(block);
  return h;
});

  hidden.remove();

  // ---- 3. Pack blocks onto pages ----
  const pages = []; // array of arrays-of-blocks
  let current = [];
  let used = 0;
  let budget = firstPageBudget;

  blocks.forEach((block, i) => {
    const h = heights[i];
    if (current.length > 0 && used + h > budget) {
      pages.push(current);
      current = [];
      used = 0;
      budget = otherPageBudget;
    }
    current.push(block);
    used += h;
  });
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([]);

  // ---- 4. Render the real pages ----
  mountEl.innerHTML = '';
  const totalPages = pages.length;

  pages.forEach((pageBlocks, idx) => {
    const pageEl = document.createElement('div');
    pageEl.className = 'page';

    if (idx === 0) {
      pageEl.appendChild(buildHeader());
    }

    const contentEl = document.createElement('div');
    contentEl.className = 'page-content';
    pageBlocks.forEach((b) => contentEl.appendChild(b));
    pageEl.appendChild(contentEl);

    pageEl.appendChild(buildFooter(idx + 1, totalPages));
    mountEl.appendChild(pageEl);
  });

  return totalPages;
}

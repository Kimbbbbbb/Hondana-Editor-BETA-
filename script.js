const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const alignToggleBtn = document.getElementById('alignToggleBtn');
const alignMenu = document.getElementById('alignMenu');
const fontSizeToggleBtn = document.getElementById('fontSizeToggleBtn');
const fontSizeMenu = document.getElementById('fontSizeMenu');
const fontStyleBtn = document.getElementById('fontStyleBtn');
const fontStyleMenu = document.getElementById('fontStyleMenu');
const fontStyleInput = document.getElementById('fontStyleInput');
const fontStyleApplyBtn = document.getElementById('fontStyleApplyBtn');
const highlightBtn = document.getElementById('highlightBtn');
const highlightMenu = document.getElementById('highlightMenu');
const textColorBtn = document.getElementById('textColorBtn');
const textColorMenu = document.getElementById('textColorMenu');
const newPageBtn = document.getElementById('newPageBtn');
const saveWorkBtn = document.getElementById('saveWorkBtn');
const loadWorkBtn = document.getElementById('loadWorkBtn');
const loadWorkInput = document.getElementById('loadWorkInput');
const deleteCurrentPageBtn = document.getElementById('deleteCurrentPageBtn');
const toggleRibbonBtn = document.getElementById('toggleRibbonBtn');
const pages = document.getElementById('pages');
const PAGE_HEIGHT = 900;

const highlightColors = [
  '#FFFF00', '#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4',
  '#DA70D6', '#BA55D3', '#9370DB', '#6495ED', '#4169E1', '#00CED1',
  '#00FA9A', '#00FF7F', '#90EE90', '#ADFF2F', '#F0E68C', '#FFB6C1',
  '#FFC0CB', '#DDA0DD', '#EE82EE', '#DEB887', '#D2B48C', '#F5DEB3'
];

const fontFamilies = [
  'Arial',
  'Georgia',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Trebuchet MS',
  'Palatino Linotype',
  'Tahoma',
  'Impact',
  'Comic Sans MS',
  'Arial Black',
  'Brush Script MT',
  'Garamond',
  'Segoe UI',
  'Lucida Console'
];

const textColors = [
  '#000000',
  '#ff0000',
  '#0000ff',
  '#008000',
  '#800080',
  '#ff8c00',
  '#4b0082',
  '#008080'
];


function updateButtonState() {
  if (!document.queryCommandState) return;
  const isBold = document.queryCommandState('bold');
  const isItalic = document.queryCommandState('italic');

  if (boldBtn) boldBtn.classList.toggle('active', isBold);
  if (italicBtn) italicBtn.classList.toggle('active', isItalic);
  updateAlignmentState();
  updateFontSizeState();
}

function getAlignmentState() {
  if (!document.queryCommandState) return null;
  if (document.queryCommandState('justifyCenter')) return 'center';
  if (document.queryCommandState('justifyRight')) return 'right';
  if (document.queryCommandState('justifyLeft')) return 'left';
  return null;
}

function updateAlignmentState() {
  if (!alignMenu) return;
  const currentAlign = getAlignmentState();
  alignMenu.querySelectorAll('.align-option').forEach((button) => {
    const align = button.dataset.align;
    if (align === currentAlign) button.classList.add('active'); else button.classList.remove('active');
  });
}

function toggleAlignMenu(open) {
  if (!alignMenu) return;
  alignMenu.classList.toggle('open', open);
}

function getFontSizeState() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  let node = sel.anchorNode;
  if (!node) return null;
  if (node.nodeType === 3) node = node.parentElement;
  if (!node) return null;
  const editableAncestor = node.closest && node.closest('.editable');
  if (!editableAncestor) return null;
  const computed = window.getComputedStyle(node);
  return parseInt(computed.fontSize, 10) || null;
}

function updateFontSizeState() {
  if (!fontSizeMenu) return;
  const currentSize = getFontSizeState();
  fontSizeMenu.querySelectorAll('.font-size-option').forEach((button) => {
    const size = parseInt(button.dataset.size, 10);
    if (size === currentSize) button.classList.add('active'); else button.classList.remove('active');
  });
}

function toggleFontSizeMenu(open) {
  if (!fontSizeMenu) return;
  fontSizeMenu.classList.toggle('open', open);
}

function toggleFontStyleMenu(open) {
  if (!fontStyleMenu) return;
  fontStyleMenu.classList.toggle('open', open);
}

function buildFontStyleMenu() {
  if (!fontStyleMenu) return;
  const list = fontStyleMenu.querySelector('.font-menu-list');
  if (!list) return;
  fontFamilies.forEach((font) => addFontStyleOption(font));
}

function addFontStyleOption(font) {
  if (!fontStyleMenu) return;
  const list = fontStyleMenu.querySelector('.font-menu-list');
  if (!list || !font) return;
  const normalized = font.trim();
  if (!normalized) return;
  const escapedFont = normalized.replace(/"/g, '\\"');
  if (list.querySelector(`[data-font="${escapedFont}"]`)) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'font-style-option';
  button.dataset.font = normalized;
  button.textContent = normalized;
  button.style.fontFamily = normalized;
  button.addEventListener('click', (e) => {
    e.preventDefault();
    setFontStyle(normalized);
    toggleFontStyleMenu(false);
  });
  list.appendChild(button);
}

function setFontStyle(font) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const node = sel.anchorNode && sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
  if (node) {
    const editableAncestor = node.closest && node.closest('.editable');
    if (editableAncestor) editableAncestor.focus();
  }
  const normalized = font.trim();
  if (!normalized) return;
  document.execCommand('fontName', false, normalized);
  updateButtonState();
}

function buildFontSizeMenu() {
  if (!fontSizeMenu) return;
  for (let size = 1; size <= 238; size += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'font-size-option';
    button.dataset.size = String(size);
    button.textContent = `${size}px`;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      setFontSize(size);
      toggleFontSizeMenu(false);
    });
    fontSizeMenu.appendChild(button);
  }
}

function setFontSize(px) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  let node = sel.anchorNode;
  if (node && node.nodeType === 3) node = node.parentElement;
  if (node) {
    const editableAncestor = node.closest && node.closest('.editable');
    if (editableAncestor) editableAncestor.focus();
  }

  const span = document.createElement('span');
  span.style.fontSize = `${px}px`;

  if (!range.collapsed) {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
    range.selectNodeContents(span);
  } else {
    span.appendChild(document.createTextNode('\u200B'));
    range.insertNode(span);
    range.setStart(span.firstChild, 1);
    range.collapse(true);
  }

  sel.removeAllRanges();
  sel.addRange(range);
  updateButtonState();
}

function setAlignment(align) {
  const sel = window.getSelection();
  if (sel.rangeCount) {
    const node = sel.anchorNode && sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
    if (node) {
      const editableAncestor = node.closest && node.closest('.editable');
      if (editableAncestor) editableAncestor.focus();
    }
  }
  const current = getAlignmentState();
  if (current === align) {
    document.execCommand('justifyLeft');
  } else {
    document.execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
  }
  updateButtonState();
}

function attachEditable(editable) {
  if (!editable) return;
  editable.addEventListener('input', onEditableInput);
  editable.addEventListener('keyup', updateButtonState);
  editable.addEventListener('mouseup', updateButtonState);
  editable.addEventListener('focus', updateButtonState);
}

function onEditableInput(e) {
  const el = e.target;
  // Avoid auto page splitting on small screens to prevent mobile typing freezes.
  if (window.innerWidth > 640) {
    ensurePageFits(el);
  }
  updateButtonState();
  updateDeletePageButtonState();
}

function ensurePageFits(editable) {
  if (!editable) return;
  let page = editable.closest('.page');
  while (editable.scrollHeight > PAGE_HEIGHT) {
    const nextEditable = getOrCreateNextEditable(page);
    // Try to move last child(s) to nextEditable
    if (!moveLastChildToNext(editable, nextEditable, PAGE_HEIGHT)) {
      // Couldn't move a full node (it's too big), try splitting the last node
      const last = editable.lastChild;
      if (!last) break;
      if (!splitElementToNext(last, editable, nextEditable, PAGE_HEIGHT)) {
        // As a fallback, move entire node to next to avoid infinite loop
        nextEditable.insertBefore(last, nextEditable.firstChild);
      }
    }
    // If nextEditable itself now overflows, continue the loop on it
    if (nextEditable.scrollHeight > PAGE_HEIGHT) {
      page = nextEditable.closest('.page');
      editable = nextEditable;
    }
  }
}

function getOrCreateNextEditable(page) {
  if (!page) return null;
  let next = page.nextElementSibling;
  if (!next) {
    // create a new page after this one
    const newEditable = createPage(page);
    updateDeletePageButtonState();
    return newEditable;
  }
  return next.querySelector('.editable');
}

function moveLastChildToNext(editable, nextEditable, maxHeight) {
  if (!editable || !nextEditable) return false;
  const last = editable.lastChild;
  if (!last) return false;
  const beforeHeight = editable.scrollHeight;
  nextEditable.insertBefore(last, nextEditable.firstChild);
  const afterHeight = editable.scrollHeight;
  if (afterHeight <= maxHeight) return true;
  editable.appendChild(nextEditable.firstChild);
  return false;
}

function splitElementToNext(node, editable, nextEditable, maxHeight) {
  if (!node || !editable || !nextEditable) return false;
  const text = node.textContent || '';
  if (!text) {
    return false;
  }

  const original = node.cloneNode(false);
  let low = 0;
  let high = text.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    node.textContent = text.slice(0, mid) || '\u00A0';
    if (editable.scrollHeight <= maxHeight) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (best === 0) return false;

  const prefix = text.slice(0, best);
  const suffix = text.slice(best);
  node.textContent = prefix || '\u00A0';
  const newNode = original.cloneNode(false);
  newNode.textContent = suffix || '\u00A0';
  nextEditable.insertBefore(newNode, nextEditable.firstChild);
  return true;
}

function createPage(afterPage = null, content = '<p><br></p>') {
  const page = document.createElement('div');
  page.className = 'page';

  const editable = document.createElement('div');
  editable.className = 'editable';
  editable.contentEditable = 'true';
  editable.innerHTML = content;

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-page';
  delBtn.title = 'Delete page';
  delBtn.textContent = '×';

  page.appendChild(editable);
  page.appendChild(delBtn);

  if (afterPage && afterPage.parentNode === pages) {
    pages.insertBefore(page, afterPage.nextSibling);
  } else {
    pages.appendChild(page);
  }

  attachEditable(editable);
  delBtn.addEventListener('click', onDeletePage);
  return editable;
}

function isLastPage(editable) {
  const page = editable.closest('.page');
  return page && page === pages.lastElementChild;
}

function onDeletePage(e) {
  const btn = e.currentTarget;
  const page = btn.closest('.page');
  removePage(page);
}

function getCurrentPage() {
  const sel = window.getSelection();
  if (sel.rangeCount) {
    let node = sel.anchorNode;
    if (node && node.nodeType === 3) node = node.parentElement;
    if (node) {
      const page = node.closest && node.closest('.page');
      if (page) return page;
    }
  }
  const active = document.activeElement;
  if (active) {
    const page = active.closest && active.closest('.page');
    if (page) return page;
  }
  return pages.lastElementChild;
}

function updateDeletePageButtonState() {
  if (!deleteCurrentPageBtn) return;
  const page = getCurrentPage();
  const canDelete = page && pages.children.length > 1 && page !== pages.firstElementChild;
  deleteCurrentPageBtn.disabled = !canDelete;
}

function getEditorState() {
  return Array.from(pages.querySelectorAll('.page')).map((page) => {
    const editable = page.querySelector('.editable');
    return editable ? editable.innerHTML : '';
  });
}

function saveWork() {
  const state = {
    savedAt: new Date().toISOString(),
    pages: getEditorState(),
  };

  try {
    localStorage.setItem('hondana_editor_saved_work', JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to save editor state to localStorage', error);
  }

  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hondana-work-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function loadWork(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      if (!json || !Array.isArray(json.pages)) {
        throw new Error('Invalid work file');
      }
      const pagesData = json.pages.filter((pageContent) => typeof pageContent === 'string');
      if (pagesData.length === 0) {
        return;
      }
      while (pages.firstChild) {
        pages.removeChild(pages.firstChild);
      }
      pagesData.forEach((pageContent, index) => {
        createPage(index === 0 ? null : pages.lastElementChild, pageContent || '<p><br></p>');
      });
    } catch (error) {
      console.warn('Failed to load saved work:', error);
    }
  };
  reader.onerror = () => {
    console.warn('Error reading file');
  };
  reader.readAsText(file);
}

function removePage(page) {
  if (!page || pages.children.length === 1 || page === pages.firstElementChild) return;
  const prev = page.previousElementSibling;
  page.remove();
  if (prev) {
    const prevEditable = prev.querySelector('.editable');
    if (prevEditable) focusEditable(prevEditable);
  }
  updateButtonState();
  updateDeletePageButtonState();
}

function deleteCurrentExtraPage(event) {
  if (!(event.ctrlKey && event.altKey && event.key.toLowerCase() === 'd')) return;
  const active = document.activeElement;
  if (!active || typeof active.closest !== 'function') return;
  const page = active.closest('.page');
  if (!page) return;
  if (pages.children.length === 1 || page === pages.firstElementChild) return;
  event.preventDefault();
  removePage(page);
}

function focusEditable(editable) {
  editable.focus();
  const range = document.createRange();
  range.selectNodeContents(editable);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// Wire up existing initial editable(s)
document.addEventListener('DOMContentLoaded', () => {
  // Attach to any existing editables and delete buttons
  document.querySelectorAll('.editable').forEach(attachEditable);
  document.querySelectorAll('.delete-page').forEach(btn => btn.addEventListener('click', onDeletePage));
  buildFontSizeMenu();
  buildFontStyleMenu();
  buildHighlightMenu();
  buildTextColorMenu();
  updateButtonState();
  updateDeletePageButtonState();
});

// Bold button behavior
boldBtn.addEventListener('click', (e) => {
  const sel = window.getSelection();
  if (sel.rangeCount) {
    // Ensure focus to current editable (if any)
    const node = sel.anchorNode && sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
    if (node) {
      const editableAncestor = node.closest && node.closest('.editable');
      if (editableAncestor) editableAncestor.focus();
    }
  }
  document.execCommand('bold');
  updateButtonState();
});

// Italic button behavior
if (italicBtn) {
  italicBtn.addEventListener('click', () => {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const node = sel.anchorNode && sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
      if (node) {
        const editableAncestor = node.closest && node.closest('.editable');
        if (editableAncestor) editableAncestor.focus();
      }
    }
    document.execCommand('italic');
    updateButtonState();
  });
}

if (alignToggleBtn) {
  alignToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = alignMenu && alignMenu.classList.contains('open');
    toggleFontSizeMenu(false);
    toggleAlignMenu(!open);
  });
}

if (fontSizeToggleBtn) {
  fontSizeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = fontSizeMenu && fontSizeMenu.classList.contains('open');
    toggleAlignMenu(false);
    toggleFontStyleMenu(false);
    toggleFontSizeMenu(!open);
  });
}

if (fontStyleBtn) {
  fontStyleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = fontStyleMenu && fontStyleMenu.classList.contains('open');
    toggleAlignMenu(false);
    toggleFontSizeMenu(false);
    toggleHighlightMenu(false);
    toggleFontStyleMenu(!open);
  });
}

if (highlightBtn) {
  highlightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = highlightMenu && highlightMenu.classList.contains('open');
    toggleAlignMenu(false);
    toggleFontSizeMenu(false);
    toggleFontStyleMenu(false);
    toggleTextColorMenu(false);
    toggleHighlightMenu(!open);
  });
}

if (textColorBtn) {
  textColorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = textColorMenu && textColorMenu.classList.contains('open');
    toggleAlignMenu(false);
    toggleFontSizeMenu(false);
    toggleFontStyleMenu(false);
    toggleHighlightMenu(false);
    toggleTextColorMenu(!open);
  });
}

if (alignMenu) {
  alignMenu.querySelectorAll('.align-option').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const align = button.dataset.align;
      if (align) {
        setAlignment(align);
      }
      toggleAlignMenu(false);
    });
  });
}

document.addEventListener('click', (e) => {
  if (alignMenu && alignToggleBtn) {
    if (!alignMenu.contains(e.target) && e.target !== alignToggleBtn) {
      toggleAlignMenu(false);
    }
  }
  if (fontSizeMenu && fontSizeToggleBtn) {
    if (!fontSizeMenu.contains(e.target) && e.target !== fontSizeToggleBtn) {
      toggleFontSizeMenu(false);
    }
  }
  if (fontStyleMenu && fontStyleBtn) {
    if (!fontStyleMenu.contains(e.target) && e.target !== fontStyleBtn) {
      toggleFontStyleMenu(false);
    }
  }
  if (highlightMenu && highlightBtn) {
    if (!highlightMenu.contains(e.target) && e.target !== highlightBtn) {
      toggleHighlightMenu(false);
    }
  }
  if (textColorMenu && textColorBtn) {
    if (!textColorMenu.contains(e.target) && e.target !== textColorBtn) {
      toggleTextColorMenu(false);
    }
  }
});

// Background control handlers
const backgroundBtn = document.getElementById('backgroundBtn');
const backgroundDropdown = document.getElementById('backgroundDropdown');
const bgImageInput = document.getElementById('bgImageInput');
const clearBgBtn = document.getElementById('clearBgBtn');
const defaultBgBtn = document.getElementById('defaultBgBtn');
const defaultBodyColor = '#f0f0f0';
let currentBgObjectURL = null;
let currentColor = defaultBodyColor;

if (backgroundBtn) {
  backgroundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = backgroundDropdown && backgroundDropdown.classList.contains('open');
    toggleAlignMenu(false);
    toggleFontSizeMenu(false);
    toggleFontStyleMenu(false);
    toggleHighlightMenu(false);
    if (backgroundDropdown) backgroundDropdown.classList.toggle('open', !open);
  });
}

// Color swatches
document.querySelectorAll('.bg-swatch').forEach((el) => {
  el.addEventListener('click', (e) => {
    const color = el.dataset.color;
    if (!color) return;
    // remove any background image
    if (currentBgObjectURL) { URL.revokeObjectURL(currentBgObjectURL); currentBgObjectURL = null; }
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = color;
    currentColor = color;
    if (backgroundDropdown) backgroundDropdown.classList.remove('open');
  });
});

if (defaultBgBtn) {
  defaultBgBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentBgObjectURL) { URL.revokeObjectURL(currentBgObjectURL); currentBgObjectURL = null; }
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = defaultBodyColor;
    currentColor = defaultBodyColor;
    if (backgroundDropdown) backgroundDropdown.classList.remove('open');
  });
}

if (bgImageInput) {
  bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (currentBgObjectURL) { URL.revokeObjectURL(currentBgObjectURL); currentBgObjectURL = null; }
    const url = URL.createObjectURL(file);
    currentBgObjectURL = url;
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
    if (backgroundDropdown) backgroundDropdown.classList.remove('open');
  });
}

if (clearBgBtn) {
  clearBgBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentBgObjectURL) { URL.revokeObjectURL(currentBgObjectURL); currentBgObjectURL = null; }
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = currentColor || defaultBodyColor;
  });
}

// Close background dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (backgroundDropdown && backgroundBtn) {
    if (!backgroundDropdown.contains(e.target) && e.target !== backgroundBtn) {
      backgroundDropdown.classList.remove('open');
    }
  }
});

document.addEventListener('keydown', deleteCurrentExtraPage);
document.addEventListener('selectionchange', () => {
  updateButtonState();
  updateDeletePageButtonState();
});

// New Page button behavior (creates a new page below the last page)
if (newPageBtn) {
  newPageBtn.addEventListener('click', () => {
    const lastPage = pages && pages.lastElementChild;
    const newEditable = createPage(lastPage);
    focusEditable(newEditable);
    updateDeletePageButtonState();
  });
}

if (deleteCurrentPageBtn) {
  deleteCurrentPageBtn.addEventListener('click', () => {
    const page = getCurrentPage();
    removePage(page);
  });
}

if (saveWorkBtn) {
  saveWorkBtn.addEventListener('click', saveWork);
}

if (loadWorkBtn && loadWorkInput) {
  loadWorkBtn.addEventListener('click', () => {
    loadWorkInput.value = '';
    loadWorkInput.click();
  });

  loadWorkInput.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      loadWork(file);
    }
  });
}

if (toggleRibbonBtn) {
  toggleRibbonBtn.addEventListener('click', () => {
    const body = document.body;
    const hidden = body.classList.toggle('ribbon-hidden');
    toggleRibbonBtn.textContent = hidden ? 'Show Ribbon' : 'Hide Ribbon';
    if (!hidden) {
      body.style.paddingTop = '';
    }
  });
}

function toggleHighlightMenu(open) {
  if (!highlightMenu) return;
  highlightMenu.classList.toggle('open', open);
}

function toggleTextColorMenu(open) {
  if (!textColorMenu) return;
  textColorMenu.classList.toggle('open', open);
}

function buildHighlightMenu() {
  if (!highlightMenu) return;
  highlightColors.forEach((color) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    swatch.title = color;
    swatch.addEventListener('click', (e) => {
      e.preventDefault();
      applyHighlight(color);
      toggleHighlightMenu(false);
    });
    highlightMenu.appendChild(swatch);
  });
}

function buildTextColorMenu() {
  if (!textColorMenu) return;
  textColors.forEach((color) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    swatch.title = color;
    swatch.addEventListener('click', (e) => {
      e.preventDefault();
      applyTextColor(color);
      toggleTextColorMenu(false);
    });
    textColorMenu.appendChild(swatch);
  });
}

function applyHighlight(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.toString().length === 0) return;
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.style.backgroundColor = color;
  span.style.color = 'inherit';

  try {
    range.surroundContents(span);
  } catch (err) {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }

  sel.removeAllRanges();
  sel.addRange(range);
  updateButtonState();
}

function applyTextColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  if (sel.toString().length === 0) return;
  document.execCommand('foreColor', false, color);
  updateButtonState();
}

// Keybind: Ctrl+Alt+D deletes the current page (if it's not the first/base page)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    let node = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === 3) node = node.parentElement;
    const page = node && node.closest ? node.closest('.page') : null;
    if (!page) return;
    // Do not remove the first/base page
    if (pages.children.length === 1) return;
    if (page === pages.firstElementChild) return;
    e.preventDefault();
    const prev = page.previousElementSibling;
    page.remove();
    if (prev) {
      const prevEditable = prev.querySelector('.editable');
      if (prevEditable) focusEditable(prevEditable);
    }
    updateButtonState();
  }
});

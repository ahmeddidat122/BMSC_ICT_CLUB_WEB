export function createFocusTrap(container) {
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  /** @type {HTMLElement[]} */
  let focusableElements = [];
  /** @type {HTMLElement | undefined} */
  let firstFocusableElement;
  /** @type {HTMLElement | undefined} */
  let lastFocusableElement;
  const previousActiveElement = /** @type {HTMLElement | null} */ (document.activeElement);

  function updateFocusableElements() {
    focusableElements = /** @type {HTMLElement[]} */ (
      Array.from(container.querySelectorAll(focusableElementsString)).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
      )
    );
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  }

  function handleKeyDown(e) {
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement && lastFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement && firstFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  updateFocusableElements();
  
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }

  container.addEventListener('keydown', handleKeyDown);

  return function destroy() {
    container.removeEventListener('keydown', handleKeyDown);
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  };
}

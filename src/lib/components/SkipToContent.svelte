<script>
  /**
   * SkipToContent — WCAG 2.2 AA Skip Navigation
   * Provides keyboard-accessible skip links for main content and footer.
   */
  function handleSkip(e, targetId) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
    }
  }
</script>

<div class="skip-links">
  <a 
    href="#main-content" 
    class="sr-only-focusable skip-link"
    onclick={(e) => handleSkip(e, 'main-content')}
  >
    Skip to main content
  </a>
  <a 
    href="#footer-nav" 
    class="sr-only-focusable skip-link"
    onclick={(e) => handleSkip(e, 'footer-nav')}
  >
    Skip to footer navigation
  </a>
</div>

<style>
  .skip-links {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .skip-link {
    display: block;
    padding: 1rem 1.5rem;
    background-color: #2563eb;
    color: #ffffff;
    font-weight: bold;
    text-decoration: none;
    border-radius: 0 0 0.5rem 0;
    outline: 3px solid #ffffff;
    outline-offset: -3px;
  }

  .skip-link:focus {
    outline: 3px solid #facc15;
    outline-offset: 2px;
  }
</style>

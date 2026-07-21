<script>
  /**
   * LiveRegion — ARIA Live Region for Screen Reader Announcements
   * Provides both polite (status) and assertive (alert) announcements.
   */
  let { assertive = false, message = '' } = $props();
  
  let currentMessage = $state('');
  let mode = $derived(assertive ? 'assertive' : 'polite');

  $effect(() => {
    currentMessage = message;
  });

  /**
   * Announce a message to screen readers
   * @param {string} newMessage - The message to announce
   * @param {boolean} [isAssertive=false] - Use assertive mode for urgent messages
   */
  export function announce(newMessage, isAssertive = false) {
    // Clear first to ensure re-announcement of same text
    currentMessage = '';
    mode = isAssertive ? 'assertive' : 'polite';
    
    // Slight delay to allow DOM to clear before re-setting
    setTimeout(() => {
      currentMessage = newMessage;
    }, 50);
  }
</script>

<div
  class="sr-only"
  role={mode === 'assertive' ? 'alert' : 'status'}
  aria-live={mode}
  aria-atomic="true"
>
  {currentMessage}
</div>

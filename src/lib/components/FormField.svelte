<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let {
    id,
    label,
    type = 'text',
    required = false,
    error = '',
    helpText = '',
    value = $bindable(''),
    children
  }: {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    value?: any;
    children?: Snippet;
  } = $props();

  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  
  let describedBy = $derived(
    [error ? errorId : null, helpText ? helpId : null]
      .filter(Boolean)
      .join(' ') || undefined
  );
</script>

<div class="form-field">
  <label for={id} class="form-label">
    {label}
    {#if required}
      <span class="required-indicator" aria-hidden="true">*</span>
    {/if}
  </label>
  
  {#if children}
    {@render children()}
  {:else}
    <input
      {id}
      {type}
      class="form-input"
      class:is-invalid={!!error}
      aria-invalid={!!error ? 'true' : undefined}
      aria-required={required ? 'true' : undefined}
      aria-describedby={describedBy}
      bind:value
    />
  {/if}
  
  {#if helpText && !error}
    <div id={helpId} class="form-help">
      {helpText}
    </div>
  {/if}
  
  {#if error}
    <div id={errorId} class="form-error" role="alert">
      {error}
    </div>
  {/if}
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .form-label {
    font-weight: 500;
    color: #374151;
  }
  
  .required-indicator {
    color: #dc2626;
    margin-left: 0.25rem;
  }
  
  .form-input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }
  
  .form-input.is-invalid {
    border-color: #dc2626;
  }
  
  .form-help {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .form-error {
    font-size: 0.875rem;
    color: #dc2626;
    font-weight: 500;
  }
</style

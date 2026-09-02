<template>
  <!-- Content is sanitized by DOMPurify in renderSafeMarkdown. -->
  <div class="markdown-body" v-html="html" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { renderSafeMarkdown } from '@/utils/markdown';
const props = defineProps<{ source: string }>();
const html = ref('');
let renderVersion = 0;
watch(
  () => props.source,
  async (source) => {
    const version = ++renderVersion;
    const rendered = await renderSafeMarkdown(source);
    if (version === renderVersion) html.value = rendered;
  },
  { immediate: true },
);
</script>

<style lang="scss">
.markdown-body {
  line-height: 1.7;
  overflow-wrap: anywhere;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 var(--space-3);
  }

  ul,
  ol {
    padding-left: var(--space-5);
  }

  code {
    padding: 0.125rem 0.375rem;
    font-size: 0.9em;
    color: var(--color-danger);
    background: var(--color-background-soft);
    border-radius: var(--radius-sm);
  }

  pre {
    max-width: 100%;
    padding: var(--space-4);
    overflow: auto;
    color: #e7e7ec;
    background: #202024;
    border: 1px solid #303036;
    border-radius: var(--radius-md);
    -webkit-overflow-scrolling: touch;

    code {
      padding: 0;
      color: inherit;
      background: transparent;
    }
  }

  a {
    color: var(--color-primary);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.1875rem;
  }

  blockquote {
    padding-left: var(--space-4);
    margin-left: 0;
    color: var(--color-text-secondary);
    border-left: 2px solid var(--color-border-strong);
  }
}
</style>

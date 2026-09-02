import DOMPurify from 'dompurify';
async function createRenderer() {
  const { default: Markdown } = await import('markdown-it');
  return new Markdown({ html: false, linkify: true, breaks: true });
}

let rendererPromise: ReturnType<typeof createRenderer> | undefined;

async function getRenderer() {
  rendererPromise ??= createRenderer();
  return rendererPromise;
}

export async function renderSafeMarkdown(source: string) {
  const renderer = await getRenderer();
  return DOMPurify.sanitize(renderer.render(source), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script', 'iframe', 'form'],
    FORBID_ATTR: ['style'],
  });
}

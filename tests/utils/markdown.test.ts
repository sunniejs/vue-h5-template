import { describe, expect, it } from 'vitest';
import { renderSafeMarkdown } from '@/utils/markdown';

describe('safe markdown', () => {
  it('renders markdown while removing untrusted HTML and URLs', async () => {
    const html = await renderSafeMarkdown(
      '**safe** <script>alert(1)</script> [bad](javascript:alert(1))\n```ts\nconst ok = true\n```',
    );
    expect(html).toContain('<strong>safe</strong>');
    expect(html).toContain('<pre><code class="language-ts">');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('href="javascript:');
  });
});

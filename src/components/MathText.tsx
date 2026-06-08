import katex from 'katex';

/** Render a LaTeX string with KaTeX (synchronous, fast). */
export function MathText({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

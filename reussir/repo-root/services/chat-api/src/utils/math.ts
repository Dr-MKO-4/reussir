import katex from "katex";

export function processEquation(input: string): string {
  // Extraction du LaTeX entre $$ ... $$
  const match = input.match(/\$\$([\s\S]*)\$\$/);
  if (!match) return "";
  const latex = match[1].trim();
  try {
    return katex.renderToString(latex, { throwOnError: false });
  } catch (e) {
    return "<span style='color:red'>Équation invalide</span>";
  }
}

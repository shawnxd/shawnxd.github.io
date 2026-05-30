export interface Frontmatter {
  [key: string]: string | string[] | undefined;
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[];
}

export interface ParsedMarkdown {
  data: Frontmatter;
  content: string;
}

const frontmatterBlock = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/;

const unquote = (value: string): string => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const parseValue = (value: string): string | string[] => {
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map(unquote)
      .filter(Boolean);
  }
  return unquote(trimmed);
};

export const parseMarkdownFrontmatter = (source: string): ParsedMarkdown => {
  const match = source.match(frontmatterBlock);
  if (!match) {
    return { data: {}, content: source };
  }

  const data: Frontmatter = {};
  match[1].split(/\r?\n/).forEach(line => {
    const separator = line.indexOf(':');
    if (separator <= 0) return;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);
    if (!key) return;

    data[key] = parseValue(value);
  });

  return {
    data,
    content: source.slice(match[0].length),
  };
};

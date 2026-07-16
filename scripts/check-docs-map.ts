import { promises as fs } from "node:fs";
import type { Dirent } from "node:fs";
import path from "node:path";

type IssueCode =
  | "DOC001"
  | "DOC002"
  | "DOC003"
  | "DOC004"
  | "DOC005"
  | "DOC006";

interface LinkReference {
  absolutePath: string;
  fragment: string;
  line: number;
  target: string;
}

interface DocumentInfo {
  absolutePath: string;
  anchors: Set<string>;
  content: string;
  links: LinkReference[];
}

interface Issue {
  code: IssueCode;
  file?: string;
  line?: number;
  message: string;
}

const args = new Set(process.argv.slice(2));
const root = path.resolve(process.env.DOCS_ROOT ?? process.cwd());
const excludedDirectories = new Set([
  ".git",
  ".venv",
  ".worktrees",
  "node_modules",
]);
const markdownFiles: string[] = [];
const directoriesWithMarkdown = new Set<string>();
const documents = new Map<string, DocumentInfo>();
const issues: Issue[] = [];

function relative(absolutePath: string): string {
  return path.relative(root, absolutePath).split(path.sep).join("/") || ".";
}

function isInsideRoot(absolutePath: string): boolean {
  return absolutePath === root || absolutePath.startsWith(`${root}${path.sep}`);
}

async function walk(directory: string): Promise<void> {
  const entries: Dirent[] = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        await walk(absolutePath);
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      markdownFiles.push(path.resolve(absolutePath));
    }
  }
}

function stripFencedCode(markdown: string): string {
  let fence: "`" | "~" | null = null;

  return markdown
    .split("\n")
    .map((line) => {
      const match = line.match(/^\s*(`{3,}|~{3,})/);

      if (match) {
        const marker = match[1][0] as "`" | "~";
        if (fence === null) {
          fence = marker;
        } else if (fence === marker) {
          fence = null;
        }
        return "";
      }

      return fence === null ? line : "";
    })
    .join("\n");
}

function slugifyHeading(heading: string, usedAnchors: Set<string>): string {
  const explicitAnchor = heading.match(/\s*\{#([^}]+)}\s*$/)?.[1];
  const plainHeading = (explicitAnchor
    ? heading.slice(0, heading.lastIndexOf("{#"))
    : heading
  )
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();
  const base = explicitAnchor
    ? explicitAnchor
    : plainHeading
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}_-]/gu, "");
  let anchor = base || "section";
  let suffix = 1;

  while (usedAnchors.has(anchor)) {
    anchor = `${base}-${suffix}`;
    suffix += 1;
  }

  usedAnchors.add(anchor);
  return anchor;
}

function extractAnchors(markdown: string): Set<string> {
  const anchors = new Set<string>();

  for (const line of stripFencedCode(markdown).split("\n")) {
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/)?.[1];
    if (heading) {
      slugifyHeading(heading, anchors);
    }
  }

  return anchors;
}

function extractLocalLinks(
  markdownPath: string,
  markdown: string,
): LinkReference[] {
  const links: LinkReference[] = [];
  const content = stripFencedCode(markdown);
  const pattern = /!?\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

  for (const match of content.matchAll(pattern)) {
    let target = match[1];
    if (target.startsWith("<") && target.endsWith(">")) {
      target = target.slice(1, -1);
    }

    if (
      target.startsWith("mailto:") ||
      /^[a-z][a-z0-9+.-]*:\/\//i.test(target)
    ) {
      continue;
    }

    const hashIndex = target.indexOf("#");
    const fragment = hashIndex >= 0 ? target.slice(hashIndex + 1) : "";
    const withoutFragment = hashIndex >= 0 ? target.slice(0, hashIndex) : target;
    const queryIndex = withoutFragment.indexOf("?");
    const withoutQuery =
      queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment;
    let decodedPath = withoutQuery;

    try {
      decodedPath = decodeURIComponent(withoutQuery);
    } catch {
      // Keep the original path so the existence check reports a useful error.
    }

    links.push({
      absolutePath: path.resolve(
        path.dirname(markdownPath),
        decodedPath.length === 0 ? path.basename(markdownPath) : decodedPath,
      ),
      fragment,
      line: content.slice(0, match.index ?? 0).split("\n").length,
      target,
    });
  }

  return links;
}

function addIssue(
  code: IssueCode,
  message: string,
  file?: string,
  line?: number,
): void {
  issues.push({ code, file: file ? relative(file) : undefined, line, message });
}

function indexTargets(indexPath: string): Map<string, number[]> {
  const targets = new Map<string, number[]>();

  for (const link of documents.get(indexPath)?.links ?? []) {
    const lines = targets.get(link.absolutePath) ?? [];
    lines.push(link.line);
    targets.set(link.absolutePath, lines);
  }

  return targets;
}

await walk(root);
markdownFiles.sort();

const markdownSet = new Set(markdownFiles);

for (const markdownFile of markdownFiles) {
  let directory = path.dirname(markdownFile);

  while (isInsideRoot(directory)) {
    directoriesWithMarkdown.add(directory);
    if (directory === root) {
      break;
    }
    directory = path.dirname(directory);
  }
}

for (const markdownFile of markdownFiles) {
  const content = await fs.readFile(markdownFile, "utf8");
  documents.set(markdownFile, {
    absolutePath: markdownFile,
    anchors: extractAnchors(content),
    content,
    links: extractLocalLinks(markdownFile, content),
  });
}

for (const document of documents.values()) {
  for (const link of document.links) {
    if (!isInsideRoot(link.absolutePath)) {
      addIssue(
        "DOC001",
        `local link escapes repository root: ${link.target}`,
        document.absolutePath,
        link.line,
      );
      continue;
    }

    try {
      await fs.access(link.absolutePath);
    } catch {
      addIssue(
        "DOC002",
        `local link does not exist: ${link.target}`,
        document.absolutePath,
        link.line,
      );
      continue;
    }

    if (link.fragment && markdownSet.has(link.absolutePath)) {
      const targetDocument = documents.get(link.absolutePath);
      if (targetDocument && !targetDocument.anchors.has(link.fragment)) {
        addIssue(
          "DOC003",
          `Markdown anchor does not exist: #${link.fragment}`,
          document.absolutePath,
          link.line,
        );
      }
    }
  }
}

for (const directory of [...directoriesWithMarkdown].sort()) {
  const indexPath = path.join(directory, "README.md");

  if (!markdownSet.has(indexPath)) {
    addIssue("DOC004", "directory with Markdown is missing README.md", directory);
    continue;
  }

  const targets = indexTargets(indexPath);
  for (const [target, lines] of targets) {
    if (lines.length > 1) {
      addIssue(
        "DOC005",
        `index links the same target more than once: ${relative(target)}`,
        indexPath,
        lines[1],
      );
    }
  }

  const directDocuments = markdownFiles.filter(
    (file) => path.dirname(file) === directory && file !== indexPath,
  );
  const directChildIndexes = [...directoriesWithMarkdown]
    .filter((child) => path.dirname(child) === directory)
    .map((child) => path.join(child, "README.md"));

  for (const requiredTarget of [...directDocuments, ...directChildIndexes]) {
    if (!targets.has(requiredTarget)) {
      addIssue(
        "DOC006",
        `index is missing map entry for ${relative(requiredTarget)}`,
        indexPath,
      );
    }
  }
}

const result = {
  checkedMarkdownFiles: markdownFiles.length,
  checkedIndexes: [...directoriesWithMarkdown].filter((directory) =>
    markdownSet.has(path.join(directory, "README.md")),
  ).length,
  issues,
  localLinks: [...documents.values()].reduce(
    (count, document) => count + document.links.length,
    0,
  ),
};

if (args.has("--json")) {
  console.log(JSON.stringify({ ok: issues.length === 0, ...result }, null, 2));
} else if (issues.length > 0) {
  console.error("Documentation map check failed:\n");
  for (const issue of issues) {
    const location = issue.file
      ? `${issue.file}${issue.line ? `:${issue.line}` : ""}`
      : "repository";
    console.error(`- [${issue.code}] ${location}: ${issue.message}`);
  }
} else {
  console.log(
    `Documentation map check passed: ${result.checkedMarkdownFiles} Markdown files, ${result.checkedIndexes} indexes, ${result.localLinks} local links.`,
  );
}

if (issues.length > 0) {
  process.exitCode = 1;
}

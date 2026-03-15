import JSZip from 'jszip';
import type { ParsedEbook, ParsedSection, Block } from '@/types';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function blockToHtml(block: Block): string {
  const text = escapeXml(block.text || '');

  switch (block.type) {
    case 'chapter':
    case 'h1':
      return `<h2>${text}</h2>`;
    case 'h2':
    case 'subheading':
      return `<h3>${text}</h3>`;
    case 'h3':
      return `<h4>${text}</h4>`;
    case 'quote':
      return `<blockquote>${text}</blockquote>`;
    case 'bullet':
      return `<ul><li>${text}</li></ul>`;
    case 'numbered':
    case 'step_item':
      return `<ol><li>${text}</li></ol>`;
    case 'tip':
      return `<p class="note tip"><strong>Tip:</strong> ${text}</p>`;
    case 'warning':
      return `<p class="note warning"><strong>Warning:</strong> ${text}</p>`;
    case 'example':
      return `<p class="note example"><strong>Example:</strong> ${text}</p>`;
    case 'callout':
    case 'highlight':
    case 'benefit':
    case 'goal':
    case 'definition':
    case 'emphasis':
    case 'prompt':
    case 'prompt_text':
    case 'action_task':
    case 'intro_list':
    case 'paragraph':
      return `<p>${text}</p>`;
    case 'divider':
      return '<hr />';
    default:
      return `<p>${text}</p>`;
  }
}

function sectionToXhtml(title: string, section: ParsedSection): string {
  const heading = escapeXml(section.heading || title);
  const body = section.blocks.map(blockToHtml).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${heading}</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
  </head>
  <body>
    <section>
      <h1>${heading}</h1>
      ${body}
    </section>
  </body>
</html>`;
}

function titlePageXhtml(title: string): string {
  const safeTitle = escapeXml(title);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
  </head>
  <body>
    <section class="title-page">
      <h1>${safeTitle}</h1>
      <p>Created with CreatorLab.ink</p>
    </section>
  </body>
</html>`;
}

function navXhtml(title: string, sections: ParsedSection[]): string {
  const safeTitle = escapeXml(title);
  const navItems = sections
    .map((section, idx) => `<li><a href="chapter-${idx + 1}.xhtml">${escapeXml(section.heading || `Chapter ${idx + 1}`)}</a></li>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Contents</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
  </head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>${safeTitle}</h1>
      <ol>
        <li><a href="title.xhtml">Title Page</a></li>
        ${navItems}
      </ol>
    </nav>
  </body>
</html>`;
}

function tocNcx(title: string, sections: ParsedSection[], bookId: string): string {
  const navPoints = sections
    .map((section, idx) => `
    <navPoint id="navPoint-${idx + 2}" playOrder="${idx + 2}">
      <navLabel><text>${escapeXml(section.heading || `Chapter ${idx + 1}`)}</text></navLabel>
      <content src="chapter-${idx + 1}.xhtml"/>
    </navPoint>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${bookId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>${navPoints}
  </navMap>
</ncx>`;
}

function contentOpf(title: string, sections: ParsedSection[], bookId: string): string {
  const manifestChapters = sections
    .map((_, idx) => `<item id="chapter-${idx + 1}" href="chapter-${idx + 1}.xhtml" media-type="application/xhtml+xml"/>`)
    .join('\n    ');

  const spineChapters = sections
    .map((_, idx) => `<itemref idref="chapter-${idx + 1}"/>`)
    .join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${bookId}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="styles.css" media-type="text/css"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    ${manifestChapters}
  </manifest>
  <spine toc="ncx">
    <itemref idref="title"/>
    ${spineChapters}
  </spine>
</package>`;
}

const STYLES = `
body {
  font-family: serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}
section {
  padding: 1.6em;
}
.title-page {
  margin-top: 30%;
  text-align: center;
}
h1, h2, h3, h4 {
  line-height: 1.3;
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}
p, li, blockquote {
  margin: 0.6em 0;
}
ul, ol {
  margin: 0.4em 0 0.8em 1.2em;
  padding: 0;
}
blockquote {
  border-left: 3px solid #555;
  padding-left: 0.8em;
  color: #444;
}
.note {
  border-left: 3px solid #777;
  padding-left: 0.8em;
}
.note.tip { border-left-color: #2f9e44; }
.note.warning { border-left-color: #e03131; }
.note.example { border-left-color: #6741d9; }
hr {
  border: none;
  border-top: 1px solid #bbb;
  margin: 1.2em 0;
}
`;

export async function generateEPUBBlob(parsed: ParsedEbook): Promise<Blob> {
  const zip = new JSZip();
  const title = parsed.title?.trim() || 'Untitled Ebook';
  const sections: ParsedSection[] = parsed.sections?.length
    ? parsed.sections
    : [{ heading: 'Chapter 1', blocks: [{ type: 'paragraph', text: 'No content provided.' }] } as ParsedSection];

  const bookId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `urn:uuid:${crypto.randomUUID()}`
    : `urn:uuid:${Date.now()}`;

  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  zip.folder('META-INF')?.file('container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>`);

  const oebps = zip.folder('OEBPS');
  if (!oebps) {
    throw new Error('Failed to create EPUB structure.');
  }

  oebps.file('styles.css', STYLES.trim());
  oebps.file('title.xhtml', titlePageXhtml(title));
  oebps.file('nav.xhtml', navXhtml(title, sections));
  oebps.file('toc.ncx', tocNcx(title, sections, bookId));
  oebps.file('content.opf', contentOpf(title, sections, bookId));

  sections.forEach((section, idx) => {
    oebps.file(`chapter-${idx + 1}.xhtml`, sectionToXhtml(title, section));
  });

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

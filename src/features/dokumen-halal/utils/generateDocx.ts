import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TabStopPosition,
  TabStopType,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

interface DocumentOptions {
  title: string;
  businessName: string;
  content: string;
}

function createHeader(title: string): Header {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            size: 20,
            color: "666666",
          }),
        ],
        alignment: AlignmentType.RIGHT,
        border: {
          bottom: {
            color: "CCCCCC",
            style: BorderStyle.SINGLE,
            size: 6,
            space: 1,
          },
        },
      }),
    ],
  });
}

function createFooter(businessName: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: businessName,
            size: 18,
            color: "666666",
          }),
          new TextRun({
            text: "\t",
          }),
          new TextRun({
            text: "Halaman ",
            size: 18,
            color: "666666",
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 18,
            color: "666666",
          }),
          new TextRun({
            text: " dari ",
            size: 18,
            color: "666666",
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 18,
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        border: {
          top: {
            color: "CCCCCC",
            style: BorderStyle.SINGLE,
            size: 6,
            space: 1,
          },
        },
      }),
    ],
  });
}

function cleanMarkdown(text: string): string {
  let cleaned = text;
  // Remove bold/italic markdown
  cleaned = cleaned.replace(/\*\*\*/g, "");
  cleaned = cleaned.replace(/\*\*/g, "");
  cleaned = cleaned.replace(/\*/g, "");
  cleaned = cleaned.replace(/__/g, "");
  cleaned = cleaned.replace(/_([^_]+)_/g, "$1");
  // Remove heading markdown
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");
  // Remove markdown bullet points (at start of line)
  cleaned = cleaned.replace(/^●\s*/gm, "- ");
  cleaned = cleaned.replace(/^•\s*/gm, "- ");
  // Also handle bullets with tab/spaces before them
  cleaned = cleaned.replace(/^\s*●\s*/gm, "- ");
  cleaned = cleaned.replace(/^\s*•\s*/gm, "- ");
  // Remove table separators
  cleaned = cleaned.replace(/\|[-:]+\|[-:|\s]+\|/g, "");
  cleaned = cleaned.replace(/^\|.*\|$/gm, (match) => {
    // Convert table row to plain text
    const cells = match.split("|").filter((c) => c.trim());
    return cells.map((c) => c.trim()).join(": ");
  });
  // Remove horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, "");
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

// Create a label:value paragraph with tab-aligned colon
function createLabelValueParagraph(label: string, value: string, indent = 0): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label, size: 22 }),
      new TextRun({ text: "\t: ", size: 22 }),
      new TextRun({ text: value, size: 22 }),
    ],
    tabStops: [
      {
        type: TabStopType.LEFT,
        position: convertInchesToTwip(2.5),
      },
    ],
    spacing: { before: 50, after: 50 },
    indent: indent > 0 ? { left: convertInchesToTwip(indent) } : undefined,
  });
}

// Create signature table with two columns
function createSignatureTable(leftLines: string[], rightLines: string[]): Table {
  const createCellParagraphs = (lines: string[]): Paragraph[] => {
    return lines.map((line) => {
      const trimmed = line.trim();
      // Check if it's a label:value line
      if (trimmed.includes(" : ")) {
        const [label, ...valueParts] = trimmed.split(" : ");
        return createLabelValueParagraph(label.trim(), valueParts.join(" : ").trim());
      }
      // Check for header lines (PIHAK PERTAMA, etc)
      if (trimmed.toUpperCase() === trimmed && trimmed.length > 3) {
        return new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 22 })],
          spacing: { before: 100, after: 100 },
        });
      }
      return new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22 })],
        spacing: { before: 50, after: 50 },
      });
    });
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: createCellParagraphs(leftLines),
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: createCellParagraphs(rightLines),
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
          }),
        ],
      }),
    ],
  });
}

function parseContent(content: string, documentTitle: string): (Paragraph | Table)[] {
  // Clean markdown first
  const cleanedContent = cleanMarkdown(content);
  const lines = cleanedContent.split("\n");
  const elements: (Paragraph | Table)[] = [];

  // Normalize title for comparison
  const normalizedTitle = documentTitle.toUpperCase().replace(/\s+/g, " ").trim();

  // Detect signature sections
  let inSignatureSection = false;
  let signatureStartIndex = -1;

  // Find signature section start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toUpperCase();
    if (line.includes("TEMPAT TANDA TANGAN") || line.includes("TANDA TANGAN PARA PIHAK")) {
      inSignatureSection = true;
      signatureStartIndex = i;
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    // Handle signature section specially
    if (inSignatureSection && i >= signatureStartIndex) {
      // Collect all remaining lines for signature processing
      const sigLines = lines
        .slice(i)
        .map((l) => l.trim())
        .filter((l) => l);

      // Add section header
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: "TANDA TANGAN PARA PIHAK", bold: true, size: 24 })],
          spacing: { before: 400, after: 200 },
          alignment: AlignmentType.CENTER,
        }),
      );

      // Find PIHAK PERTAMA and PIHAK KEDUA sections
      const leftLines: string[] = [];
      const rightLines: string[] = [];
      let currentSide: "left" | "right" | null = null;

      for (const sigLine of sigLines) {
        if (sigLine.toUpperCase().includes("TEMPAT TANDA TANGAN")) continue;
        if (sigLine.toUpperCase().includes("PIHAK PERTAMA")) {
          currentSide = "left";
          leftLines.push(sigLine);
        } else if (sigLine.toUpperCase().includes("PIHAK KEDUA")) {
          currentSide = "right";
          rightLines.push(sigLine);
        } else if (currentSide === "left") {
          leftLines.push(sigLine);
        } else if (currentSide === "right") {
          rightLines.push(sigLine);
        }
      }

      if (leftLines.length > 0 || rightLines.length > 0) {
        elements.push(createSignatureTable(leftLines, rightLines));
      }
      break; // Done processing
    }

    const line = lines[i];
    let trimmedLine = line.trim();

    // Skip empty lines but add spacing
    if (!trimmedLine) {
      elements.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }

    // Skip lines that are just markdown artifacts
    if (trimmedLine === "---" || trimmedLine === "***" || /^\|[-:|\s]+\|$/.test(trimmedLine)) {
      continue;
    }

    // Clean any remaining markdown in the line
    trimmedLine = trimmedLine
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#+\s*/, "");

    // Skip duplicate title lines (compare normalized versions)
    const normalizedLine = trimmedLine.toUpperCase().replace(/\s+/g, " ").trim();
    if (normalizedLine === normalizedTitle) {
      continue;
    }

    // Main title detection - skip since we already have title in header
    if (
      i < 5 &&
      (trimmedLine.includes("SOP") ||
        trimmedLine.includes("SURAT") ||
        trimmedLine.includes("DAFTAR") ||
        trimmedLine.includes("FORM"))
    ) {
      if (normalizedLine.includes(normalizedTitle) || normalizedTitle.includes(normalizedLine)) {
        continue;
      }
    }

    // Label : Value lines (for aligned colons)
    if (/^-?\s*[\w\s]+\s+:\s+.+$/.test(trimmedLine) && !trimmedLine.startsWith("-")) {
      const colonIndex = trimmedLine.indexOf(" : ");
      if (colonIndex > 0) {
        const label = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine.substring(colonIndex + 3).trim();
        elements.push(createLabelValueParagraph(label, value));
        continue;
      }
    }

    // Bullet points with label:value
    if (trimmedLine.startsWith("-") && trimmedLine.includes(" : ")) {
      const withoutDash = trimmedLine.substring(1).trim();
      const colonIndex = withoutDash.indexOf(" : ");
      if (colonIndex > 0) {
        const label = withoutDash.substring(0, colonIndex).trim();
        const value = withoutDash.substring(colonIndex + 3).trim();
        elements.push(createLabelValueParagraph(label, value, 0.25));
        continue;
      }
    }

    // BAB / Section headers
    if (/^BAB\s+[IVXLCDM]+/i.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, bold: true, size: 28, color: "2c5282" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
        }),
      );
      continue;
    }

    // PASAL headers
    if (/^PASAL\s+\d+/i.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, bold: true, size: 24, color: "2d3748" })],
          alignment: AlignmentType.LEFT,
          spacing: { before: 300, after: 150 },
        }),
      );
      continue;
    }

    // Numbered section headers (e.g., "1. TUJUAN")
    if (/^[0-9]+\.\s+[A-Z]/.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 150 },
        }),
      );
      continue;
    }

    // Sub-numbered items (e.g., "1.1", "2.3")
    if (/^[0-9]+\.[0-9]+\.?\s+/.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, bold: true, size: 22 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          indent: { left: convertInchesToTwip(0.25) },
        }),
      );
      continue;
    }

    // All caps headers
    if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5 && /^[A-Z\s\-()]+$/.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, bold: true, size: 24, color: "2d3748" })],
          spacing: { before: 300, after: 150 },
        }),
      );
      continue;
    }

    // Bullet points
    if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
      const bulletText = trimmedLine.substring(1).trim();
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: bulletText, size: 22 })],
          bullet: { level: 0 },
          spacing: { before: 50, after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
      );
      continue;
    }

    // Lettered items (a., b., c.)
    if (/^[a-z]\.\s+/.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, size: 22 })],
          spacing: { before: 50, after: 50 },
          indent: { left: convertInchesToTwip(0.75) },
        }),
      );
      continue;
    }

    // Date/place lines
    if (/^[A-Za-z]+,\s+\d+/.test(trimmedLine)) {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine, size: 22 })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 300, after: 100 },
        }),
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      new Paragraph({
        children: [new TextRun({ text: trimmedLine, size: 22 })],
        spacing: { before: 50, after: 100 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    );
  }

  return elements;
}

export async function generateAndDownloadDocx(options: DocumentOptions): Promise<void> {
  const { title, businessName, content } = options;

  const paragraphs = parseContent(content, title);

  const doc = new Document({
    creator: "SAH-in Aja!",
    title: title,
    description: `Dokumen ${title} untuk ${businessName}`,
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
            },
          },
        },
        heading1: {
          run: {
            font: "Calibri",
            size: 28,
            bold: true,
            color: "2d3748",
          },
          paragraph: {
            spacing: {
              before: 300,
              after: 150,
            },
          },
        },
        heading2: {
          run: {
            font: "Calibri",
            size: 24,
            bold: true,
            color: "4a5568",
          },
          paragraph: {
            spacing: {
              before: 200,
              after: 100,
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Calibri",
            size: 22,
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 50,
              after: 100,
            },
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullet-points",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.25),
            },
            size: {
              width: convertInchesToTwip(8.5),
              height: convertInchesToTwip(11),
            },
          },
        },
        headers: {
          default: createHeader(title),
        },
        footers: {
          default: createFooter(businessName),
        },
        children: [
          // Document title
          new Paragraph({
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 36,
                color: "1a365d",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
          }),
          // Business name subtitle
          new Paragraph({
            children: [
              new TextRun({
                text: businessName,
                size: 24,
                color: "4a5568",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            border: {
              bottom: {
                color: "2c5282",
                style: BorderStyle.SINGLE,
                size: 12,
                space: 10,
              },
            },
          }),
          // Content
          ...paragraphs,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_")}_${businessName.replace(/\s+/g, "_")}.docx`);
}

import jsPDF from "jspdf";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile, readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Vehicle } from "../../vehicles/types";
import { ServiceEntry } from "../types";

// ---------- Business Details ----------
const BUSINESS = {
  nameBlue: "AUTOCENTER",
  nameRed: "ΠΕΤΡΟΠΟΥΛΟΣ",
  subtitle: "Συνεργείο Αυτοκινήτων",
  address: "Π. ΚΑΛΟΓΕΡΟΠΟΥΛΟΥ 10, Γαργαλιάνοι",
  phone: "Τηλ: 27630 22267",
  email: "scorpios71@gmail.com",
};

// ---------- PDF Configuration ----------
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR_TEXT_MAIN: [number, number, number] = [0, 0, 0];
const COLOR_TEXT_MUTED: [number, number, number] = [80, 80, 80];
const COLOR_BORDER: [number, number, number] = [180, 180, 180];
const COLOR_BRAND_BLUE: [number, number, number] = [29, 78, 216];
const COLOR_BRAND_RED: [number, number, number] = [185, 28, 28]; 

let cachedFonts: { regular: string; bold: string } | null = null;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000; 
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function loadFontsAsBase64(): Promise<{ regular: string; bold: string }> {
  if (cachedFonts) return cachedFonts;

  const [regularBytes, boldBytes] = await Promise.all([
    readFile("resources/fonts/NotoSans-Regular.ttf", { baseDir: BaseDirectory.Resource }),
    readFile("resources/fonts/NotoSans-Bold.ttf", { baseDir: BaseDirectory.Resource }),
  ]);

  cachedFonts = {
    regular: bytesToBase64(regularBytes),
    bold: bytesToBase64(boldBytes),
  };

  return cachedFonts;
}

async function createInitializedDoc(): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  try {
    const { regular, bold } = await loadFontsAsBase64();

    doc.addFileToVFS("NotoSans-Regular.ttf", regular);
    doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");

    doc.addFileToVFS("NotoSans-Bold.ttf", bold);
    doc.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");

    doc.setFont("NotoSans", "normal");
  } catch (error) {
    console.error(
      "Αποτυχία φόρτωσης γραμματοσειράς NotoSans, γίνεται fallback σε Helvetica (τα ελληνικά δεν θα εμφανιστούν σωστά):",
      error,
    );
    doc.setFont("helvetica", "normal");
  }

  return doc;
}

function fontName(doc: jsPDF): string {
  const fonts = doc.getFontList();
  return fonts["NotoSans"] ? "NotoSans" : "helvetica";
}

function drawHeader(doc: jsPDF, vehicle: Vehicle): number {
  const FONT = fontName(doc);

  doc.setFont(FONT, "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLOR_BRAND_BLUE);
  doc.text(BUSINESS.nameBlue, MARGIN, 20);
  const blueWidth = doc.getTextWidth(BUSINESS.nameBlue + " ");
  doc.setTextColor(...COLOR_BRAND_RED);
  doc.text(BUSINESS.nameRed, MARGIN + blueWidth, 20);

  doc.setFont(FONT, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text(BUSINESS.subtitle, MARGIN, 26);

  doc.setFontSize(9);
  const rightX = PAGE_WIDTH - MARGIN;
  doc.text(BUSINESS.address, rightX, 18, { align: "right" });
  doc.text(BUSINESS.phone, rightX, 22.5, { align: "right" });
  doc.text(BUSINESS.email, rightX, 27, { align: "right" });

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 32, PAGE_WIDTH - MARGIN, 32);

  doc.setFont(FONT, "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.text("ΙΣΤΟΡΙΚΟ ΕΡΓΑΣΙΩΝ ΟΧΗΜΑΤΟΣ", PAGE_WIDTH / 2, 42, { align: "center" });
  
  const boxY = 48;
  const boxH = 16;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, boxY, CONTENT_WIDTH, boxH);

  const centerX = PAGE_WIDTH / 2;
  const col1X = centerX - CONTENT_WIDTH * 0.18;
  const col2X = centerX + CONTENT_WIDTH * 0.18;

  const labelY = boxY + 6;
  const valueY = boxY + 11.5;

  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.setFont(FONT, "bold");
  doc.text("ΟΧΗΜΑ", col1X, labelY, { align: "center" });
  doc.text("ΠΙΝΑΚΙΔΑ", col2X, labelY, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.setFont(FONT, "normal");
  doc.text(`${vehicle.make} ${vehicle.model}`, col1X, valueY, { align: "center" });
  doc.text(vehicle.plate || "-", col2X, valueY, { align: "center" });

  return boxY + boxH + 12;
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const FONT = fontName(doc);
  const footerY = PAGE_HEIGHT - 15;

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, footerY - 4, PAGE_WIDTH - MARGIN, footerY - 4);

  doc.setFont(FONT, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_MUTED);

  const generatedOn = new Date().toLocaleDateString("el-GR");
  doc.text(`Εκτυπώθηκε: ${generatedOn}`, PAGE_WIDTH / 2, footerY, {
    align: "center",
  });

  doc.text(`Σελίδα ${pageNum} / ${totalPages}`, PAGE_WIDTH - MARGIN, footerY, {
    align: "right",
  });
}

function drawWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5,
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return lines.length * lineHeight;
}

function drawServiceCard(
  doc: jsPDF,
  service: ServiceEntry,
  x: number,
  y: number,
  width: number,
): number {
  const FONT = fontName(doc);
  const cardPaddingX = 6;
  const startY = y;
  let cursorY = y + 7;

  doc.setFont(FONT, "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.text(`Ημερομηνία: ${String(service.service_date)}`, x + cardPaddingX, cursorY);

  if (service.mileage !== null && service.mileage !== undefined) {
    const mileageLabel = `${service.mileage.toLocaleString("el-GR")} km`;
    doc.text(mileageLabel, x + width - cardPaddingX, cursorY, { align: "right" });
  }

  cursorY += 4;

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.1);
  doc.line(x + cardPaddingX, cursorY, x + width - cardPaddingX, cursorY);
  cursorY += 6;

  doc.setFont(FONT, "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_MUTED);
  doc.text("ΠΕΡΙΓΡΑΦΗ ΕΡΓΑΣΙΩΝ", x + cardPaddingX, cursorY);
  cursorY += 5;

  doc.setFont(FONT, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  const descHeight = drawWrappedText(
    doc,
    service.work_description || "-",
    x + cardPaddingX,
    cursorY,
    width - cardPaddingX * 2,
  );

  cursorY += descHeight + 4;

  const totalHeight = cursorY - startY;

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.2);
  doc.rect(x, startY, width, totalHeight);

  return totalHeight;
}

function measureCardHeight(doc: jsPDF, service: ServiceEntry, width: number): number {
  const cardPaddingX = 6;
  let h = 7 + 4 + 6;
  h += 5;

  const descLines = doc.splitTextToSize(service.work_description || "-", width - cardPaddingX * 2);
  h += descLines.length * 5 + 4;

  return h;
}

export async function generateServiceHistoryPDF(
  vehicle: Vehicle,
  serviceHistory: ServiceEntry[],
): Promise<{ canceled: boolean; filePath?: string }> {
  const doc = await createInitializedDoc();

  const sortedHistory = [...serviceHistory].sort((a, b) =>
    a.service_date < b.service_date ? 1 : -1,
  );

  const MAX_Y = PAGE_HEIGHT - 25;
  const START_Y = 75;

  const pages: ServiceEntry[][] = [];
  let currentPageItems: ServiceEntry[] = [];
  let currentY = START_Y;

  if (sortedHistory.length === 0) {
    pages.push([]);
  } else {
    for (const service of sortedHistory) {
      const cardHeight = measureCardHeight(doc, service, CONTENT_WIDTH);
      const spaceNeeded = cardHeight + 6;

      if (currentY + spaceNeeded > MAX_Y && currentPageItems.length > 0) {
        pages.push(currentPageItems);
        currentPageItems = [];
        currentY = START_Y;
      }

      currentPageItems.push(service);
      currentY += spaceNeeded;
    }
    if (currentPageItems.length > 0) {
      pages.push(currentPageItems);
    }
  }

  const totalPages = pages.length;

  pages.forEach((items, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    let y = drawHeader(doc, vehicle);

    if (items.length === 0) {
      const FONT = fontName(doc);
      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_TEXT_MUTED);
      doc.text("Δεν υπάρχουν καταχωρημένες εργασίες.", MARGIN, y + 10);
    } else {
      items.forEach((service) => {
        const height = drawServiceCard(doc, service, MARGIN, y, CONTENT_WIDTH);
        y += height + 6;
      });
    }

    drawFooter(doc, pageIndex + 1, totalPages);
  });

  const defaultFileName = `${vehicle.plate || "vehicle"}_service_history.pdf`.replace(
    /\s+/g,
    "_",
  );

  const filePath = await save({
    defaultPath: defaultFileName,
    filters: [{ name: "PDF Document", extensions: ["pdf"] }],
  });

  if (!filePath) {
    return { canceled: true };
  }

  const pdfBytes = doc.output("arraybuffer");
  await writeFile(filePath, new Uint8Array(pdfBytes));

  return { canceled: false, filePath };
}
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function convertHtmlToPdf(htmlPath, pdfPath) {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Users\\acer1\\AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  let edgeExe = edgePaths.find(p => fs.existsSync(p));
  if (!edgeExe) {
    throw new Error('Microsoft Edge executable not found.');
  }

  const absHtml = path.resolve(htmlPath);
  const absPdf = path.resolve(pdfPath);

  const outDir = path.dirname(absPdf);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Converting: ${absHtml} -> ${absPdf}`);
  console.log(`Using Edge: ${edgeExe}`);

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--no-pdf-header-footer',
    `--print-to-pdf=${absPdf}`,
    `file:///${absHtml.replace(/\\/g, '/')}`
  ];

  execFileSync(edgeExe, args, { stdio: 'inherit', timeout: 90000 });

  if (fs.existsSync(absPdf)) {
    const stats = fs.statSync(absPdf);
    console.log(`Success! Generated PDF: ${absPdf} (${stats.size} bytes)`);
    return true;
  } else {
    throw new Error(`PDF was not created at ${absPdf}`);
  }
}

if (require.main === module) {
  const [,, inHtml, outPdf] = process.argv;
  if (!inHtml || !outPdf) {
    console.log('Usage: node print_pdf.cjs <input.html> <output.pdf>');
    process.exit(1);
  }
  convertHtmlToPdf(inHtml, outPdf);
}

module.exports = { convertHtmlToPdf };

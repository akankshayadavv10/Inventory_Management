import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { toWords } from 'number-to-words'
// import landdevImg from "../assets/landdev.png"
// import enterprisesImg from "../assets/enterprises.jpg"

// Accepts manualInvoice with your manual invoice shape, optionally company info
export const generatePDFManualInvoice = (invoice, companyInput, mode = 'download') => {
  const doc = new jsPDF('portrait', 'mm', 'a4')

  // Use passed company info or fallback default company info
  const company = companyInput || invoice.companyInfo || {
    name: 'AKSHAY ENTERPRISES and LAND DEVELOPERS',
    email: 'akshay@example.com',
    phone: '7774899641',
    address: 'Gat No-1771, Jakate Mala, Mali Mala, Talegaon Dhamdhere, Tal-Shirur, Dist-Pune 412208.',
    gstin: '27AARPA1234F1Z5',
    state: 'Maharashtra',
    stateCode: '27',
    bankDetails: {
      bankName: 'Janaseva Bank',
      branch: 'Shikrapur Br.',
      accountNumber: '08021001745',
      ifsc: 'JANA0000008',
    },
  }

  // Add background letterhead based on company type if applicable
  if (company.type === "land_developers") {
    doc.addImage(landdevImg, 'PNG', 0, 0, 210, 297)
  } else if (company.type === "enterprises") {
    doc.addImage(enterprisesImg, 'PNG', 0, 0, 210, 297)
  } else if (company.type === "transport") {
    doc.addImage(enterprisesImg, 'PNG', 0, 0, 210, 297)
  }

  // Helper to safely format date string
  const formatDateSafe = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? '' : format(d, 'dd-MM-yyyy')
  }

  const pageWidth = doc.internal.pageSize.getWidth()
  const rightMargin = pageWidth - 14
  let y = 13

  // Header - Company Name & Contact Info
  doc.setFontSize(16).setFont('helvetica', 'bold')
  doc.text(company.name, rightMargin, y, { align: 'right' })
  y += 6
  doc.setFontSize(9).setFont('helvetica', 'normal')
  doc.text(`Email: ${company.email}  |  Mobile No. ${company.contact}`, rightMargin, y, { align: 'right' })
  y += 5
  doc.text(`Address: ${company.address}`, rightMargin, y, { align: 'right', maxWidth: 100 })
  y += 7.5
  doc.text(
    `State: ${company.state}, Code: ${company.stateCode}  |  GSTIN: ${company.GSTNo}`,
    rightMargin,
    y,
    { align: 'right' }
  )

  // Tax Invoice Title
  doc.setFontSize(10).setFont('helvetica', 'bold')
  doc.text(`"TAX INVOICE"`, 105, 45, { align: 'center' })

  // Consignee & Bill To sections
  y = 50
  doc.setFontSize(9).setFont('helvetica', 'bold')
  doc.text('Consignee (Ship To):', 15, y + 1)
  doc.text('Buyer (Bill To):', 110, y + 1)
  y = 51
  doc.setFont('helvetica', 'normal')

  const cons = invoice.customer || {}
  const consigneeName = cons.consigneeName || cons.name || ''
  const consigneeAddress = cons.consigneeAddress || cons.address || ''
  const consigneeGstin = cons.consigneeGstin || cons.gstin || '-'
  const consigneeState = cons.consigneeState || cons.state || ''
  const consigneeStateCode = cons.consigneeStateCode || cons.stateCode || ''

  const billToName = cons.billToName || consigneeName
  const billToAddress = cons.billToAddress || consigneeAddress
  const billToGstin = cons.billToGstin || consigneeGstin
  const billToState = cons.billToState || consigneeState
  const billToStateCode = cons.billToStateCode || consigneeStateCode

  // Draw Consignee on left
  doc.text(consigneeName, 15, y + 5)
  doc.text(consigneeAddress, 15, y + 8, { maxWidth: 90 })
  doc.text(`GSTIN NO. : ${consigneeGstin}`, 15, y + 18)
  doc.text(`STATE NAME: ${consigneeState.toUpperCase()}, STATE CODE: ${consigneeStateCode}`, 15, y + 22)

  // Draw Bill To on right
  doc.text(billToName, 110, y + 5)
  doc.text(billToAddress, 110, y + 8, { maxWidth: 90 })
  doc.text(`GSTIN NO. : ${billToGstin}`, 110, y + 18)
  doc.text(`STATE NAME: ${billToState}, STATE CODE: ${billToStateCode}`, 110, y + 22)

  // Invoice meta info
  doc.setFontSize(8)
  doc.text('GST Tax Invoice No', 15, 82)
  doc.text(`: ${invoice.invoiceNo}`, 55, 82)
  doc.text('Purchase Order No', 15, 86)
  doc.text(`: ${invoice.purchaseOrderNumber || '-'}`, 55, 86)
  doc.text(`Eway Bill No `, 15, 90)
  doc.text(`: ${invoice.eWayBillNo || '-'}`, 55, 90)

  doc.text('GST Tax Invoice Date', 110, 82)
  doc.text(`: ${formatDateSafe(invoice.date)}`, 150, 82)
  doc.text('Purchase Order Date', 110, 86)
  doc.text(`: ${formatDateSafe(invoice.purchaseOrderDate) || "-"}`, 150, 86)
  doc.text('Transportation ', 110, 90)
  doc.text(`: ${invoice.transportation || "-"}`, 150, 90)

  // Table of items
  const tableHead = [[
    'Sr. No.', 'Item Name', 'Category', 'Supplier', 'Location',
    'Qty', 'Unit Price', 'Amount',
  ]]

  const tableBody = invoice.items.map((item, idx) => [
    `${idx + 1}`,
    item.name || '',
    item.category || '',
    item.supplier || '',
    item.location || '',
    item.quantity || 0,
    Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
  ])

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 92,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.1, lineColor: 0 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0 },
  })

  // Tax Calculation Table
  const taxTableY = doc.lastAutoTable.finalY + 8
  const taxRateText = `${invoice.taxRate || 18}%`
  const cgstRate = `${(invoice.taxRate / 2) || 9}%`
  const sgstRate = cgstRate

  // Footer summary
  let footerY = doc.lastAutoTable.finalY + 4
  const totalsX = 133

  doc.setFontSize(8).setFont('helvetica', 'bold')
  doc.text('Rupees in Words:', 14, footerY)
  doc.setFont('helvetica', 'normal')
  const totalInWords = toWords(Math.round(invoice.totalAmount || 0))
  doc.text(
    `${totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1)} Rupees Only`,
    14,
    footerY + 4,
    { maxWidth: 115 }
  )

  doc.text('Sub Total', totalsX, footerY)
  doc.text(
    Number(invoice.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    176,
    footerY
  )
  doc.text(`CGST @${invoice.taxRate / 2}%`, totalsX, footerY + 4)
  doc.text(
    Number(invoice.CGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    176,
    footerY + 4
  )
  doc.text(`SGST @${invoice.taxRate / 2}%`, totalsX, footerY + 8)
  doc.text(
    Number(invoice.SGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    176,
    footerY + 8
  )
  doc.setFont('helvetica', 'bold')
  doc.line(totalsX - 3, footerY + 10, 190, footerY + 10)
  doc.text('Grand Total', totalsX, footerY + 13)
  doc.text(
    Number(invoice.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    176,
    footerY + 13
  )

  autoTable(doc, {
    startY: taxTableY + 11,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1, lineWidth: 0.1, lineColor: 0 },
    headStyles: { fillColor: [255, 255, 255], textColor: 0 },
    head: [['TAX RATE', 'Taxable Amount', 'CGST Rate', 'Tax', 'SGST Rate', 'Tax']],
    body: [[
      taxRateText,
      Number(invoice.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      cgstRate,
      Number(invoice.CGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      sgstRate,
      Number(invoice.SGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    ]],
    tableWidth: 115,
  })

  // Declaration / Terms & Conditions block
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerBlockHeight = 48;
  const declY = pageHeight - footerBlockHeight - 30;

  doc.line(130, declY, 130, declY + 22)
  doc.setFontSize(7).setFont('helvetica', 'bold')
  doc.text('Declaration :-', 12, declY + 4)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
    12,
    declY + 7,
    { maxWidth: 115 }
  )
  doc.setFont('helvetica', 'bold')
  doc.text('Terms & Conditions:-', 12, declY + 12)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Interest @ 18% p.m. will be charged if payment is not made within due date.',
    12,
    declY + 15,
    { maxWidth: 115 }
  )
  doc.text('Subject to Pune Jurisdiction.', 12, declY + 18)

  doc.text('Material received in good condition as per order.', rightMargin - 30, declY + 4, { align: 'center' })
  doc.text("Customer's Seal and Signature", rightMargin - 30, declY + 18, { align: 'center' })

  // Bank Details and Authorized Signatory block
  doc.line(130, declY + 22, 130, declY + 48)
  doc.setFontSize(7).setFont('helvetica', 'bold')
  doc.text(`Bank: ${company.bankDetails?.bankName || "-"}`, 12, declY + 27)
  doc.text(`Branch: ${company.bankDetails?.branch}`, 12, declY + 31)
  doc.text(`A/C No.: ${company.bankDetails?.accountNumber}`, 12, declY + 35)
  doc.text(`IFSC Code: ${company.bankDetails?.ifsc}`, 12, declY + 39)

  doc.text(`For ${company.name}`, rightMargin - 30, declY + 27, { align: 'center' })
  doc.text('Authorized Signatory', rightMargin - 30, declY + 46, { align: 'center' })

  // Outer border
  doc.rect(10, 40, 192, declY + 48 - 40)
  doc.line(10, 47, 202, 47)
  doc.line(10, 78, 202, 78)
  doc.line(105, 47, 105, 78)

  // Save or return the PDF
  if (mode === 'blob') {
    return doc.output('blob')
  }
  doc.save(`Invoice-${invoice.invoiceNo || invoice._id}.pdf`)
}

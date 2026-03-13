import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementToPDF = async (
  elementId: string,
  filename: string,
  options: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | [number, number];
    margin?: number;
  } = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const originalParent = element.parentElement;
  const originalNextSibling = element.nextSibling;
  
  // Temporarily move to body to ensure it's rendered correctly by html2canvas
  document.body.appendChild(element);
  
  const originalStyle = element.getAttribute('style');
  element.style.position = 'absolute';
  element.style.left = '0';
  element.style.top = '0';
  element.style.zIndex = '-1';

  try {
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFBF7',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const orientation = options.orientation || 'portrait';
    const format = options.format || 'a4';
    const margin = options.margin !== undefined ? options.margin : 0;
    
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let position = margin;
    
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    let heightLeft = imgHeight - (pdfHeight - (margin * 2));
    
    while (heightLeft > 0) {
      position = position - pdfHeight + (margin * 2);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } finally {
    // Restore original style and position
    if (originalStyle) {
      element.setAttribute('style', originalStyle);
    } else {
      element.removeAttribute('style');
    }
    
    if (originalParent) {
      if (originalNextSibling) {
        originalParent.insertBefore(element, originalNextSibling);
      } else {
        originalParent.appendChild(element);
      }
    }
  }
};

export const exportMultipleElementsToPDF = async (
  elementIds: string[],
  filename: string,
  options: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | [number, number];
    margin?: number;
  } = {}
) => {
  if (elementIds.length === 0) return;

  const orientation = options.orientation || 'portrait';
  const format = options.format || 'a4';
  const margin = options.margin !== undefined ? options.margin : 0;
  
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth - (margin * 2);

  for (let i = 0; i < elementIds.length; i++) {
    const elementId = elementIds[i];
    const element = document.getElementById(elementId);
    if (!element) continue;

    const originalParent = element.parentElement;
    const originalNextSibling = element.nextSibling;
    
    document.body.appendChild(element);

    const originalStyle = element.getAttribute('style');
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '-1';

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFBF7',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (i > 0) {
        pdf.addPage();
      }
      
      let position = margin;
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      
      let heightLeft = imgHeight - (pdfHeight - (margin * 2));
      while (heightLeft > 0) {
        position = position - pdfHeight + (margin * 2);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    } finally {
      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }
      
      if (originalParent) {
        if (originalNextSibling) {
          originalParent.insertBefore(element, originalNextSibling);
        } else {
          originalParent.appendChild(element);
        }
      }
    }
  }

  pdf.save(filename);
};

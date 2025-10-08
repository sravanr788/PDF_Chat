// PDFViewer.jsx
import React, { useEffect } from 'react';
import { Document, Page } from "react-pdf";
import { ChevronUp, ChevronDown } from "lucide-react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const PDFViewer = ({
  file,
  chatWidth,
  numPages,
  currentPage,
  scale,
  pdfViewerRef,
  onDocumentLoadSuccess,
  navigateToPage,
  setScale,
}) => {

  // Simple function to change scale up/down
  const handleZoom = (change) => {
    setScale(prevScale => Math.min(2.0, Math.max(0.5, prevScale + change)));
  };

  useEffect(() => {
    const pageElement = document.getElementById(`page_container_${currentPage}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);  

  return (
    // PDF Viewer
    file && Document && Page ? (
      <div
        className="overflow-y-scroll bg-gray-100 relative h-full flex-1"
        style={{ width: `${100 - chatWidth}%` }}
        ref={pdfViewerRef}
      >
        {/* PDF Controls */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-lg min-w-[100px] text-center">
              Page {currentPage} of {numPages || '...'}
            </span>
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage >= numPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {/* Zoom controls */}
            <button
              onClick={() => handleZoom(-0.1)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              -
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center px-2 py-1 bg-gray-100 rounded-lg">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* PDF Document */}
        <div className="flex justify-center items-start p-6">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_container_${index + 1}`}
                id={`page_container_${index + 1}`}
                className="mb-6"
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  className="shadow-lg border border-gray-200 rounded-lg overflow-hidden"
                  loading={
                    <div className="flex items-center justify-center p-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p>Loading page {index + 1}...</p>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    ) : file ? (
      <div className="flex flex-1 items-center justify-center" style={{ width: `${100 - chatWidth}%` }}>
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p>Initializing PDF viewer...</p>
        </div>
      </div>
    ) : null
  );
};

export default PDFViewer;
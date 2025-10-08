import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const PDFViewer = ({ file, currentPage, onPageChange }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const totalPages = 5; // Mock total pages

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* PDF Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[4rem] text-center">
            {zoom}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <button
            onClick={handleRotate}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center top'
            }}
          >
            {/* Mock PDF Page */}
            <div className="w-[600px] h-[800px] bg-white border border-gray-300 p-8 text-gray-800">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Document Title</h1>
                <p className="text-sm text-gray-600">Page {currentPage}</p>
              </div>
              
              <div className="space-y-4 text-sm leading-relaxed">
                <p>
                  This is a mock PDF viewer showing page {currentPage} of the document "{file.name}". 
                  In a real implementation, this would render the actual PDF content using a library like PDF.js.
                </p>
                
                <p>
                  The viewer supports zooming, rotation, and page navigation. When citations are clicked 
                  in the chat interface, the viewer will automatically jump to the referenced page and 
                  highlight the relevant section.
                </p>
                
                <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 my-6">
                  <p className="text-yellow-800">
                    <strong>Highlighted Section:</strong> This represents content that would be highlighted 
                    when referenced by a citation from the chat interface.
                  </p>
                </div>
                
                <p>
                  The PDF viewer is fully responsive and provides an intuitive interface for document navigation 
                  and interaction. Users can easily move between pages, adjust zoom levels for better readability, 
                  and rotate pages as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
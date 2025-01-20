import React from 'react';

export default function ImageModal({ isOpen, onClose, imageUrl }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="relative max-w-4xl max-h-[90vh] w-auto h-auto"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt="Imagen ampliada"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

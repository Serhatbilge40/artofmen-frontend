'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => setSelectedImage(index);
    const closeLightbox = () => setSelectedImage(null);
    const prevImage = () => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : (prev ?? 0) - 1));
    const nextImage = () => setSelectedImage((prev) => ((prev ?? 0) + 1) % images.length);

    return (
        <>
            <section className="py-32 md:py-48 bg-[#0F0F0F] relative">
                {/* Section header */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <span className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-4 block">
                            Impressionen
                        </span>
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Galerie
                        </h2>
                    </motion.div>
                </div>

                {/* Grid Layout */}
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative cursor-pointer group overflow-hidden
                  ${index === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-[4/5]'}`}
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={image}
                                    alt={`${productName} - Bild ${index + 1}`}
                                    fill
                                    className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                                    sizes={index === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />

                                {/* Decorative corners on hover */}
                                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/0 group-hover:border-white/50 transition-all duration-500" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/0 group-hover:border-white/50 transition-all duration-500" />

                                {/* Zoom icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors z-10"
                        >
                            <X size={28} strokeWidth={1} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-6 p-4 text-white/50 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={40} strokeWidth={1} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-6 p-4 text-white/50 hover:text-white transition-colors"
                        >
                            <ChevronRight size={40} strokeWidth={1} />
                        </button>

                        {/* Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-5xl h-[80vh] mx-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedImage]}
                                alt={`${productName} - Bild ${selectedImage + 1}`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                            <div className="w-8 h-px bg-white/20" />
                            <span className="text-white/50 text-sm tracking-[0.2em]">
                                {selectedImage + 1} / {images.length}
                            </span>
                            <div className="w-8 h-px bg-white/20" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

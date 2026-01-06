'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';

export interface Hotspot {
    id: string;
    x: number;
    y: number;
    title: string;
    description: string;
    details?: {
        material?: string;
        origin?: string;
        care?: string;
        features?: string[];
    };
}

export interface InteractiveImage {
    imageUrl: string;
    imageIndex: number;
    hotspots: Hotspot[];
}

interface InteractiveHotspotsProps {
    interactiveImages: InteractiveImage[];
    productName: string;
}

export default function InteractiveHotspots({ interactiveImages, productName }: InteractiveHotspotsProps) {
    const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    if (!interactiveImages || interactiveImages.length === 0) return null;

    const currentImage = interactiveImages[activeImageIndex];

    return (
        <section className="py-32 md:py-48 bg-[#080808] relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Section header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#8B7355]/50" />
                        <span className="text-xs tracking-[0.4em] uppercase text-[#8B7355]">
                            Details erkunden
                        </span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#8B7355]/50" />
                    </div>
                    
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Die <span className="italic text-[#A0826D]">Handwerkskunst</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Jedes Detail erzählt eine Geschichte. Berühren Sie die goldenen Punkte, 
                        um die Geheimnisse dieses Meisterwerks zu entdecken.
                    </p>
                </motion.div>
            </div>

            {/* Image selector if multiple interactive images */}
            {interactiveImages.length > 1 && (
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
                    <div className="flex justify-center gap-3">
                        {interactiveImages.map((img, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveImageIndex(index)}
                                className={`relative w-16 h-20 md:w-20 md:h-28 overflow-hidden transition-all duration-500 ${
                                    activeImageIndex === index 
                                        ? 'ring-1 ring-[#8B7355] ring-offset-4 ring-offset-[#080808] scale-105' 
                                        : 'opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
                                }`}
                            >
                                <Image
                                    src={img.imageUrl}
                                    alt={`Ansicht ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Interactive Image Container */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden"
                >
                    {/* Elegant border frame */}
                    <div className="absolute inset-0 border border-[#8B7355]/20 z-10 pointer-events-none" />
                    <div className="absolute inset-3 border border-[#8B7355]/10 z-10 pointer-events-none" />

                    {/* Main Image */}
                    <Image
                        src={currentImage.imageUrl}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 80vw"
                        priority
                    />

                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

                    {/* Hotspots */}
                    {currentImage.hotspots.map((hotspot, index) => (
                        <motion.button
                            key={hotspot.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.15, duration: 0.6, type: 'spring', bounce: 0.4 }}
                            className="absolute group z-20"
                            style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onClick={() => setSelectedHotspot(hotspot)}
                        >
                            {/* Outer pulse rings */}
                            <span className="absolute inset-0 w-14 h-14 -m-5 rounded-full border border-[#8B7355]/20 animate-[ping_2s_ease-out_infinite]" />
                            <span className="absolute inset-0 w-10 h-10 -m-3 rounded-full border border-[#8B7355]/30 animate-[ping_2s_ease-out_0.5s_infinite]" />
                            
                            {/* Glow effect */}
                            <span className="absolute inset-0 w-8 h-8 -m-2 rounded-full bg-[#8B7355]/20 blur-md group-hover:bg-[#8B7355]/40 transition-all duration-500" />
                            
                            {/* Main dot with plus icon */}
                            <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#A0826D] to-[#8B7355] border border-white/30 shadow-[0_0_20px_rgba(139,115,85,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(139,115,85,0.7)] transition-all duration-300">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </span>

                            {/* Elegant tooltip on hover */}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 pointer-events-none">
                                <span className="block px-4 py-2 bg-black/95 backdrop-blur-md border border-[#8B7355]/30 text-white text-xs tracking-[0.15em] uppercase whitespace-nowrap">
                                    {hotspot.title}
                                </span>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#8B7355]/30" />
                            </span>
                        </motion.button>
                    ))}

                    {/* Corner accents */}
                    <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-[#8B7355]/40 pointer-events-none" />
                    <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-[#8B7355]/40 pointer-events-none" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-[#8B7355]/40 pointer-events-none" />
                    <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-[#8B7355]/40 pointer-events-none" />
                </motion.div>

                {/* Instruction hint */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="text-center mt-8"
                >
                    <span className="inline-flex items-center gap-3 text-gray-600 text-sm tracking-wider">
                        <span className="w-8 h-px bg-gray-700" />
                        Berühren Sie die Punkte für Details
                        <span className="w-8 h-px bg-gray-700" />
                    </span>
                </motion.div>
            </div>

            {/* Detail Modal - Elegant Slide-in Panel */}
            <AnimatePresence>
                {selectedHotspot && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedHotspot(null)}
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md md:max-w-lg bg-[#0A0A0A] border-l border-[#8B7355]/20 overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative top accent */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B7355]/50 to-transparent" />

                            {/* Close button */}
                            <motion.button
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setSelectedHotspot(null)}
                                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#8B7355]/50 hover:bg-[#8B7355]/10 transition-all duration-300 group"
                            >
                                <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </motion.button>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-8 pt-16 pb-8 border-b border-white/5"
                                >
                                    {/* Label */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-px bg-[#8B7355]" />
                                        <span className="text-xs tracking-[0.3em] uppercase text-[#8B7355]">
                                            Detail
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 
                                        className="text-3xl md:text-4xl text-white leading-tight"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {selectedHotspot.title}
                                    </h3>
                                </motion.div>

                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="px-8 py-8 border-b border-white/5"
                                >
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        {selectedHotspot.description}
                                    </p>
                                </motion.div>

                                {/* Details */}
                                {selectedHotspot.details && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="px-8 py-8 space-y-6"
                                    >
                                        {selectedHotspot.details.material && (
                                            <DetailRow 
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                    </svg>
                                                }
                                                label="Material" 
                                                value={selectedHotspot.details.material} 
                                            />
                                        )}
                                        
                                        {selectedHotspot.details.origin && (
                                            <DetailRow 
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                }
                                                label="Herkunft" 
                                                value={selectedHotspot.details.origin} 
                                            />
                                        )}
                                        
                                        {selectedHotspot.details.care && (
                                            <DetailRow 
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                }
                                                label="Pflege" 
                                                value={selectedHotspot.details.care} 
                                            />
                                        )}

                                        {/* Features */}
                                        {selectedHotspot.details.features && selectedHotspot.details.features.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="pt-6 border-t border-white/5"
                                            >
                                                <div className="flex items-center gap-3 mb-5">
                                                    <span className="text-[#8B7355]">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-xs tracking-[0.2em] uppercase text-[#8B7355]">
                                                        Besonderheiten
                                                    </span>
                                                </div>
                                                <ul className="space-y-3 pl-1">
                                                    {selectedHotspot.details.features.map((feature, idx) => (
                                                        <motion.li 
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                                            className="flex items-center gap-4 text-gray-300"
                                                        >
                                                            <ChevronRight className="w-4 h-4 text-[#8B7355] flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="px-8 py-6 border-t border-white/5 bg-black/50"
                            >
                                <button
                                    onClick={() => setSelectedHotspot(null)}
                                    className="w-full py-4 border border-[#8B7355]/30 text-[#8B7355] text-sm tracking-[0.2em] uppercase hover:bg-[#8B7355] hover:text-white transition-all duration-500"
                                >
                                    Schließen
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <span className="text-[#8B7355] mt-0.5">{icon}</span>
            <div className="flex-1">
                <span className="text-xs tracking-[0.15em] uppercase text-gray-500 block mb-1">
                    {label}
                </span>
                <span className="text-white">{value}</span>
            </div>
        </div>
    );
}

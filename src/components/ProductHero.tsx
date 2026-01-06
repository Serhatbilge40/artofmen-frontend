'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductHeroProps {
    name: string;
    category?: string;
    mainImage: string;
}

export default function ProductHero({ name, category, mainImage }: ProductHeroProps) {
    return (
        <section className="relative min-h-screen flex items-end overflow-hidden bg-[#0A0A0A]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {mainImage ? (
                    <>
                        <Image
                            src={mainImage}
                            alt={name}
                            fill
                            className="object-cover object-[center_20%] md:object-contain md:object-center"
                            priority
                            sizes="100vw"
                            quality={90}
                        />

                        {/* Mobile: Stronger bottom gradient for text */}
                        <div className="md:hidden absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent" />

                        {/* Desktop: Soft edge fades */}
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
                        <div className="hidden md:block absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
                        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-gray-800" />
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {category && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-3 md:mb-4"
                        >
                            {category}
                        </motion.p>
                    )}
                    <h1
                        className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-medium leading-tight md:leading-none text-white"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {name}
                    </h1>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-5 h-8 md:w-6 md:h-10 rounded-full border border-white/30 flex items-start justify-center p-1.5 md:p-2"
                    >
                        <div className="w-0.5 md:w-1 h-1.5 md:h-2 bg-white/50 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

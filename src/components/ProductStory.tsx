'use client';

import { motion } from 'framer-motion';

interface ProductStoryProps {
    story: string;
    description: string;
}

export default function ProductStory({ story, description }: ProductStoryProps) {
    return (
        <section className="py-32 md:py-48 bg-[#0A0A0A] relative">
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent" />

            <div className="max-w-4xl mx-auto px-6 md:px-12">
                {/* Description - Lead paragraph */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-24"
                >
                    <p
                        className="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-gray-200 font-light"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {description}
                    </p>
                </motion.div>

                {/* Decorative divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center gap-4 mb-24"
                >
                    <div className="w-24 h-px bg-gradient-to-r from-transparent to-[#8B7355]" />
                    <div className="text-[#8B7355] text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>✦</div>
                    <div className="w-24 h-px bg-gradient-to-l from-transparent to-[#8B7355]" />
                </motion.div>

                {/* Story Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-6 block">
                        Die Geschichte
                    </span>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl mb-12"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Hinter dem <span className="italic">Meisterwerk</span>
                    </h2>
                    <div
                        className="prose prose-lg prose-invert max-w-none
              prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-light prose-p:mb-8
              prose-headings:font-normal prose-headings:text-white
              prose-strong:text-white prose-strong:font-medium
              prose-a:text-[#8B7355] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#8B7355] prose-blockquote:text-gray-300 prose-blockquote:italic"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        dangerouslySetInnerHTML={{ __html: story }}
                    />
                </motion.div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent" />
        </section>
    );
}

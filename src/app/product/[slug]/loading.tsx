'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                {/* Elegant Loading Animation */}
                <motion.div className="relative w-16 h-16 mx-auto mb-8">
                    <motion.div
                        className="absolute inset-0 border border-[var(--color-brown-warm)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-2 border border-[var(--color-brown-light)]"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-4 border border-[var(--color-brown-muted)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.div>

                <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-gray-400 text-sm tracking-[0.3em] uppercase"
                >
                    Laden
                </motion.p>
            </motion.div>
        </div>
    );
}

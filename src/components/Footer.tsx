'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0A0A0A] border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3
                            className="text-xl mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Art Of Men
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Entdecken Sie die Geschichte hinter unseren exklusiven Produkten.
                            Jedes Stück erzählt eine einzigartige Geschichte von Handwerkskunst und Qualität.
                        </p>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h4 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-6">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-300 hover:text-white transition-colors text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="text-gray-300 hover:text-white transition-colors text-sm"
                                >
                                    Alle Produkte
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h4 className="text-sm tracking-[0.2em] uppercase text-gray-400 mb-6">
                            Kontakt
                        </h4>
                        <p className="text-gray-300 text-sm">
                            info@artofmen.de
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs tracking-wider">
                        © {currentYear} Art Of Men. Alle Rechte vorbehalten.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/datenschutz"
                            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                        >
                            Datenschutz
                        </Link>
                        <Link
                            href="/impressum"
                            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                        >
                            Impressum
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

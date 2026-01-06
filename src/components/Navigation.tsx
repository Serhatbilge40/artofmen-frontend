'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navigation() {
    const [hidden, setHidden] = useState(false);
    const [atTop, setAtTop] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        setHidden(latest > previous && latest > 150);
        setAtTop(latest < 50);
    });

    // Close mobile menu when scrolling
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: '-100%' },
                }}
                animate={hidden && !mobileMenuOpen ? 'hidden' : 'visible'}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${atTop && !mobileMenuOpen ? 'bg-transparent' : 'bg-black/80 backdrop-blur-md'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="group" onClick={() => setMobileMenuOpen(false)}>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="text-lg tracking-[0.2em] uppercase font-medium text-white group-hover:text-[var(--color-brown-warm)] transition-colors"
                            >
                                Art Of Men
                            </motion.span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-10">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/products">Produkte</NavLink>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-white z-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-30 bg-black/95 backdrop-blur-lg md:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex flex-col items-center justify-center h-full space-y-8"
                        >
                            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                                Home
                            </MobileNavLink>
                            <MobileNavLink href="/products" onClick={() => setMobileMenuOpen(false)}>
                                Produkte
                            </MobileNavLink>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm tracking-[0.15em] uppercase text-gray-300 hover:text-white transition-colors duration-300"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-2xl tracking-[0.2em] uppercase text-gray-300 hover:text-white transition-colors duration-300"
        >
            {children}
        </Link>
    );
}

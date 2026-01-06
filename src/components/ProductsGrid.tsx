'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Product {
    _id: string;
    slug: string;
    name: string;
    description: string;
    category?: string;
    images?: string[];
}

interface ProductsGridProps {
    products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-32">
                <p className="text-gray-500 text-lg">Noch keine Produkte vorhanden.</p>
                <p className="text-gray-600 text-sm mt-2">Besuchen Sie uns bald wieder.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product, index) => (
                <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                    <Link href={`/product/${product.slug}`} className="group block">
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#0F0F0F] mb-6">
                            {product.images?.[0] ? (
                                <>
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-all duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                                    {/* View button on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span className="px-6 py-3 bg-white/90 text-black text-xs tracking-[0.2em] uppercase">
                                            Ansehen
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl text-[#8B7355]/20 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            AM
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#8B7355]/0 group-hover:border-[#8B7355]/50 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#8B7355]/0 group-hover:border-[#8B7355]/50 transition-all duration-500" />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                            {product.category && (
                                <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355]">
                                    {product.category}
                                </p>
                            )}
                            <h2
                                className="text-xl group-hover:text-[#8B7355] transition-colors duration-300"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {product.name}
                            </h2>
                            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Underline animation */}
                            <div className="pt-4">
                                <div className="h-px bg-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[#8B7355] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}

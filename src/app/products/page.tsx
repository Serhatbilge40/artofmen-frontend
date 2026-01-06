import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductsGrid from '@/components/ProductsGrid';

export const metadata: Metadata = {
    title: 'Kollektion',
    description: 'Entdecken Sie unsere exklusive Kollektion von Anzügen und Accessoires.',
};

async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data.map((product) => ({
        _id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        images: product.images,
    }));
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Hero Header */}
            <section className="pt-40 pb-24 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <span className="text-sm tracking-[0.4em] uppercase text-[#8B7355] mb-6 block">
                        Art Of Men
                    </span>
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl mb-8"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Kollektion
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Entdecken Sie die Geschichten hinter unseren exklusiven Stücken.
                        Jedes Produkt erzählt eine einzigartige Geschichte von Handwerkskunst.
                    </p>

                    {/* Decorative line */}
                    <div className="mt-12 flex justify-center">
                        <div className="w-px h-16 bg-gradient-to-b from-[#8B7355] to-transparent" />
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <ProductsGrid products={products} />
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <h2
                        className="text-3xl md:text-4xl mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Persönliche Beratung gewünscht?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Besuchen Sie uns in einem unserer Stores für eine exklusive Beratung.
                    </p>
                    <a
                        href="https://artofmen.de/kontakt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 border border-[#8B7355] text-[#8B7355] text-sm tracking-[0.15em] uppercase hover:bg-[#8B7355] hover:text-white transition-all duration-500"
                    >
                        Termin vereinbaren
                    </a>
                </div>
            </section>
        </div>
    );
}

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductHero from '@/components/ProductHero';
import ProductStory from '@/components/ProductStory';
import ImageGallery from '@/components/ImageGallery';
import VideoPlayer from '@/components/VideoPlayer';
import { supabase } from '@/lib/supabase';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        _id: data.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        story: data.story,
        images: data.images,
        videos: data.videos,
        category: data.category,
        tags: data.tags,
        template: data.template,
        colorScheme: data.color_scheme,
        metadata: data.metadata,
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Produkt nicht gefunden',
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images?.[0] ? [product.images[0]] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const colorSchemeClass = product.colorScheme === 'light'
        ? 'light'
        : product.colorScheme === 'warm'
            ? 'warm'
            : '';

    return (
        <div className={colorSchemeClass}>
            <ProductHero
                name={product.name}
                category={product.category}
                mainImage={product.images?.[0] || ''}
            />

            <ProductStory
                story={product.story}
                description={product.description}
            />

            {product.images && product.images.length > 1 && (
                <ImageGallery
                    images={product.images.slice(1)}
                    productName={product.name}
                />
            )}

            {product.videos && product.videos.length > 0 && (
                <VideoPlayer
                    videos={product.videos}
                    productName={product.name}
                />
            )}

            {/* Call to Action */}
            <section className="py-32 md:py-48 bg-[#0A0A0A] text-center relative">
                {/* Top decorative line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent" />

                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <span className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-6 block">
                        Exklusiv für Sie
                    </span>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl mb-8"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Interesse an diesem <span className="italic">Meisterwerk?</span>
                    </h2>
                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Kontaktieren Sie uns für weitere Informationen zu diesem Produkt
                        oder besuchen Sie uns in einem unserer Ateliers in Düsseldorf, Dortmund oder Konstanz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://artofmen.de/termin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 bg-[#8B7355] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#A0826D] transition-all duration-500"
                        >
                            Termin vereinbaren
                        </a>
                        <a
                            href="mailto:info@artofmen.de"
                            className="px-10 py-4 border border-white/20 text-white text-sm tracking-[0.15em] uppercase hover:border-[#8B7355] hover:text-[#8B7355] transition-all duration-500"
                        >
                            Kontakt
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

interface ScrapedProduct {
    name: string;
    category: string;
    price: string;
    sizes: string;
    imageUrl: string | null;
}

// Exclude these phrases (marketing copy)
const EXCLUDE_PHRASES = [
    'für den wichtigsten Tag',
    'optimale Passform',
    'Änderungsmanufaktur',
    'Schnitt macht',
    'Anzug-Guide',
    'mehr als ein Kleidungsstück',
    'zeigt Ihnen',
    'worauf es ankommt',
    'Frack, Smoking & Co',
    'Slim Line',
    'Plus Line',
    'Long Line',
];

function isExcluded(name: string): boolean {
    const lower = name.toLowerCase();
    return EXCLUDE_PHRASES.some(p => lower.includes(p.toLowerCase()));
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const targetUrl = body.url || 'https://www.artofmen.de/lookbook/';

        const scrapingDogKey = process.env.SCRAPINGDOG_API_KEY;

        if (!scrapingDogKey) {
            return NextResponse.json(
                { error: 'SCRAPINGDOG_API_KEY not configured' },
                { status: 500, headers: corsHeaders }
            );
        }

        const scrapingDogUrl = `https://api.scrapingdog.com/scrape?api_key=${scrapingDogKey}&url=${encodeURIComponent(targetUrl)}&dynamic=true&wait=5000`;

        console.log('Scraping URL:', targetUrl);

        const response = await fetch(scrapingDogUrl, {
            method: 'GET',
            headers: { 'Accept': 'text/html' },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `ScrapingDog failed: ${response.status}` },
                { status: 500, headers: corsHeaders }
            );
        }

        const html = await response.text();
        console.log('HTML received, length:', html.length);

        const $ = cheerio.load(html);
        const products: ScrapedProduct[] = [];
        const productNames = new Set<string>();

        // Determine page type from URL
        const isSchuhe = targetUrl.includes('schuhe');
        const isAccessoires = targetUrl.includes('accessoires');
        const isLookbook = targetUrl.includes('lookbook');
        const isBraeutigam = targetUrl.includes('braeutigam');
        const isAlltag = targetUrl.includes('alltag');

        // Set category based on page
        let pageCategory = 'Kollektion';
        if (isSchuhe) pageCategory = 'Schuhe';
        else if (isAccessoires) pageCategory = 'Accessoires';
        else if (isBraeutigam) pageCategory = 'Bräutigam';
        else if (isAlltag) pageCategory = 'Alltag';
        else if (isLookbook) pageCategory = 'Lookbook';

        // ============ SCHUHE PAGE ============
        if (isSchuhe) {
            console.log('Scraping Schuhe page...');

            // Shoe types are in h2 or h3: Oxford, Derby, Monkstrap, Loafer
            const shoeTypes = ['Oxford', 'Derby', 'Monkstrap', 'Loafer', 'Chelsea', 'Sneaker', 'Budapester'];

            $('h2, h3, h4').each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim();

                // Check if this is a shoe type
                const isShoeType = shoeTypes.some(type => text.toLowerCase().includes(type.toLowerCase()));

                if (isShoeType && text.length < 50 && !productNames.has(text)) {
                    // Find nearby image
                    let imageUrl: string | null = null;
                    const $section = $el.closest('section, div, article');
                    const $img = $section.find('img').first();
                    if ($img.length) {
                        imageUrl = $img.attr('src') || $img.attr('data-src') || null;
                    }
                    if (imageUrl && imageUrl.startsWith('/')) {
                        imageUrl = `https://www.artofmen.de${imageUrl}`;
                    }

                    productNames.add(text);
                    products.push({
                        name: text,
                        category: 'Schuhe',
                        price: '',
                        sizes: '',
                        imageUrl,
                    });
                }
            });
        }

        // ============ ACCESSOIRES PAGE ============
        else if (isAccessoires) {
            console.log('Scraping Accessoires page...');

            // Accessory categories: Schleifen, Krawatten, Manschettenknöpfe, Hosenträger, Gürtel, Hemden, Kummerbund
            const accessoireTypes = [
                { keyword: 'Schleife', name: 'Fliege / Schleife' },
                { keyword: 'Fliege', name: 'Fliege / Schleife' },
                { keyword: 'Krawatte', name: 'Krawatte' },
                { keyword: 'Manschettenknopf', name: 'Manschettenknöpfe' },
                { keyword: 'Hosenträger', name: 'Hosenträger' },
                { keyword: 'Gürtel', name: 'Gürtel' },
                { keyword: 'Hemd', name: 'Hemd' },
                { keyword: 'Kummerbund', name: 'Kummerbund' },
                { keyword: 'Einstecktuch', name: 'Einstecktuch' },
            ];

            // Find sections with these keywords
            $('h2, h3, h4, strong, b').each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim();

                // Check for accessory type
                for (const acc of accessoireTypes) {
                    if (text.toLowerCase().includes(acc.keyword.toLowerCase()) && text.length < 100) {
                        if (productNames.has(acc.name)) continue;

                        // Find nearby image
                        let imageUrl: string | null = null;
                        const $section = $el.closest('section, div, article').first();
                        if ($section.length) {
                            const $img = $section.find('img').first();
                            if ($img.length) {
                                imageUrl = $img.attr('src') || $img.attr('data-src') || null;
                            }
                        }
                        if (!imageUrl) {
                            // Try next sibling
                            const $next = $el.parent().next();
                            const $img = $next.find('img').first();
                            if ($img.length) {
                                imageUrl = $img.attr('src') || $img.attr('data-src') || null;
                            }
                        }
                        if (imageUrl && imageUrl.startsWith('/')) {
                            imageUrl = `https://www.artofmen.de${imageUrl}`;
                        }

                        productNames.add(acc.name);
                        products.push({
                            name: acc.name,
                            category: 'Accessoires',
                            price: '',
                            sizes: '',
                            imageUrl,
                        });
                        break;
                    }
                }
            });

            // Also find images directly that have accessory-related alt text
            $('img').each((_, el) => {
                const $img = $(el);
                const alt = $img.attr('alt') || '';
                const src = $img.attr('src') || $img.attr('data-src') || '';

                if (!src) return;

                for (const acc of accessoireTypes) {
                    if (alt.toLowerCase().includes(acc.keyword.toLowerCase())) {
                        // Create unique name from alt text
                        const name = alt.length > 10 && alt.length < 100 ? alt : acc.name;
                        if (productNames.has(name)) continue;

                        let imageUrl = src;
                        if (imageUrl.startsWith('/')) {
                            imageUrl = `https://www.artofmen.de${imageUrl}`;
                        }

                        productNames.add(name);
                        products.push({
                            name,
                            category: 'Accessoires',
                            price: '',
                            sizes: '',
                            imageUrl,
                        });
                    }
                }
            });
        }

        // ============ LOOKBOOK / BRAEUTIGAM / ALLTAG ============
        else {
            console.log('Scraping Anzug page...');

            // Find products in h3 tags with "Anzug", "Smoking", etc.
            $('h3').each((_, el) => {
                const $el = $(el);
                const name = $el.text().trim();

                if (productNames.has(name)) return;
                if (name.length < 10 || name.length > 100) return;
                if (isExcluded(name)) return;

                // Must contain Anzug, Smoking, Weste, Jacket, etc.
                const hasProductKeyword = /Anzug|Smoking|Weste|Jacket|Dinnerjacket|Frack/i.test(name);
                if (!hasProductKeyword) return;

                const $parent = $el.parent();
                const parentText = $parent.text();

                const priceMatch = parentText.match(/ab\s*([\d.,]+)\s*€/);
                const price = priceMatch ? `ab ${priceMatch[1]} €` : '';

                const sizesMatch = parentText.match(/Größen?\s*([\d\s\-\+\|]+)/);
                const sizes = sizesMatch ? `Größen ${sizesMatch[1].trim()}` : '';

                let imageUrl: string | null = null;
                const $parentImg = $parent.find('img').first();
                if ($parentImg.length) {
                    imageUrl = $parentImg.attr('src') || $parentImg.attr('data-src') || null;
                }
                if (!imageUrl) {
                    const $gpImg = $parent.parent().find('img').first();
                    if ($gpImg.length) {
                        imageUrl = $gpImg.attr('src') || $gpImg.attr('data-src') || null;
                    }
                }
                if (imageUrl && imageUrl.startsWith('/')) {
                    imageUrl = `https://www.artofmen.de${imageUrl}`;
                }

                productNames.add(name);
                products.push({ name, category: pageCategory, price, sizes, imageUrl });
            });
        }

        console.log(`Found ${products.length} products`);

        return NextResponse.json({
            success: true,
            count: products.length,
            products,
            scrapedUrl: targetUrl,
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Scraper error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Scraper failed' },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function GET() {
    const hasApiKey = !!process.env.SCRAPINGDOG_API_KEY;
    const hasAiKey = !!process.env.OPENAI_API_KEY;

    return NextResponse.json({
        ready: hasApiKey,
        scrapingDog: hasApiKey,
        aiGeneration: hasAiKey,
    }, { headers: corsHeaders });
}

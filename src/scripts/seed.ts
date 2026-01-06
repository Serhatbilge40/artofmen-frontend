// Seed script to create demo products
// Run with: npx ts-node --skip-project src/scripts/seed.ts

import dbConnect from '../lib/mongodb';
import Product from '../lib/models/Product';

const demoProducts = [
    {
        name: 'Der Klassische Anzug',
        slug: 'der-klassische-anzug',
        description: 'Ein zeitloser Zweireiher aus feinstem italienischen Wolle-Kaschmir-Gemisch, handgefertigt von Meistern ihres Fachs.',
        story: `<p>Die Geschichte dieses Anzugs beginnt in den Hügeln der Toskana, wo seit Generationen die feinsten Stoffe der Welt gewebt werden.</p>
    
<p>Jeder Faden erzählt von Tradition und Handwerkskunst. Die Wolle stammt von sorgfältig ausgewählten Merinoschafen, deren Vlies nur einmal im Jahr – im frühen Frühling – geschoren wird, wenn die Fasern am feinsten sind.</p>

<p>In unserer Manufaktur in München wird jedes Stück von Hand zugeschnitten. Unsere Schneidermeister, viele davon mit über 30 Jahren Erfahrung, kennen jeden Stich, jede Naht, die einen gewöhnlichen Anzug von einem außergewöhnlichen unterscheidet.</p>

<p>Die Knöpfe sind aus echtem Horn gefertigt, die Einlagen aus reinem Rosshaar – Materialien, die sich bewährt haben und nichts von ihrer Eleganz verloren haben. Mehr als 50 Stunden Handarbeit fließen in jeden einzelnen Anzug.</p>

<p>Das Ergebnis ist mehr als ein Kleidungsstück. Es ist ein Statement. Eine Verbindung zu einer Tradition, die in unserer schnelllebigen Welt selten geworden ist.</p>`,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop',
            'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=1000&fit=crop',
        ],
        videos: [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
        ],
        category: 'Anzüge',
        tags: ['Klassisch', 'Wolle', 'Handgefertigt', 'Premium'],
        published: true,
        template: 'modern',
        colorScheme: 'dark',
    },
    {
        name: 'Das Seidene Einstecktuch',
        slug: 'das-seidene-einstecktuch',
        description: 'Handgerollt und in limitierter Auflage – dieses Einstecktuch aus Como-Seide verleiht jedem Outfit den letzten Schliff.',
        story: `<p>In Como, am Fuße der italienischen Alpen, liegt das Herz der europäischen Seidenproduktion. Hier, wo der See in tiefstem Blau schimmert, wurde auch dieses Einstecktuch geboren.</p>

<p>Die Seide, die wir verwenden, wird nach jahrhundertealten Techniken verarbeitet. Jedes Tuch wird von Hand gesäumt – ein Prozess, der "roulé main" genannt wird und selbst für erfahrene Handwerker mehrere Stunden in Anspruch nimmt.</p>

<p>Das Design entstand in Zusammenarbeit mit zeitgenössischen Künstlern, die von den Farben des Comer Sees inspiriert wurden. Die Pigmente werden einzeln aufgetragen, Schicht für Schicht, bis die charakteristische Tiefe entsteht.</p>

<p>Limitiert auf nur 100 Stück pro Saison, ist jedes Einstecktuch nummeriert und mit einem Zertifikat der Authentizität versehen.</p>`,
        images: [
            'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=1200&h=1600&fit=crop',
            'https://images.unsplash.com/photo-1598532213919-078e54dd1f40?w=800&h=1000&fit=crop',
        ],
        videos: [],
        category: 'Accessoires',
        tags: ['Seide', 'Como', 'Limitiert', 'Handgefertigt'],
        published: true,
        template: 'minimal',
        colorScheme: 'warm',
    },
];

async function seed() {
    try {
        await dbConnect();
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert demo products
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        for (const product of demoProducts) {
            const newProduct = new Product({
                ...product,
                qrCodeUrl: `${baseUrl}/product/${product.slug}`,
            });
            await newProduct.save();
            console.log(`Created: ${product.name}`);
        }

        console.log('\n✅ Seed completed successfully!');
        console.log(`Created ${demoProducts.length} demo products`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();

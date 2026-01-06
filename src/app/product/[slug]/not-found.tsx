import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
            <div className="text-center px-6">
                <h1
                    className="text-8xl md:text-9xl font-medium text-gray-800 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    404
                </h1>
                <h2
                    className="text-2xl md:text-3xl mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Produkt nicht gefunden
                </h2>
                <p className="text-gray-400 mb-12 max-w-md mx-auto">
                    Das gesuchte Produkt existiert nicht oder wurde entfernt.
                </p>
                <Link href="/" className="btn-secondary">
                    Zurück zur Startseite
                </Link>
            </div>
        </div>
    );
}

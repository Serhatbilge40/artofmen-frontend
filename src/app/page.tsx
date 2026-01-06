'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Full Screen with Video/Image */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern - Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Elegant lines decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B7355]/30 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm tracking-[0.4em] uppercase text-[#8B7355] mb-8"
          >
            Exklusive Anzüge & Accessoires
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-normal mb-8 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Art Of Men
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Entdecken Sie die Geschichte hinter unseren exklusiven Produkten.
            Jedes Stück erzählt eine einzigartige Geschichte von Handwerkskunst und Qualität.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/products"
              className="group relative px-10 py-4 bg-[#8B7355] text-white text-sm tracking-[0.15em] uppercase overflow-hidden transition-all duration-500 hover:bg-[#A0826D]"
            >
              <span className="relative z-10">Kollektion entdecken</span>
            </Link>
            <Link
              href="https://artofmen.de"
              target="_blank"
              className="px-10 py-4 border border-white/20 text-white text-sm tracking-[0.15em] uppercase hover:border-[#8B7355] hover:text-[#8B7355] transition-all duration-500"
            >
              Zur Website
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#8B7355] to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section - Split Layout */}
      <section className="py-32 md:py-48 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-4 block">
                Unsere Philosophie
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Die Kunst der
                <br />
                <span className="italic">Perfektion</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Bei Art Of Men glauben wir, dass jedes Produkt eine Geschichte erzählt.
                Unsere QR-Code-Technologie ermöglicht es Ihnen, die Reise jedes einzelnen
                Stücks zu entdecken – von der ersten Skizze bis zum fertigen Meisterwerk.
              </p>
              <div className="w-24 h-px bg-[#8B7355]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-sm overflow-hidden border border-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl text-[#8B7355]/20 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                      AM
                    </div>
                    <p className="text-gray-600 text-sm tracking-widest uppercase">Qualität seit 2020</p>
                  </div>
                </div>
              </div>
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#8B7355]/20 rounded-sm -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Luxury Steps */}
      <section className="py-32 md:py-48 bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-[#8B7355] mb-4 block">
              Der Prozess
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              So funktioniert es
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: '01',
                title: 'Scannen',
                description: 'QR-Code auf Ihrem Produkt mit dem Smartphone scannen.',
              },
              {
                step: '02',
                title: 'Entdecken',
                description: 'Die vollständige Geschichte und Details Ihres Produkts erfahren.',
              },
              {
                step: '03',
                title: 'Erleben',
                description: 'In die Welt der Handwerkskunst und Exklusivität eintauchen.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-8">
                  <span className="text-7xl font-light text-transparent bg-clip-text bg-gradient-to-b from-[#8B7355] to-[#8B7355]/30">
                    {item.step}
                  </span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-[#8B7355]/30 group-hover:w-24 transition-all duration-500" />
                </div>
                <h3
                  className="text-2xl mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-32 md:py-48 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bereit für Ihre Geschichte?
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
              Besuchen Sie uns in einem unserer Stores in Düsseldorf, Dortmund oder Konstanz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-10 py-4 bg-[#8B7355] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#A0826D] transition-all duration-500"
              >
                Produkte ansehen
              </Link>
              <a
                href="mailto:info@artofmen.de"
                className="px-10 py-4 border border-white/20 text-white text-sm tracking-[0.15em] uppercase hover:border-[#8B7355] hover:text-[#8B7355] transition-all duration-500"
              >
                Kontakt
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

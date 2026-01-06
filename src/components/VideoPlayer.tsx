'use client';

import { motion } from 'framer-motion';

interface VideoPlayerProps {
    videos: string[];
    productName: string;
}

export default function VideoPlayer({ videos, productName }: VideoPlayerProps) {
    if (!videos || videos.length === 0) return null;

    const getVideoEmbedUrl = (url: string): string | null => {
        // YouTube
        const youtubeMatch = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        // If it's already an embed URL or direct video URL, return as is
        return url;
    };

    return (
        <section className="py-24 md:py-40 bg-[var(--background)]">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl mb-16 text-center"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Video
                </motion.h2>

                <div className="space-y-12">
                    {videos.map((video, index) => {
                        const embedUrl = getVideoEmbedUrl(video);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-elegant"
                            >
                                {embedUrl?.includes('youtube') || embedUrl?.includes('vimeo') ? (
                                    <iframe
                                        src={embedUrl}
                                        title={`${productName} - Video ${index + 1}`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : embedUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video
                                        src={embedUrl}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        controls
                                        playsInline
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                        Video nicht verfügbar
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    slug: string;
    name: string;
    description: string;
    story: string;
    images: string[];
    videos: string[];
    category: string;
    tags: string[];
    qrCodeUrl?: string;
    published: boolean;
    template: 'classic' | 'modern' | 'minimal';
    colorScheme: 'dark' | 'light' | 'warm';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        story: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        videos: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            default: 'uncategorized',
        },
        tags: {
            type: [String],
            default: [],
        },
        qrCodeUrl: {
            type: String,
        },
        published: {
            type: Boolean,
            default: false,
        },
        template: {
            type: String,
            enum: ['classic', 'modern', 'minimal'],
            default: 'modern',
        },
        colorScheme: {
            type: String,
            enum: ['dark', 'light', 'warm'],
            default: 'dark',
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Create slug from name if not provided
ProductSchema.pre('save', function () {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

// Index for faster queries (slug index already created by unique: true)
ProductSchema.index({ published: 1 });
ProductSchema.index({ category: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

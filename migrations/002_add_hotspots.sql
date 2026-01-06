-- Migration: Add hotspots column to products table
-- Run this in Supabase SQL Editor

-- Add hotspots column (JSONB array for interactive image hotspots)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hotspots JSONB DEFAULT '[]';

-- Add a comment explaining the structure
COMMENT ON COLUMN products.hotspots IS 'Array of interactive images with hotspots. Structure: [{imageUrl: string, imageIndex: number, hotspots: [{id: string, x: number, y: number, title: string, description: string, details: {material?, origin?, care?, features?}}]}]';

-- Example of how to update a product with hotspots:
/*
UPDATE products 
SET hotspots = '[
  {
    "imageUrl": "https://example.com/image.jpg",
    "imageIndex": 0,
    "hotspots": [
      {
        "id": "1",
        "x": 30,
        "y": 25,
        "title": "Revers",
        "description": "Handgenähtes Revers mit perfekter Rollkante",
        "details": {
          "material": "Super 150 Schurwolle",
          "origin": "Biella, Italien",
          "care": "Professionelle Reinigung empfohlen",
          "features": ["Handgenäht", "AMF-Steppung", "Echtes Knopfloch"]
        }
      },
      {
        "id": "2",
        "x": 50,
        "y": 60,
        "title": "Knöpfe",
        "description": "Echte Hornknöpfe aus Italien",
        "details": {
          "material": "Echtes Horn",
          "origin": "Italien"
        }
      }
    ]
  }
]'
WHERE slug = 'der-klassische-anzug';
*/

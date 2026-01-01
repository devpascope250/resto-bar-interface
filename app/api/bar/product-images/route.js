import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { formidable } from 'formidable';

// Configure formidable for file uploads
const form = formidable({
  uploadDir: './public/uploads/products',
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  filter: function ({ mimetype }) {
    return mimetype?.includes('image') || false;
  },
  filename: (name, ext, part, form) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `product_${timestamp}_${random}${ext}`;
  }
});

// Ensure upload directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'public/uploads/products');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

// GET - Fetch all images from library
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    const uploadsDir = path.join(process.cwd(), 'public/uploads/products');
    
    try {
      await fs.access(uploadsDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json([]);
    }

    const files = await fs.readdir(uploadsDir);
    
    const images = await Promise.all(
      files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
        })
        .map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await fs.stat(filePath);
          
          // Extract category from filename or use default
          // You can implement your own categorization logic here
          const fileCategory = extractCategory(filename);
          
          return {
            id: filename, // Using filename as ID for simplicity
            url: `/uploads/products/${filename}`,
            filename: filename,
            category: fileCategory,
            uploadedAt: stats.birthtime.toISOString(),
            fileSize: stats.size,
          };
        })
    );

    // Filter by category and search
    let filteredImages = images;
    
    if (category !== 'all') {
      filteredImages = filteredImages.filter(img => img.category === category);
    }
    
    if (search) {
      filteredImages = filteredImages.filter(img => 
        img.filename.toLowerCase().includes(search.toLowerCase()) ||
        img.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by upload date (newest first)
    filteredImages.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return NextResponse.json(filteredImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST - Upload new image to library
export async function POST(request) {
  await ensureUploadDir();

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const category = formData.get('category') || 'uncategorized';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name) || '.jpg';
    const filename = `product_${timestamp}_${random}${extension}`;
    
    const uploadsDir = path.join(process.cwd(), 'public/uploads/products');
    const filePath = path.join(uploadsDir, filename);

    // Convert Blob to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Get file stats for response
    const stats = await fs.stat(filePath);

    const imageData = {
      id: filename,
      url: `/uploads/products/${filename}`,
      filename: filename,
      category: category,
      uploadedAt: stats.birthtime.toISOString(),
      fileSize: stats.size,
    };

    return NextResponse.json(imageData, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Helper function to extract category from filename
function extractCategory(filename) {
  // You can implement your own logic here
  // For example, based on filename patterns or metadata
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('drink') || lowerFilename.includes('beverage')) {
    return 'beverages';
  } else if (lowerFilename.includes('food') || lowerFilename.includes('meal')) {
    return 'food';
  } else if (lowerFilename.includes('snack')) {
    return 'snacks';
  } else if (lowerFilename.includes('alcohol') || lowerFilename.includes('beer') || lowerFilename.includes('wine')) {
    return 'alcoholic';
  } else {
    return 'uncategorized';
  }
}
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Upload, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/api-hooks";

interface ProductImage {
  id: number;
  url: string;
  filename: string;
  category: string;
  uploadedAt: string;
  fileSize: number;
}

interface ImageLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageLibraryDialog({
  open,
  onOpenChange,
  onImageSelect,
  currentImage
}: ImageLibraryDialogProps) {
  const { useApiQuery, useApiPost } = useApi();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Fetch images from library
  const { data: images = [], isLoading, refetch } = useApiQuery<ProductImage[]>(
    ["product-images"],
    "/bar/product-images",
    {
      enabled: open // Only fetch when dialog is open
    }
  );

  const { mutateAsync: uploadImage } = useApiPost(
    ["upload-product-image"],
    "/bar/product-images"
  );

  // Extract unique categories
  const categories = ["all", ...new Set(images.map(img => img.category).filter(Boolean))];

  // Filter images based on search and category
  const filteredImages = images.filter(image => {
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = async () => {
    if (!uploadFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "error",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(uploadFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image",
        variant: "error",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (uploadFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "error",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", uploadFile);
    formData.append("category", selectedCategory === "all" ? "uncategorized" : selectedCategory);

    try {
      await uploadImage(formData);
      toast({
        title: "Image uploaded",
        description: "Image has been added to your library",
        variant: "success",
      });
      setUploadFile(null);
      refetch(); // Refresh the image list
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onImageSelect(selectedImage);
      onOpenChange(false);
      setSelectedImage(null);
      setSearchTerm("");
      setSelectedCategory("all");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Library</DialogTitle>
          <DialogDescription>
            Choose an image from your library or upload a new one
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button 
                onClick={handleUpload} 
                disabled={!uploadFile || uploading}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          {/* Image Grid */}
          <ScrollArea className="flex-1 border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading images...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <p>No images found</p>
                {searchTerm || selectedCategory !== "all" ? (
                  <p className="text-sm">Try changing your search or filters</p>
                ) : (
                  <p className="text-sm">Upload your first image to get started</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === image.url 
                        ? 'border-primary ring-2 ring-primary' 
                        : 'border-transparent hover:border-primary'
                    }`}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-24 object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                      {image.filename}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Selected Image</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Image Preview</p>
                  <p className="text-xs text-muted-foreground">
                    This image will be used for the product
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedImage(null);
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Use Selected Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
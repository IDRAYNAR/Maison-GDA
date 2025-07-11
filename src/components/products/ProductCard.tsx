"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  brand: { name: string };
  price: number;
  originalPrice?: number | null;
  images: string[];
  slug: string;
  concentration?: string | null;
  volume?: number | null;
  gender: 'HOMME' | 'FEMME' | 'UNISEX';
  featured?: boolean;
  inStock?: boolean;
  isFavorite?: boolean;
  onToggleFavorite: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  images,
  slug,
  concentration,
  volume,
  gender,
  featured = false,
  inStock = true,
  isFavorite = false,
  onToggleFavorite,
  viewMode = 'grid'
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (onToggleFavorite) {
      setIsLoading(true);
      try {
        await onToggleFavorite(id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'HOMME':
        return 'bg-blue-100 text-blue-800';
      case 'FEMME':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const image = images && images.length > 0 ? images[0] : '/api/placeholder/400/400';

  if (viewMode === 'list') {
    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-row">
        <div className="relative aspect-square overflow-hidden w-40 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="200px"
          />
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{brand.name}</p>
                <Link href={`/parfums/${slug}`}>
                  <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
                    {name}
                  </h3>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleToggleFavorite}
                disabled={isLoading}
              >
                <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Badge variant="outline" className={`text-xs ${getGenderColor(gender)}`}>
                {gender === 'UNISEX' ? 'Mixte' : gender.charAt(0) + gender.slice(1).toLowerCase()}
              </Badge>
              {concentration && <span>{concentration}</span>}
              {volume && <span>{volume}ml</span>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary">{price}€</span>
              {hasDiscount && <span className="text-sm text-muted-foreground line-through">{originalPrice}€</span>}
            </div>
            {/* On pourrait ajouter un bouton "Voir détails" ici */}
          </div>
        </div>
      </Card>
    );
  }

  // Vue grille (code existant, légèrement adapté)
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0 relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {featured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Coup de cœur
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </Badge>
            )}
            {!inStock && (
              <Badge variant="outline" className="text-xs bg-white/90">
                Rupture
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleToggleFavorite}
            disabled={isLoading}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Brand */}
          <p className="text-sm font-medium text-muted-foreground">{brand.name}</p>
          
          {/* Name */}
          <Link href={`/parfums/${slug}`}>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          {/* Details */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className={`text-xs ${getGenderColor(gender)}`}>
              {gender === 'UNISEX' ? 'Mixte' : gender.charAt(0) + gender.slice(1).toLowerCase()}
            </Badge>
            {concentration && (
              <span>{concentration}</span>
            )}
            {volume && (
              <span>{volume}ml</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{price}€</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}€
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
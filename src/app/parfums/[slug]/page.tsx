"use client";

import { use, useState } from "react";
import Image from "next/image";
import { Heart, Share2, Star, Info, Palette, Users, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useFavorites } from "@/hooks/useFavorites";
import { useSession } from "next-auth/react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const { product, isLoading, error } = useProduct(resolvedParams.slug);
  const { favorites, toggleFavorite, isToggling } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleToggleFavorite = async () => {
    if (!product || !session) return;
    await toggleFavorite(product.id);
  };

  const handleShare = async () => {
    if (!product) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - ${product.brand.name}`,
          text: product.description || `Découvrez ${product.name} de ${product.brand.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
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

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'HOMME':
        return 'Homme';
      case 'FEMME':
        return 'Femme';
      case 'UNISEX':
        return 'Mixte';
      default:
        return gender;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Produit non trouvé</h1>
          <p className="text-muted-foreground mb-4">
            Le produit que vous recherchez n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Button asChild>
            <Link href="/parfums">Retour à la collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const isFavorite = favorites.some((fav: { productId: string }) => fav.productId === product.id);

  // Créer un tableau d'images (utiliser les images du produit ou une image par défaut)
  const images = product.images?.length ? product.images : ['/api/placeholder/600/600'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link href="/parfums" className="hover:text-primary">Parfums</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      {/* Bouton retour */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/parfums">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la collection
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Coup de cœur
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive">
                  -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% 
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="outline" className="bg-white/90">
                  Rupture de stock
                </Badge>
              )}
            </div>
          </div>

          {/* Miniatures (si plusieurs images) */}
          {images.length > 1 && (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-6">
          <div>
            <p className="text-lg font-medium text-muted-foreground">{product.brand.name}</p>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            {product.description && (
              <p className="text-muted-foreground mt-2">{product.description}</p>
            )}
          </div>

          {/* Prix */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{product.price}€</span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {product.originalPrice}€
              </span>
            )}
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Concentration</span>
                <span className="font-medium">{product.concentration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-medium">{product.volume}ml</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Genre</span>
                <Badge variant="outline" className={getGenderColor(product.gender)}>
                  {getGenderLabel(product.gender)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Favoris</span>
                <span className="font-medium">{product._count.favorites}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">En stock</span>
                <span className="font-medium">{product.inStock ? 'Oui' : 'Non'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coup de cœur</span>
                <span className="font-medium">{product.featured ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {session && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={isToggling}
              >
                {isToggling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`}
                  />
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button size="lg" className="flex-1" disabled={!product.inStock}>
              {product.inStock ? 'Prendre rendez-vous' : 'Rupture de stock'}
            </Button>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Informations produit
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Catégorie :</span>
                <span className="ml-2">{product.category.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Marque :</span>
                <span className="ml-2">{product.brand.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Détails supplémentaires */}
      <div className="mt-16 space-y-8">
        <Separator />

        {/* Description détaillée */}
        {product.description && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Description détaillée</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Notes olfactives */}
        {(product.topNotes?.length || product.heartNotes?.length || product.baseNotes?.length) && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Notes olfactives
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {product.topNotes?.length && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Notes de tête</CardTitle>
                    <p className="text-sm text-muted-foreground">Premières impressions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.topNotes.map((note, index) => (
                        <Badge key={index} variant="secondary">{note}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {product.heartNotes?.length && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Notes de cœur</CardTitle>
                    <p className="text-sm text-muted-foreground">Cœur du parfum</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.heartNotes.map((note, index) => (
                        <Badge key={index} variant="secondary">{note}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {product.baseNotes?.length && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Notes de fond</CardTitle>
                    <p className="text-sm text-muted-foreground">Signature finale</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.baseNotes.map((note, index) => (
                        <Badge key={index} variant="secondary">{note}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Informations supplémentaires */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Informations supplémentaires
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Volume :</span>
                  <span className="ml-2">{product.volume || 'Non spécifié'}ml</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Concentration :</span>
                  <span className="ml-2">{product.concentration || 'Non spécifiée'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prix :</span>
                  <span className="ml-2">{product.price}€</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut :</span>
                  <span className="ml-2">{product.inStock ? 'En stock' : 'Rupture de stock'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 p-8 rounded-lg text-center">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Intéressé par ce parfum ?</h3>
          <p className="text-muted-foreground mb-6">
            Contactez-nous pour organiser une séance de découverte à domicile et tester ce parfum dans votre environnement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" disabled={!product.inStock}>
              {product.inStock ? 'Prendre rendez-vous' : 'Rupture de stock'}
            </Button>
            <Button variant="outline" size="lg">
              Poser une question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
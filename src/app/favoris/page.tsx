"use client";

import { useState } from "react";
import { Heart, X, Share2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";

// Mock data - à remplacer par des vraies données de l'API
const mockFavorites = [
  {
    id: "1",
    name: "Santal 33",
    brand: "Le Labo",
    price: 182,
    originalPrice: 210,
    image: "/api/placeholder/300/300",
    slug: "santal-33",
    concentration: "EDP",
    volume: 50,
    gender: "UNISEX" as const,
    featured: true,
    inStock: true,
    isFavorite: true
  },
  {
    id: "2", 
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    price: 95,
    image: "/api/placeholder/300/300",
    slug: "black-opium",
    concentration: "EDP",
    volume: 50,
    gender: "FEMME" as const,
    featured: false,
    inStock: true,
    isFavorite: true
  },
  {
    id: "3",
    name: "Terre d'Hermès",
    brand: "Hermès",
    price: 125,
    image: "/api/placeholder/300/300",
    slug: "terre-d-hermes",
    concentration: "EDT",
    volume: 100,
    gender: "HOMME" as const,
    featured: false,
    inStock: false,
    isFavorite: true
  }
];

export default function FavorisPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggleFavorite = async (id: string) => {
    // Simulation d'une API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFavorites(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleToggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    setFavorites(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleShareFavorites = () => {
    // Logique pour partager les favoris
    console.log('Share favorites:', selectedItems);
  };

  const totalValue = favorites.reduce((sum, item) => sum + item.price, 0);
  const availableItems = favorites.filter(item => item.inStock).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              Mes Favoris
            </h1>
            <p className="text-muted-foreground mt-2">
              Retrouvez tous vos parfums préférés en un seul endroit
            </p>
          </div>
          
          {favorites.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems.length === favorites.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </Button>
              
              {selectedItems.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareFavorites}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveSelected}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Supprimer ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total des favoris</p>
                    <p className="text-2xl font-bold">{favorites.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valeur totale</p>
                    <p className="text-2xl font-bold">{totalValue}€</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                    <p className="text-2xl font-bold">{availableItems}</p>
                  </div>
                  <Badge variant={availableItems === favorites.length ? "default" : "secondary"}>
                    {availableItems === favorites.length ? "Tous" : "Partiels"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Aucun favori pour le moment</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Explorez notre collection et ajoutez vos parfums préférés en cliquant sur le cœur
          </p>
          <Button asChild>
            <a href="/parfums">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Découvrir nos parfums
            </a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="relative">
              <div 
                className={`absolute top-2 left-2 z-10 ${
                  selectedItems.includes(product.id) ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                } transition-opacity duration-200`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product.id)}
                  onChange={() => handleToggleSelection(product.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              
              <ProductCard
                {...product}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Prêt à passer commande ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Contactez-nous pour organiser une consultation personnalisée et découvrir ces parfums chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Prendre rendez-vous
                </Button>
                <Button variant="outline" size="lg">
                  Nous contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 
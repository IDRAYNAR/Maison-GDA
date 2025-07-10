"use client";

import { useState } from "react";
import { Filter, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useBrands, useCategories } from "@/hooks/useBrandsAndCategories";
import { useFavorites } from "@/hooks/useFavorites";
import { Brand, Category, Product } from "@/generated/prisma";

type ViewMode = 'grid' | 'list';
type SortOption = 'createdAt' | 'name' | 'price';
type SortOrder = 'asc' | 'desc';

export default function ParfumsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedConcentration, setSelectedConcentration] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { products, pagination, isLoading, mutate } = useProducts({
    page,
    search: search || undefined,
    gender: selectedGender || undefined,
    brandId: selectedBrand || undefined,
    categoryId: selectedCategory || undefined,
    concentration: selectedConcentration || undefined,
    sortBy,
    sortOrder,
  });

  const { brands, isLoading: brandsLoading } = useBrands();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { toggleFavorite } = useFavorites();

  const handleToggleFavorite = async (productId: string) => {
    try {
      await toggleFavorite(productId);
      await mutate(); // Revalider les produits pour mettre à jour les favoris
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedGender('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedConcentration('');
    setPage(1);
  };

  const concentrations = ['EDT', 'EDP', 'Parfum', 'Cologne'];
  const genders = [
    { value: 'FEMME', label: 'Femme' },
    { value: 'HOMME', label: 'Homme' },
    { value: 'UNISEX', label: 'Mixte' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Notre Collection de Parfums</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection exclusive de parfums de niche et de créateurs.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="Rechercher un parfum, une marque..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {(selectedGender || selectedBrand || selectedCategory || selectedConcentration) && (
                <Badge variant="secondary" className="ml-2">
                  Actifs
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortOption, SortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="createdAt-desc">Plus récents</option>
              <option value="createdAt-asc">Plus anciens</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Tous</option>
                    {genders.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Marque</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    disabled={brandsLoading}
                  >
                    <option value="">Toutes</option>
                    {brands.map((brand: Brand & { _count?: { products: number } }) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name} ({brand._count?.products || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    disabled={categoriesLoading}
                  >
                    <option value="">Toutes</option>
                    {categories.map((category: Category & { _count?: { products: number } }) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category._count?.products || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Concentration</label>
                  <select
                    value={selectedConcentration}
                    onChange={(e) => setSelectedConcentration(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Toutes</option>
                    {concentrations.map((concentration) => (
                      <option key={concentration} value={concentration}>
                        {concentration}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des parfums...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Aucun parfum trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {pagination?.total || 0} parfum{(pagination?.total || 0) > 1 ? 's' : ''} trouvé{(pagination?.total || 0) > 1 ? 's' : ''}
            </p>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product: Product & { brand: Brand }) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand.name}
                price={product.price}
                originalPrice={product.originalPrice || undefined}
                image={product.images[0] || '/api/placeholder/300/300'}
                slug={product.slug}
                concentration={product.concentration || undefined}
                volume={product.volume || undefined}
                gender={product.gender}
                featured={product.featured}
                inStock={product.inStock}
                isFavorite={false} // TODO: Implement favorite check
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
              >
                Précédent
              </Button>
              
              <span className="text-sm text-muted-foreground px-4">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
"use client";

import { useState } from "react";
import { Filter, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useBrands, useCategories } from "@/hooks/useBrandsAndCategories";
import { useFavorites } from "@/hooks/useFavorites";
import { Product as PrismaProduct, Brand, Category } from "@/generated/prisma";
import FilterSidebar from "@/components/products/FilterSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Étendre le type Product pour inclure les relations
type ProductWithRelations = PrismaProduct & {
  brand: Brand;
  category: Category;
};

type ViewMode = 'grid' | 'list';
type SortOption = 'createdAt' | 'name' | 'price';
type SortOrder = 'asc' | 'desc';

export default function ParfumsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);

  const { products, pagination, isLoading } = useProducts({
    page,
    search: search || undefined,
    gender: selectedGenders,
    brandId: selectedBrands,
    categoryId: selectedCategories,
    concentration: selectedConcentrations,
    sortBy,
    sortOrder,
  });

  const { brands } = useBrands();
  const { categories } = useCategories();
  const { toggleFavorite } = useFavorites();
  const { favorites } = useFavorites();

  const resetFilters = () => {
    setSearch('');
    setSelectedGenders([]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedConcentrations([]);
    setPage(1);
  };

  const hasActiveFilters = 
    selectedGenders.length > 0 || 
    selectedBrands.length > 0 || 
    selectedCategories.length > 0 || 
    selectedConcentrations.length > 0;

  const concentrations = ['EDT', 'EDP', 'Parfum', 'Cologne'];
  const genders = [
    { value: 'FEMME', label: 'Femme' },
    { value: 'HOMME', label: 'Homme' },
    { value: 'UNISEX', label: 'Mixte' }
  ];

  const handleFilterChange = (filterType: 'genders' | 'brands' | 'categories' | 'concentrations', value: string) => {
    const setters = {
      genders: setSelectedGenders,
      brands: setSelectedBrands,
      categories: setSelectedCategories,
      concentrations: setSelectedConcentrations,
    };
    const states = {
      genders: selectedGenders,
      brands: selectedBrands,
      categories: selectedCategories,
      concentrations: selectedConcentrations,
    };

    const setter = setters[filterType];
    const currentValues = states[filterType];
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    setter(newValues);
    setPage(1);
  }

  const sidebarProps = {
    brands,
    categories,
    concentrations,
    genders,
    selectedGenders,
    selectedBrands,
    selectedCategories,
    selectedConcentrations,
    handleFilterChange,
    resetFilters,
    hasActiveFilters,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Notre Collection de Parfums</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection exclusive de parfums de niche et de créateurs.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1">
          <FilterSidebar {...sidebarProps} />
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher un parfum, une marque..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtres
                      {hasActiveFilters && <Badge variant="secondary" className="ml-2">Actifs</Badge>}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <FilterSidebar {...sidebarProps} />
                  </SheetContent>
                </Sheet>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortOption, SortOrder];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="createdAt-desc">Plus récents</option>
                  <option value="createdAt-asc">Plus anciens</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>

                <div className="flex border rounded-md">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {isLoading && !products.length ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {pagination?.total} produits trouvés
              </p>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product: ProductWithRelations) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    isFavorite={favorites.some(fav => fav.productId === product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                {/* Pagination Controls */}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">Aucun produit trouvé</h2>
              <p className="text-muted-foreground mt-2">
                Essayez d&apos;ajuster vos filtres ou votre recherche.
              </p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 
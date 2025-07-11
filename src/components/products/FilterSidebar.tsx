"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Brand, Category } from "@/generated/prisma";
import { X, ChevronsUpDown, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import React, { useState, useMemo } from "react";

interface FilterSidebarProps {
  brands: Brand[];
  categories: Category[];
  concentrations: string[];
  genders: { value: string; label: string }[];
  selectedGenders: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedConcentrations: string[];
  handleFilterChange: (filterType: 'genders' | 'brands' | 'categories' | 'concentrations', value: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterSectionProps<T> {
  title: string;
  items: T[];
  selectedItems: string[];
  onFilterChange: (filterType: 'genders' | 'brands' | 'categories' | 'concentrations', value: string) => void;
  filterType: 'genders' | 'brands' | 'categories' | 'concentrations';
  renderLabel: (item: T) => string;
  renderId: (item: T) => string;
  showSearch?: boolean;
}

const FilterSection = <T,>({
  title, items, selectedItems, onFilterChange, filterType, renderLabel, renderId, showSearch = false
}: FilterSectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => renderLabel(item).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm, renderLabel]);

  const itemsToShow = showAll ? filteredItems : filteredItems.slice(0, 7);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b py-2">
      <CollapsibleTrigger className="flex justify-between items-center w-full py-2">
        <h4 className="font-semibold">{title}</h4>
        <ChevronsUpDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {showSearch && (
          <div className="relative my-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Chercher ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
        <div className="space-y-2 mt-2">
          {itemsToShow.map((item, index) => {
            const id = renderId(item);
            const label = renderLabel(item);
            return (
              <div key={id || index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterType}-${id}`}
                  checked={selectedItems.includes(id)}
                  onCheckedChange={() => onFilterChange(filterType, id)}
                />
                <Label htmlFor={`${filterType}-${id}`} className="font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
        {filteredItems.length > 7 && (
          <Button variant="link" onClick={() => setShowAll(!showAll)} className="p-0 h-auto mt-2">
            {showAll ? 'Voir moins' : `Voir plus (${filteredItems.length - 7})`}
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function FilterSidebar({
  brands, categories, concentrations, genders,
  selectedGenders, selectedBrands, selectedCategories, selectedConcentrations,
  handleFilterChange, resetFilters, hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>Filtres</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <FilterSection
            title="Genre"
            items={genders}
            selectedItems={selectedGenders}
            onFilterChange={handleFilterChange}
            filterType="genders"
            renderLabel={(item) => item.label}
            renderId={(item) => item.value}
          />
          <FilterSection
            title="Marque"
            items={brands}
            selectedItems={selectedBrands}
            onFilterChange={handleFilterChange}
            filterType="brands"
            renderLabel={(item) => item.name}
            renderId={(item) => item.id}
            showSearch
          />
          <FilterSection
            title="Catégorie"
            items={categories}
            selectedItems={selectedCategories}
            onFilterChange={handleFilterChange}
            filterType="categories"
            renderLabel={(item) => item.name}
            renderId={(item) => item.id}
            showSearch
          />
          <FilterSection
            title="Concentration"
            items={concentrations}
            selectedItems={selectedConcentrations}
            onFilterChange={handleFilterChange}
            filterType="concentrations"
            renderLabel={(item) => item}
            renderId={(item) => item}
          />
        </div>
      </CardContent>
    </Card>
  );
} 
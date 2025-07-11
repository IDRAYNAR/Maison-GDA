"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Brand, Category } from "@/generated/prisma";
import { Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import React, { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MobileFiltersProps {
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

interface FilterPopoverProps<T> {
  title: string;
  items: T[];
  selectedItems: string[];
  onFilterChange: (filterType: 'genders' | 'brands' | 'categories' | 'concentrations', value: string) => void;
  filterType: 'genders' | 'brands' | 'categories' | 'concentrations';
  renderLabel: (item: T) => string;
  renderId: (item: T) => string;
  showSearch?: boolean;
}

const FilterPopover = <T,>({
  title, items, selectedItems, onFilterChange, filterType, renderLabel, renderId, showSearch = false
}: FilterPopoverProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => renderLabel(item).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, searchTerm, renderLabel]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative flex-shrink-0">
          {title}
          {selectedItems.length > 0 && (
            <Badge variant="secondary" className="ml-2">{selectedItems.length}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4">
          <h4 className="font-medium leading-none mb-4">{title}</h4>
          {showSearch && (
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Chercher...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          <ScrollArea className="h-72">
            <div className="space-y-2">
              {filteredItems.map((item, index) => {
                const id = renderId(item);
                const label = renderLabel(item);
                return (
                  <div key={id || index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-${filterType}-${id}`}
                      checked={selectedItems.includes(id)}
                      onCheckedChange={() => onFilterChange(filterType, id)}
                    />
                    <Label htmlFor={`mobile-${filterType}-${id}`} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function MobileFilters({
  brands, categories, concentrations, genders,
  selectedGenders, selectedBrands, selectedCategories, selectedConcentrations,
  handleFilterChange, resetFilters, hasActiveFilters
}: MobileFiltersProps) {
  return (
    <div className="p-2 border-b">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <FilterPopover
          title="Genre"
          items={genders}
          selectedItems={selectedGenders}
          onFilterChange={handleFilterChange}
          filterType="genders"
          renderLabel={(item) => item.label}
          renderId={(item) => item.value}
        />
        <FilterPopover
          title="Marque"
          items={brands}
          selectedItems={selectedBrands}
          onFilterChange={handleFilterChange}
          filterType="brands"
          renderLabel={(item) => item.name}
          renderId={(item) => item.id}
          showSearch
        />
        <FilterPopover
          title="Catégorie"
          items={categories}
          selectedItems={selectedCategories}
          onFilterChange={handleFilterChange}
          filterType="categories"
          renderLabel={(item) => item.name}
          renderId={(item) => item.id}
          showSearch
        />
        <FilterPopover
          title="Concentration"
          items={concentrations}
          selectedItems={selectedConcentrations}
          onFilterChange={handleFilterChange}
          filterType="concentrations"
          renderLabel={(item) => item}
          renderId={(item) => item}
        />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="flex-shrink-0">
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  )
} 
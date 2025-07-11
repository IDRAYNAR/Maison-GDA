"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brand, Category } from "@/generated/prisma";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import React from "react";

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
}

const FilterSection = <T,>({ 
  title, items, selectedItems, onFilterChange, filterType, renderLabel, renderId 
}: FilterSectionProps<T>) => (
  <AccordionItem value={filterType}>
    <AccordionTrigger>{title}</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-2">
        {items.map((item, index) => {
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
    </AccordionContent>
  </AccordionItem>
);

export default function FilterSidebar({
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
}: FilterSidebarProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtres</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <Accordion type="multiple" defaultValue={['genders', 'brands', 'categories', 'concentrations']} className="w-full">
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
          />
          <FilterSection
            title="Catégorie"
            items={categories}
            selectedItems={selectedCategories}
            onFilterChange={handleFilterChange}
            filterType="categories"
            renderLabel={(item) => item.name}
            renderId={(item) => item.id}
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
        </Accordion>
      </CardContent>
    </Card>
  );
} 
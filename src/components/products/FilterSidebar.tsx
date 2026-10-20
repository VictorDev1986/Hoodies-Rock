"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "./CategoryFilter"
import { GenreFilter } from "./GenreFilter"
import { Category, FilterState } from "@/types"

interface FilterSidebarProps {
  filters: FilterState
  categories: Category[]
  onFiltersChange: (filters: FilterState) => void
}

export function FilterSidebar({ categories, filters, onFiltersChange }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.genres.length > 0

  const handleClearFilters = () => {
    onFiltersChange({
      brands: [],
      categories: [],
      genres: [],
      sortBy: filters.sortBy,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-auto p-0 text-sm text-primary hover:text-primary/80"
          >
            Limpiar
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategories={filters.categories}
        onCategoriesChange={(categories) =>
          onFiltersChange({ ...filters, categories })
        }
      />

      <GenreFilter
        selectedGenres={filters.genres}
        onGenresChange={(genres) =>
          onFiltersChange({ ...filters, genres })
        }
      />
    </div>
  )
}

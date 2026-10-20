"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const genres = ["Rock clásico", "Metal", "Punk", "Ska", "Oi!", "Grunge", "Indie", "Hard rock", "Alternativo", "Vintage", "Otro"]

interface GenreFilterProps {
  selectedGenres: string[]
  onGenresChange: (genres: string[]) => void
}

export function GenreFilter({ selectedGenres, onGenresChange }: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleGenre = (genre: string) => {
    onGenresChange(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((selected) => selected !== genre)
        : [...selectedGenres, genre]
    )
  }

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 font-medium"
      >
        Género musical
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              />
              <Label htmlFor={`genre-${genre}`} className="cursor-pointer text-sm">
                {genre === "Otro" ? "Otro género" : genre}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

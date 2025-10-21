import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/SearchBar";
import { TypeFilter } from "@/components/TypeFilter";
import { GenerationFilter } from "@/components/GenerationFilter";
import { SortSelect } from "@/components/SortSelect";
import { useExplorerStore } from "@/store/useExplorerStore";

export function Header() {
  const { isDarkMode, toggleDarkMode } = useExplorerStore();

  return (
    <header className="border-border sticky top-0 z-50 w-full border-b bg-sky-500/95 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-sky-500/80 dark:bg-sky-700/90 dark:supports-[backdrop-filter]:bg-sky-700/75">
      {/* Wrapper relative supaya absolute di dalamnya bisa bebas posisi */}
      <div className="relative flex h-16 items-center justify-center">
        {/* Mobile Menu (pojok kiri dalam container) */}
        <div className="absolute left-4 flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Search & Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <SearchBar />
                <div className="border-border border-t pt-6">
                  <TypeFilter />
                </div>
                <div className="border-border border-t pt-6">
                  <GenerationFilter />
                </div>
                <div className="border-border border-t pt-6">
                  <SortSelect />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tengah - Judul */}
        <div className="text-center select-none">
          <h1 className="bg-gradient-to-r from-sky-100 via-white to-sky-200 bg-clip-text text-xl font-bold text-transparent drop-shadow-sm sm:text-2xl">
            Dfaalt Pokedex
          </h1>
          <p className="text-[0.8rem] text-sky-50/90 sm:text-sm dark:text-sky-100/80">
            Jelajahi Pokémon Favoritmu. Let's Explore!
          </p>
        </div>

        {/* Tombol kanan (pojok kanan layar, bukan container) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="absolute right-4 cursor-pointer rounded-full"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}

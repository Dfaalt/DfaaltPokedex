import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Search, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Route Not Found", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 to-white dark:from-[#0b1220] dark:to-[#0b1220]">
      {/* dekorasi blur lembut */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-600/20" />

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
        {/* kartu soft glass */}
        <div className="relative w-full max-w-2xl rounded-2xl border-[1.5px] [border-color:color-mix(in_oklch,_#38bdf8_55%,_transparent)] bg-white/60 p-8 shadow-[0_12px_28px_rgba(56,189,248,0.12),_0_6px_12px_rgba(0,0,0,0.08)] backdrop-blur-md dark:bg-white/5">
          {/* badge 404 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-50/60 px-3 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
            <Compass className="h-4 w-4" />
            Error 404
          </div>

          {/* heading */}
          <h1 className="text-4xl font-extrabold text-sky-500 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] sm:text-5xl">
            Page Not Found
          </h1>

          <p className="text-muted-foreground mt-3 text-base">
            Halaman yang kamu cari tidak tersedia. Coba kembali ke beranda atau
            gunakan pencarian untuk menemukan Pokémon favoritmu.
          </p>

          {/* aksi */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full rounded-xl bg-sky-500 text-white shadow hover:bg-sky-600">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>

            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full rounded-xl border-sky-400/50 text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-400/10"
              >
                <Search className="mr-2 h-4 w-4" />
                Buka Explorer
              </Button>
            </Link>
          </div>

          {/* hint URL yang gagal */}
          <div className="mt-6 rounded-xl border border-sky-400/30 bg-sky-50/50 p-3 text-xs text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
            <span className="font-semibold">Path:</span> {location.pathname}
          </div>

          {/* aksen ring hover */}
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-sky-400/20 ring-inset" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;

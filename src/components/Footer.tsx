import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-muted-foreground mt-16 border-t border-sky-500/30 bg-sky-500/5 px-4 py-6 text-center text-sm backdrop-blur-md">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-sky-500">Dfaalt Pokédex</span>.
          All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dfaalt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-sky-500"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/ilham-maulana1101"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-sky-500"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>

          <a
            href="mailto:dfaalt1101@gmail.com"
            className="flex items-center gap-1 transition-colors hover:text-sky-500"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

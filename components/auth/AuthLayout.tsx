import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen bg-brav-background">
      {/* Brand section */}

      <section className="hidden flex-1 items-center justify-center bg-brav-primary p-12 lg:flex">
        <div className="max-w-md text-white">
          <div className="mb-8">
            <span className="text-4xl font-bold tracking-tight">
              BRAV
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Discover products you'll love.
          </h2>

          <p className="mt-5 text-white/70">
            Shop, discover, and experience BRAV.
          </p>
        </div>
      </section>

      {/* Form section */}

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="text-3xl font-bold tracking-tight">
              BRAV
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-brav-heading font-bold">
              {title}
            </h1>

            <p className="mt-2 text-sm text-brav-muted">
              {description}
            </p>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
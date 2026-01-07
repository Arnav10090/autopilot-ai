'use client';

export function SkipLinks() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-accent text-white rounded-lg font-medium transition-all transform -translate-y-12 focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Skip to main content
      </a>
      <a
        href="#main-nav"
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-accent text-white rounded-lg font-medium ml-36 transition-all transform -translate-y-12 focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Skip to navigation
      </a>
    </>
  );
}

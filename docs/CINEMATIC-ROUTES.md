# Cinematic homepage route migration

- `/` is the cinematic, photo-month destination finder. The homepage keeps its Navbar and newsletter anchor; destination guides keep their existing URLs.
- `/plan` now hosts the existing flight and hotel comparison form (`/plan#compare-prices`). Date validation, supplier URL generation and affiliate routing remain in the existing comparison components.
- `/explore` now hosts the existing interactive Goldilocks Zone map as an optional discovery route, retaining its filters, geography, guide markers and keyboard navigation.
- Guide “Compare Flights” links now point to `/plan#compare-prices`, without inventing travel dates or an origin.
- **Legacy hash compatibility:** the new homepage client redirects incoming `/#compare-prices` bookmarks to `/plan#compare-prices`. URL fragments are not available to server redirects; the compatibility handler is tested in both browser engines.
- The public SEO inventory is now **107 URLs**: seven indexable static routes (home, guides, plan, explore and three legal pages) plus the unchanged 100 destination guides. Canonical and social URLs retain `https://lostluggagelegend.com`, including on protected previews.

Browser regressions now exercise booking on `/plan`, the map on `/explore`, and real decoded homepage month/hero images through the image optimizer. Existing booking-date, supplier-link and guide-image assertions are retained. Run browser regressions against a production-mode server and inspect the protected preview through authenticated deployment tooling before publishing. Keep preview protection enabled.

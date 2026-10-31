/**
 * All imagery for the RAHAIL presentation lives here so it can be swapped in
 * one place. To use your own photos, drop them into `public/rahail/` and
 * replace the URL with e.g. '/rahail/cover.jpg'.
 *
 * To use the official logo file, place it at `public/rahail/logo.svg` (or
 * .png) and set LOGO_SRC to its path. It is always rendered at a fixed height
 * with automatic width, so its proportions are never distorted.
 */
export const LOGO_SRC: string | null = null;

const unsplash = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const MEDIA = {
  /** Scene 1 — golden desert dunes, seen through the arch window */
  cover: unsplash('photo-1509316785289-025f5b846b35'),
  /** Scene 2 — luxury resort */
  about: unsplash('photo-1566073771259-6a8506099945', 1600),
  /** Scene 3 — desert landscape (dark backdrop) */
  why: unsplash('photo-1451337516015-6b6e9a44a8a3'),
  /** Scene 4 — destination development */
  servicesDevelopment: unsplash('photo-1506905925346-21bda4d32df4', 1800),
  /** Scene 4 — operations & hospitality management */
  servicesOperations: unsplash('photo-1582719508461-905c673771fd', 1800),
  /** Scene 6 — resort at dusk */
  topPartner: unsplash('photo-1571003123894-1f0594d2b5d9'),
  /** Scene 7 — journey / packages */
  packages: unsplash('photo-1469854523086-cc02fe5d8800'),
  /** Closing */
  closing: unsplash('photo-1542401886-65d6c61db217'),
} as const;

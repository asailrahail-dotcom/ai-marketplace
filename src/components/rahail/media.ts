/**
 * Imagery for the RAHAIL presentation. Every photo comes from the official
 * RAHAIL company profile and lives in `public/rahail/`. To swap one, replace
 * the file (same name) or point the entry at a new file in that folder.
 */
const p = (name: string) => `/rahail/${name}`;

export const MEDIA = {
  cover: p('cover.jpg'),
  about: p('about.jpg'),
  why: {
    experience: p('site-visit.jpg'),
    quality: p('welcome.jpg'),
    investment: p('analytics.jpg'),
    returns: p('mountain-lodge.jpg'),
  },
  servicesDevelopment: p('mud-wall.jpg'),
  servicesOperations: p('lobby.jpg'),
  topPartner: p('resort.jpg'),
  /** Moving strip of experiences in the packages scene */
  experiences: [
    p('desert-view.jpg'),
    p('garden-night.jpg'),
    p('signature.jpg'),
    p('mountain-lodge.jpg'),
    p('host.jpg'),
    p('about.jpg'),
    p('mud-wall.jpg'),
    p('design.jpg'),
  ],
  /** Short muted loops (from the client's supplied clips) */
  video: {
    flight: { src: p('flight.mp4'), poster: p('flight-poster.jpg') },
    horses: { src: p('horses.mp4'), poster: p('horses-poster.jpg') },
    buggies: { src: p('buggies.mp4'), poster: p('buggies-poster.jpg') },
    astronomy: { src: p('astronomy.mp4'), poster: p('astronomy-poster.jpg') },
  },
  /** Partner programme */
  program: p('mountain-lodge.jpg'),
  tracks: {
    heritage: p('mud-wall.jpg'),
    nature: p('desert-view.jpg'),
    corporate: p('site-visit.jpg'),
    women: p('welcome.jpg'),
  },
  texture: p('texture.jpg'),
  closing: p('cover.jpg'),
} as const;

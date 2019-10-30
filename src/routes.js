import ShareImg72 from './resources/img/icon-72x72.png';
import ShareImg96 from './resources/img/icon-96x96.png';
import ShareImg128 from './resources/img/icon-128x128.png';
import ShareImg144 from './resources/img/icon-144x144.png';
import ShareImg152 from './resources/img/icon-152x152.png';
import ShareImg192 from './resources/img/icon-192x192.png';
import ShareImg384 from './resources/img/icon-384x384.png';
import ShareImg512 from './resources/img/icon-512x512.png';
import SocialShareImg from './resources/img/Social-Share-Image.png';
import HomeRoutes from './routes/main';
import { getFirebaseApp } from '@heartfulnessinstitute/react-hfn-profile';

getFirebaseApp();

export default class Routes {
  apply(routeHandler) {
    const routes = [
      ...HomeRoutes,
    ];

    routeHandler.hooks.initRoutes.tapPromise('AppRoutes', async () => {
      routeHandler.addRoutes(routes);
      routeHandler.setPwaSchema({
        name: 'Heartfulness Registrations',
        short_name: 'HFNReg',
        dir: 'ltr',
        lang: 'en-US',
        orientation: 'any',
        start_url: '/',
        background_color: '#111',
        theme_color: '#111',
        display: 'standalone',
        description: 'Heartfulness Events Registrations',
        icons: [
          {
            src: ShareImg72,
            sizes: '72x72',
          },
          {
            src: ShareImg96,
            sizes: '96x96',
          },
          {
            src: ShareImg128,
            sizes: '128x128',
          },
          {
            src: ShareImg144,
            sizes: '144x144',
          },
          {
            src: ShareImg152,
            sizes: '152x152',
          },
          {
            src: ShareImg192,
            sizes: '192x192',
          },
          {
            src: ShareImg384,
            sizes: '384x384',
          },
          {
            src: ShareImg512,
            sizes: '512x512',
          },
        ],
      });
      // eslint-disable-next-line
      routeHandler.getDefaultSeoSchema = () => ({
        title: 'Heartfulness Event Registrations',
        name: 'Heartfulness Event Registrations',
        description: 'Heartfulness Event Registrations at Kanha Shanti Vanam, Hyderabad',
        type: 'website',
        url: 'https://heartfulness.org/',
        site_name: 'HFNRegistrations',
        image: SocialShareImg,
        meta: [
          {
            name: 'author',
            content: 'Sree Hari Nagaralu',
          },
          {
            name: 'description',
            content: 'Heartfulness Event Registrations at Kanha Shanti Vanam Hyderabad',
          },
          {
            name: 'theme-color',
            content: '#111',
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#111',
          },
          {
            name: 'msapplication-TileColor',
            content: '#111',
          },
          {
            name: 'application-name',
            content: 'Heartfulness Registrations',
          },
          {
            name: 'generator',
            content: 'Heartfulness Registrations',
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Heartfulness Registrations',
          }
        ],
      });
    });
  }
}

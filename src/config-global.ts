import { paths } from 'src/routes/paths';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export const PATH_AFTER_LOGIN = paths.guest.root;

export const STRIPE_PUBLISH_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY;

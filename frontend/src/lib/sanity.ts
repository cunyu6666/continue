import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION;

if (!projectId || !dataset) {
  throw new Error('Missing Sanity environment variables');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  category: string;
  inStock: boolean;
}

export interface HeroContent {
  _id: string;
  title: string;
  subtitle: string;
  backgroundImage: any;
  ctaText: string;
}

export interface StoreInfo {
  _id: string;
  storeName: string;
  tagline: string;
  hours: string;
  phone: string;
  address: string;
}

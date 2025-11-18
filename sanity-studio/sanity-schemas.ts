// Sanity Studio Schema Definitions for 24/7 Store
// To set up Sanity Studio:
// 1. Run: npm create sanity@latest -- --template clean --create-project "24/7 Store" --dataset production
// 2. Copy these schema definitions to your schemas folder
// 3. Import and use them in your sanity.config.ts

// Product Schema
export const product = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Snacks', value: 'snacks' },
          { title: 'Beverages', value: 'beverages' },
          { title: 'Groceries', value: 'groceries' },
          { title: 'Household', value: 'household' },
          { title: 'Personal Care', value: 'personal-care' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'category',
    },
  },
};

// Hero Content Schema
export const hero = {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Shop Now',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'backgroundImage',
    },
  },
};

// Store Info Schema
export const storeInfo = {
  name: 'storeInfo',
  title: 'Store Information',
  type: 'document',
  fields: [
    {
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
    },
    {
      name: 'hours',
      title: 'Operating Hours',
      type: 'string',
      initialValue: 'Open 24/7',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
  ],
};

// Example sanity.config.ts usage:
/*
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { product, hero, storeInfo } from './schemas'

export default defineConfig({
  name: 'default',
  title: '24/7 Store',
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [product, hero, storeInfo],
  },
})
*/

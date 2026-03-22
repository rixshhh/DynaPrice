import { randomUUID } from 'crypto';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  sellerId: string;
  stock: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const seedProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 39.99,
    currency: 'USD',
    category: 'electronics',
    sellerId: 'seller_1',
    stock: 18,
    isPublished: true,
    createdAt: new Date('2026-01-12T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-01-12T10:00:00.000Z').toISOString(),
  },
  {
    id: 'prod_2',
    name: 'Pour-over Kettle',
    description: 'Precision gooseneck kettle',
    price: 64.5,
    currency: 'USD',
    category: 'kitchen',
    sellerId: 'seller_2',
    stock: 7,
    isPublished: true,
    createdAt: new Date('2026-02-01T14:30:00.000Z').toISOString(),
    updatedAt: new Date('2026-02-01T14:30:00.000Z').toISOString(),
  },
];

const globalStore = globalThis as typeof globalThis & {
  __productStore?: Map<string, Product>;
};

const store =
  globalStore.__productStore ??
  new Map(seedProducts.map((product) => [product.id, product]));

globalStore.__productStore = store;

export function listProducts(): Product[] {
  return Array.from(store.values());
}

export function getProduct(id: string): Product | undefined {
  return store.get(id);
}

export function createProduct(
  input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Product {
  const timestamp = new Date().toISOString();
  const product: Product = {
    ...input,
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.set(product.id, product);
  return product;
}

export function updateProduct(
  id: string,
  input: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
): Product | undefined {
  const existing = store.get(id);

  if (!existing) {
    return undefined;
  }

  const updated: Product = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  store.set(id, updated);
  return updated;
}

export function deleteProduct(id: string): boolean {
  return store.delete(id);
}

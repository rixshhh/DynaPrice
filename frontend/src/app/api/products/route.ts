import { NextRequest } from 'next/server';

import { canManageSellerScope, getRequester } from '@/lib/products-auth';
import {
  createProductSchema,
  listProductsQuerySchema,
  type SortableField,
} from '@/lib/products-schemas';
import { createProduct, listProducts } from '@/lib/products-store';

export async function POST(request: NextRequest) {
  const requester = getRequester(request);
  if (requester instanceof Response) return requester;

  const body = await request.json().catch(() => null);
  const parsedBody = createProductSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      {
        message: 'Invalid product payload.',
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (!canManageSellerScope(requester, parsedBody.data.sellerId)) {
    return Response.json(
      {
        message: 'Sellers can create products only for their own sellerId.',
      },
      { status: 403 },
    );
  }

  const product = createProduct(parsedBody.data);
  return Response.json(product, { status: 201 });
}

export async function GET(request: NextRequest) {
  const requester = getRequester(request);
  if (requester instanceof Response) return requester;

  const parsedQuery = listProductsQuerySchema.safeParse({
    page: request.nextUrl.searchParams.get('page') ?? undefined,
    pageSize: request.nextUrl.searchParams.get('pageSize') ?? undefined,
    sortBy: request.nextUrl.searchParams.get('sortBy') ?? undefined,
    sortOrder: request.nextUrl.searchParams.get('sortOrder') ?? undefined,
    category: request.nextUrl.searchParams.get('category') ?? undefined,
    sellerId: request.nextUrl.searchParams.get('sellerId') ?? undefined,
  });

  if (!parsedQuery.success) {
    return Response.json(
      {
        message: 'Invalid query parameters.',
        errors: parsedQuery.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { page, pageSize, sortBy, sortOrder, category, sellerId } = parsedQuery.data;

  if (requester.role !== 'admin' && sellerId && sellerId !== requester.userId) {
    return Response.json(
      {
        message: 'Sellers can query only their own sellerId scope.',
      },
      { status: 403 },
    );
  }

  const effectiveSellerId = requester.role === 'seller' ? requester.userId : sellerId;

  let products = listProducts();

  if (category) {
    products = products.filter((product) => product.category === category);
  }

  if (effectiveSellerId) {
    products = products.filter((product) => product.sellerId === effectiveSellerId);
  }

  products = products.sort((left, right) => {
    const sortField = sortBy as SortableField;
    const leftValue = left[sortField];
    const rightValue = right[sortField];
    const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
    return sortOrder === 'asc' ? comparison : comparison * -1;
  });

  const total = products.length;
  const start = (page - 1) * pageSize;
  const data = products.slice(start, start + pageSize);

  return Response.json({
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      sortBy,
      sortOrder,
      category: category ?? null,
      sellerId: effectiveSellerId ?? null,
    },
  });
}

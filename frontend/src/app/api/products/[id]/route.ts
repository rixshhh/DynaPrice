import { NextRequest } from 'next/server';

import { canManageSellerScope, getRequester } from '@/lib/products-auth';
import { updateProductSchema } from '@/lib/products-schemas';
import { deleteProduct, getProduct, updateProduct } from '@/lib/products-store';

function notFoundResponse(id: string) {
  return Response.json({ message: `Product ${id} not found.` }, { status: 404 });
}

function forbiddenResponse() {
  return Response.json(
    { message: 'You do not have permission to manage this product.' },
    { status: 403 },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = getRequester(request);
  if (requester instanceof Response) return requester;

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return notFoundResponse(id);
  }

  if (!canManageSellerScope(requester, product.sellerId)) {
    return forbiddenResponse();
  }

  return Response.json(product);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = getRequester(request);
  if (requester instanceof Response) return requester;

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return notFoundResponse(id);
  }

  if (!canManageSellerScope(requester, product.sellerId)) {
    return forbiddenResponse();
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateProductSchema.safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      {
        message: 'Invalid product update payload.',
        errors: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const updated = updateProduct(id, parsedBody.data);
  return Response.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = getRequester(request);
  if (requester instanceof Response) return requester;

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return notFoundResponse(id);
  }

  if (!canManageSellerScope(requester, product.sellerId)) {
    return forbiddenResponse();
  }

  deleteProduct(id);
  return new Response(null, { status: 204 });
}

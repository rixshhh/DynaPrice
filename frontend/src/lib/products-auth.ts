import { NextRequest } from 'next/server';

export type RequesterRole = 'admin' | 'seller';

export type Requester = {
  userId: string;
  role: RequesterRole;
};

export function getRequester(request: NextRequest): Requester | Response {
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');

  if (!userId || !role) {
    return Response.json(
      {
        message:
          'Missing requester context. Provide x-user-id and x-user-role headers.',
      },
      { status: 401 },
    );
  }

  if (role !== 'admin' && role !== 'seller') {
    return Response.json(
      {
        message: 'x-user-role must be either admin or seller.',
      },
      { status: 400 },
    );
  }

  return {
    userId,
    role,
  };
}

export function canManageSellerScope(requester: Requester, sellerId: string): boolean {
  return requester.role === 'admin' || requester.userId === sellerId;
}

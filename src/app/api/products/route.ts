import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, Gender } from '@/generated/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const gender = searchParams.get('gender');
    const concentration = searchParams.get('concentration');
    const brandId = searchParams.get('brandId');
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured') === 'true';
    const inStock = searchParams.get('inStock') === 'true';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: Prisma.ProductWhereInput = {};

    if (gender) {
      where.gender = gender as Gender;
    }

    if (concentration) {
      where.concentration = concentration;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured) {
      where.featured = true;
    }

    if (inStock) {
      where.inStock = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Récupérer les produits
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        _count: {
          select: { favorites: true }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    // Compter le total pour la pagination
    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 
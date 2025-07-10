import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock user ID - à remplacer par l'authentification réelle
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Pour le moment, on utilise un ID utilisateur mock
    // En production, récupérer l'ID depuis la session
    const favorites = await prisma.favorite.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: MOCK_USER_ID,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      // Supprimer le favori s'il existe déjà
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      return NextResponse.json({ 
        message: 'Favorite removed',
        isFavorite: false 
      });
    } else {
      // Ajouter le favori s'il n'existe pas
      const favorite = await prisma.favorite.create({
        data: {
          userId: MOCK_USER_ID,
          productId: productId,
        },
        include: {
          product: {
            include: {
              brand: true,
              category: true,
            }
          }
        },
      });

      return NextResponse.json({ 
        message: 'Favorite added',
        favorite,
        isFavorite: true 
      });
    }
  } catch (error) {
    console.error('Error managing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to manage favorite' },
      { status: 500 }
    );
  }
} 
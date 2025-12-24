import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Store from '@/lib/models/Store';

// POST move item to another store
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id: sourceStoreId } = await params;
        const { itemId, targetStoreId } = await request.json();

        if (!itemId || !targetStoreId) {
            return NextResponse.json(
                { success: false, error: 'Item ID and target store ID are required' },
                { status: 400 }
            );
        }

        // Get source store
        const sourceStore = await Store.findById(sourceStoreId);
        if (!sourceStore) {
            return NextResponse.json(
                { success: false, error: 'Source store not found' },
                { status: 404 }
            );
        }

        // Get target store
        const targetStore = await Store.findById(targetStoreId);
        if (!targetStore) {
            return NextResponse.json(
                { success: false, error: 'Target store not found' },
                { status: 404 }
            );
        }

        // Find the item in source store
        const itemIndex = sourceStore.items.findIndex(
            (item: { _id: { toString: () => string } }) => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Item not found in source store' },
                { status: 404 }
            );
        }

        // Remove item from source store
        const [movedItem] = sourceStore.items.splice(itemIndex, 1);

        // Add item to target store (unchecked)
        targetStore.items.push({
            name: movedItem.name,
            quantity: movedItem.quantity,
            checked: false,
        });

        // Save both stores
        await sourceStore.save();
        await targetStore.save();

        // Refresh both stores to get updated data with IDs
        const updatedSourceStore = await Store.findById(sourceStoreId);
        const updatedTargetStore = await Store.findById(targetStoreId);

        return NextResponse.json({
            success: true,
            data: {
                sourceStore: updatedSourceStore,
                targetStore: updatedTargetStore,
            },
        });
    } catch (error) {
        console.error('Error moving item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to move item' },
            { status: 500 }
        );
    }
}


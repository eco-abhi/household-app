import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/lib/models/Member';

// GET single member
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const member = await Member.findById(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: member });
    } catch (error) {
        console.error('Error fetching member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch member' },
            { status: 500 }
        );
    }
}

// PUT update member
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        const member = await Member.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!member) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: member });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update member' },
            { status: 500 }
        );
    }
}

// DELETE member
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const member = await Member.findByIdAndDelete(id);

        if (!member) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete member' },
            { status: 500 }
        );
    }
}






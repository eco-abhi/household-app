import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/lib/models/Member';

// GET all members
export async function GET() {
    try {
        await connectToDatabase();
        const members = await Member.find().sort({ name: 1 });
        return NextResponse.json({ success: true, data: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}

// POST create a new member
export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const member = await Member.create(body);
        return NextResponse.json({ success: true, data: member }, { status: 201 });
    } catch (error) {
        console.error('Error creating member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create member' },
            { status: 500 }
        );
    }
}






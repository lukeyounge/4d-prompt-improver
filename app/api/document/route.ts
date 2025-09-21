import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for documents (in production, you'd use a database)
const documentStore = new Map<string, { content: string; timestamp: number }>();

// Clean up old documents (older than 24 hours)
const cleanupOldDocuments = () => {
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  for (const [id, doc] of documentStore.entries()) {
    if (now - doc.timestamp > twentyFourHours) {
      documentStore.delete(id);
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Generate a simple random ID
    const id = Math.random().toString(36).substring(2, 15);
    
    // Store the document
    documentStore.set(id, {
      content,
      timestamp: Date.now()
    });

    // Clean up old documents
    cleanupOldDocuments();

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing document:', error);
    return NextResponse.json({ error: 'Failed to store document' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const document = documentStore.get(id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found or expired' }, { status: 404 });
    }

    return NextResponse.json({ content: document.content });
  } catch (error) {
    console.error('Error retrieving document:', error);
    return NextResponse.json({ error: 'Failed to retrieve document' }, { status: 500 });
  }
}
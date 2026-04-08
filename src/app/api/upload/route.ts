import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.stl', '.obj', '.3mf', '.step', '.stp'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` },
      { status: 400 }
    );
  }

  // Save file
  const timestamp = Date.now();
  const safeEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeEmail}_${timestamp}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

  return NextResponse.json({
    success: true,
    fileName: file.name,
    savedAs: fileName,
    size: file.size,
    url: `/uploads/${fileName}`,
  });
}

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
    try {
        console.log('[Upload API] Received upload request')
        const formData = await request.formData()
        const file = formData.get('file') as File

        console.log('[Upload API] File:', file ? file.name : 'No file')

        if (!file) {
            console.error('[Upload API] No file provided')
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        console.log('[Upload API] File type:', file.type, 'Size:', file.size)

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('[Upload API] Invalid file type:', file.type)
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            )
        }

        // Validate file size (10MB max for flexibility)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            console.error('[Upload API] File too large:', file.size)
            return NextResponse.json(
                { error: 'File size must be less than 10MB' },
                { status: 400 }
            )
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles')
        console.log('[Upload API] Upload directory:', uploadsDir)

        if (!existsSync(uploadsDir)) {
            console.log('[Upload API] Creating directory...')
            await mkdir(uploadsDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}-${originalName}`
        const filepath = join(uploadsDir, filename)

        console.log('[Upload API] Saving to:', filepath)

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Return the public URL
        const url = `/uploads/profiles/${filename}`

        console.log('[Upload API] Upload successful, URL:', url)

        return NextResponse.json({
            url,
            filename,
            size: file.size,
            type: file.type
        })
    } catch (error) {
        console.error('[Upload API] Error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

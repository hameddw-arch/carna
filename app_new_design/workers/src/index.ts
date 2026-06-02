import { randomUUID } from 'node:crypto'

export interface Env {
  R2_BUCKET: any
  R2_ACCOUNT_ID: string
  R2_PUBLIC_URL: string
}

interface UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': 'https://carna.online',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 })
    }

    const url = new URL(request.url)

    // Upload image endpoint
    if (request.method === 'POST' && url.pathname === '/upload') {
      return handleImageUpload(request, env, headers)
    }

    // Delete image endpoint
    if (request.method === 'DELETE' && url.pathname.startsWith('/delete')) {
      return handleImageDelete(request, env, headers)
    }

    // Health check
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json', ...headers },
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  },
}

async function handleImageUpload(
  request: Request,
  env: Env,
  headers: Record<string, string>
): Promise<Response> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'File too large. Max 10MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`
    const key = `listings/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${filename}`

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer()
    await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: 'inline',
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    })

    const imageUrl = `${env.R2_PUBLIC_URL}/${key}`

    return new Response(
      JSON.stringify({
        success: true,
        url: imageUrl,
        key: key,
      } as UploadResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...headers },
      }
    )
  }
}

async function handleImageDelete(
  request: Request,
  env: Env,
  headers: Record<string, string>
): Promise<Response> {
  try {
    const url = new URL(request.url)
    const key = url.searchParams.get('key')

    if (!key) {
      return new Response(
        JSON.stringify({ success: false, error: 'No key provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...headers } }
      )
    }

    // Delete from R2
    await env.R2_BUCKET.delete(key)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  } catch (error) {
    console.error('Delete error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Delete failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...headers },
      }
    )
  }
}

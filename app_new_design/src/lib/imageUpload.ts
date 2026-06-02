/**
 * Image Upload Service using Cloudflare R2
 * Handles image uploads for listings and services
 */

interface UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

const API_ENDPOINT = import.meta.env.VITE_R2_API_URL || 'https://api.carna.online'

/**
 * Upload single image to R2
 * @param file - Image file to upload
 * @returns Image URL or null on error
 */
export async function uploadImage(file: File): Promise<string | null> {
  try {
    // Validate file
    if (!file) {
      console.error('No file provided')
      return null
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_ENDPOINT}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Upload failed:', error.error)
      return null
    }

    const data: UploadResponse = await response.json()
    return data.url || null
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

/**
 * Upload multiple images
 * @param files - Array of image files
 * @returns Array of image URLs (null for failed uploads)
 */
export async function uploadImages(files: File[]): Promise<(string | null)[]> {
  return Promise.all(files.map(file => uploadImage(file)))
}

/**
 * Delete image from R2
 * @param key - Image key/path in R2
 * @returns Success status
 */
export async function deleteImage(key: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_ENDPOINT}/delete?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      console.error('Delete failed')
      return false
    }

    const data: UploadResponse = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Validate image before upload
 * @param file - Image file to validate
 * @returns Validation result
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
    }
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large. Maximum 10MB' }
  }

  return { valid: true }
}

/**
 * Convert image file to base64 (for preview only, not upload)
 * @param file - Image file
 * @returns Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get image from R2 with optimization
 * @param url - R2 image URL
 * @param options - Image optimization options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number
    height?: number
    quality?: 'low' | 'medium' | 'high'
    format?: 'webp' | 'avif'
  }
): string {
  if (!url) return ''

  // Cloudflare Image Optimization via URL params
  let optimizedUrl = url

  if (options?.width || options?.height) {
    const params = new URLSearchParams()
    if (options.width) params.append('width', options.width.toString())
    if (options.height) params.append('height', options.height.toString())
    if (options.quality) params.append('quality', options.quality)
    if (options.format) params.append('format', options.format)

    optimizedUrl = `${url}?${params.toString()}`
  }

  return optimizedUrl
}

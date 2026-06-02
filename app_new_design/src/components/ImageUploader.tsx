import { useState, useRef } from 'react'
import { uploadImage, validateImage, fileToBase64, deleteImage } from '../lib/imageUpload'

interface ImageUploaderProps {
  onImageUpload: (url: string) => void
  onImageDelete?: (url: string) => void
  maxImages?: number
  className?: string
}

export default function ImageUploader({
  onImageUpload,
  onImageDelete,
  maxImages = 5,
  className = '',
}: ImageUploaderProps) {
  const [images, setImages] = useState<{ url: string; key?: string; preview: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setError(null)
    setUploading(true)

    for (const file of files) {
      // Validate file
      const validation = validateImage(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        continue
      }

      try {
        // Create preview
        const preview = await fileToBase64(file)

        // Upload to R2
        const url = await uploadImage(file)

        if (url) {
          const newImage = { url, preview }
          setImages(prev => [...prev, newImage])
          onImageUpload(url)
        } else {
          setError('Failed to upload image')
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError('Upload failed. Try again.')
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (index: number) => {
    const image = images[index]

    // Delete from R2
    if (image.key) {
      await deleteImage(image.key)
    }

    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)

    if (onImageDelete) {
      onImageDelete(image.url)
    }
  }

  return (
    <div className={`space-y-md ${className}`}>
      <div>
        <label className="block text-label-lg font-label-lg mb-sm text-text-primary">
          صور الإعلان
        </label>
        <p className="text-body-sm text-tertiary mb-md">
          أضف صوراً واضحة للسيارة. يمكنك رفع حتى {maxImages} صور ({images.length}/{maxImages})
        </p>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-border-light rounded-lg p-lg text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-sm">
            <span className="material-symbols-outlined text-3xl text-tertiary">cloud_upload</span>
            <div>
              <p className="font-label-lg text-label-lg text-text-primary">
                {uploading ? 'جارٍ الرفع...' : 'اضغط أو أفلت الصور هنا'}
              </p>
              <p className="text-body-sm text-tertiary mt-1">
                PNG, JPEG, WebP (Max 10MB لكل صورة)
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-md p-md bg-error/10 border border-error rounded-lg">
            <p className="text-body-sm text-error">{error}</p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-label-lg font-label-lg mb-md text-text-primary">الصور المرفوعة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />

                {/* Delete Button */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-error text-on-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="حذف الصورة"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>

                {/* Loading Indicator */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin">
                      <span className="material-symbols-outlined text-white">hourglass_empty</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

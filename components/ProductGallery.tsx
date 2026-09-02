'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex] || images[0] || null

  return (
    <div>
      {/* Main Image */}
      <div
        className="rounded-2xl overflow-hidden aspect-square relative flex items-center justify-center transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={name}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={64} style={{ color: 'var(--text-tertiary)' }} />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
          {images.map((img, i) => {
            const isSelected = selectedIndex === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className="rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                style={{
                  width: '72px',
                  height: '72px',
                  border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border-default)',
                  opacity: isSelected ? 1 : 0.7,
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <img src={img} alt={`${name} - ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ClickableImageProps {
  src: string;
  fullSrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}

// Fixed-width, natural-height thumbnail (no cropping -- width/height just
// set the true aspect ratio so next/image can size it without layout shift)
// that opens a full-size view in a modal on click. The modal image is a
// plain <img>, not next/image: with no width/height forced, the browser
// renders it at its natural pixel size by default, and the max-w/max-h
// constraints below only kick in to shrink it when that's bigger than the
// viewport -- exactly "fill the screen if it needs to, otherwise true size".
export default function ClickableImage({
  src,
  fullSrc,
  alt,
  width,
  height,
  className,
  imgClassName,
  sizes,
  priority,
}: ClickableImageProps) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`block w-full cursor-zoom-in ${className || ''}`}
        aria-label={`Expand image${alt ? `: ${alt}` : ''}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`w-full h-auto ${imgClassName || ''}`}
        />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Expanded image'}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setOpen(false)}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors material-symbols-outlined"
            >
              close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- deliberately
                a plain <img>, not next/image: we want the browser's default
                "render at natural size, only shrink via max-w/max-h" behavior,
                which next/image's required width/height would fight against. */}
            <img
              src={fullSrc || src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto' }}
              className="object-contain ink-border"
            />
          </div>,
          document.body
        )}
    </>
  );
}

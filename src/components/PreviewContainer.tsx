import { Card } from '@sanity/ui'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import getScaleFitTransform from '../utils/getScaleFitTransform'

type ImageContainerProps = {
  width: number
  height: number
  captureRef: React.RefObject<HTMLDivElement>
}

const PreviewContainer = ({
  width,
  height,
  captureRef,
  children,
}: PropsWithChildren<ImageContainerProps>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState(containerRef?.current?.getBoundingClientRect())

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerRect(entry.target?.getBoundingClientRect())
      }
    })
    if (containerRef?.current) observer.observe(containerRef?.current)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  return (
    <div style={{ flex: 1, overflow: 'hidden' }} ref={containerRef}>
      <Card
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transformOrigin: 'top left',
          transform: getScaleFitTransform(containerRect, width, height),
        }}
        border
        sizing="border"
        overflow="hidden"
      >
        {/* Preview Card */}
        <div
          ref={captureRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
            // Hack to display the full border of the parent card
            transform: 'scale(0.99)',
          }}
        >
          {children}
        </div>
      </Card>
    </div>
  )
}

export default PreviewContainer

import { Card, Flex } from '@sanity/ui'
import React, { useEffect, useRef, useState } from 'react'
import { SanityDocument } from 'sanity'
import { EditorLayout } from '../types'
import getScaleFitTransform from '../utils/getScaleFitTransform'
import LayoutsPicker from './LayoutsPicker'

const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 630,
}

type ImageViewerProps = {
  document: SanityDocument
  formData: Record<string, any>
  layouts?: EditorLayout[]
  activeLayout: EditorLayout
  disabled: boolean
  captureRef: React.RefObject<HTMLDivElement>
  setActiveLayout: (newLayout: EditorLayout) => void
}

const ImageViewer = (props: ImageViewerProps) => {
  const { document, formData, activeLayout, layouts, disabled, captureRef, setActiveLayout } = props
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

  const LayoutComponent = activeLayout.component
  const width = activeLayout.dimensions?.width || DEFAULT_DIMENSIONS.width
  const height = activeLayout.dimensions?.height || DEFAULT_DIMENSIONS.height

  return (
    <Card
      height="fill"
      overflow="hidden"
      style={{
        padding: '20px 10px',
        maxWidth: `${width + 10 * 2}px`,
        flex: 2,
      }}
      sizing="border"
    >
      <Flex gap={3} direction="column">
        <LayoutsPicker
          layouts={layouts}
          activeLayout={activeLayout}
          disabled={disabled}
          setActiveLayout={setActiveLayout}
        />

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
              {/* Generated Custom Layout */}
              {LayoutComponent && <LayoutComponent document={document} formData={formData} />}
            </div>
          </Card>
        </div>
      </Flex>
    </Card>
  )
}

export default ImageViewer

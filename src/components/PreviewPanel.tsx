import { Card, Flex } from '@sanity/ui'
import React from 'react'
import { SanityDocument } from 'sanity'
import { EditorLayout } from '../types'
import LayoutsPicker from './LayoutsPicker'
import PreviewContainer from './PreviewContainer'

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

const PreviewPanel = (props: ImageViewerProps) => {
  const { document, formData, activeLayout, layouts, disabled, captureRef, setActiveLayout } = props

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

        <PreviewContainer width={width} height={height} captureRef={captureRef}>
          {/* Generated Custom Layout */}
          {LayoutComponent && <LayoutComponent document={document} formData={formData} />}
        </PreviewContainer>
      </Flex>
    </Card>
  )
}

export default PreviewPanel

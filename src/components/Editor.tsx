import { CloseIcon, GenerateIcon } from '@sanity/icons'
import { Button, Card, Flex, Inline, Layer, Spinner, Stack, Text } from '@sanity/ui'
import { useEffect, useRef, useState } from 'react'
import { FormBuilder } from 'sanity'
import { EditorProps } from '../types'
import useEditorLogic from '../useEditorLogic'
import LayoutsPicker from './LayoutsPicker'

const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 630,
}

const Editor = (props: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState(containerRef?.current?.getBoundingClientRect())
  const {
    activeLayout,
    setActiveLayout,
    generateImage,
    disabled,
    captureRef,
    formData,
    formBuilderProps,
  } = useEditorLogic(props)

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
      scheme="light"
      height="fill"
      sizing="border"
      display="flex"
      style={{ flexDirection: 'column' }}
    >
      <Card
        tone="default"
        padding={4}
        marginBottom={[4, 0]}
        borderBottom
        style={{ textAlign: 'right' }}
      >
        <Flex justify="space-between" align="center">
          <Inline space={3}>
            <Text size={3} weight="semibold">
              {props.dialog?.title || 'Create image'}
            </Text>
            <Button
              icon={disabled ? Spinner : GenerateIcon}
              tone="positive"
              text={props.dialog?.finishCta || 'Generate'}
              onClick={generateImage}
              disabled={disabled}
            />
          </Inline>
          {/* If onClose is defined, we're in an assetSource, where we should provide a header with a close button */}
          {props.onClose && (
            <Button
              onClick={props.onClose}
              icon={CloseIcon}
              mode="bleed"
              tone="critical"
              title={props.dialog?.ariaClose || 'close'}
            />
          )}
        </Flex>
      </Card>
      <Flex
        justify="flex-start"
        align="stretch"
        height="fill"
        width="100%"
        sizing="border"
        padding={3}
      >
        {formBuilderProps && (
          <Card
            paddingLeft={2}
            paddingTop={2}
            paddingRight={4}
            paddingBottom={4}
            marginRight={3}
            style={{ maxWidth: '370px', flex: '1 0 200px' }}
            sizing="border"
            overflow="auto"
            height="fill"
          >
            <Stack space={4}>
              <Layer zOffset={10000}>
                <FormBuilder {...formBuilderProps} />
              </Layer>
            </Stack>
          </Card>
        )}
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
              layouts={props.layouts}
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
                  {LayoutComponent && (
                    <LayoutComponent document={props.document} formData={formData} />
                  )}
                </div>
              </Card>
            </div>
          </Flex>
        </Card>
      </Flex>
    </Card>
  )
}

export default Editor

/**
 * Returns a CSS transform that fits the given width and height into the given container
 */
function getScaleFitTransform(
  containerRect: DOMRect | undefined,
  width: number,
  height: number,
): string | undefined {
  if (!containerRect) return undefined

  const scaleX = containerRect.width / width
  const scaleY = containerRect.height / height
  const scale = Math.min(scaleX, scaleY)

  if (scale > 1) return undefined

  return `scale(${scale})`
}

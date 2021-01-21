import {
  Box,
  Button,
  Card,
  Flex,
  Inline,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import { CloseIcon, CogIcon } from '@sanity/icons'
import { DialogLabels, EditorLayout, LayoutData, SanityDocument } from '@types'
import * as React from 'react'
import download from 'downloadjs'
import styled from 'styled-components'
import { toPng } from 'html-to-image'

import defaultLayout from './defaultLayout'
import EditorField from './EditorField'

interface EditorProps {
  layouts: EditorLayout[]
  onSelect?: (...props: any) => void
  onClose?: () => void
  dialog?: DialogLabels
  document: SanityDocument
}

const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 630,
}

// Where we should start/finish wrapping Wrapper
const BREAKPOINT = 1100

const Root = styled(Box)`
  @media (min-width: ${BREAKPOINT}px) {
    &:not([hidden]) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`

const Wrapper = styled(Flex)`
  @media (max-width: ${BREAKPOINT - 1}px) {
    &:not([hidden]) {
      flex-wrap: wrap;
    }
  }
`

const Editor: React.FC<EditorProps> = (props) => {
  const [status, setStatus] = React.useState<
    'idle' | 'error' | 'loading' | 'success'
  >('idle')
  const disabled = status === 'loading'

  const captureRef = React.useRef<HTMLDivElement>()

  const [activeLayout, setActiveLayout] = React.useState<EditorLayout>(
    props.layouts[0] || defaultLayout,
  )
  const [data, setData] = React.useState<LayoutData>(
    activeLayout.prepare(props.document),
  )
  const LayoutComponent = activeLayout.component as any

  React.useEffect(() => {
    setData(activeLayout.prepare(props.document))
  }, [activeLayout])

  const width = activeLayout.dimensions?.width || DEFAULT_DIMENSIONS.width
  const height = activeLayout.dimensions?.height || DEFAULT_DIMENSIONS.height

  async function generateImage(e: React.FormEvent) {
    e.preventDefault()
    if (!captureRef?.current) {
      return
    }
    try {
      setStatus('loading')
      const imgBase64 = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 1,
      })
      setStatus('success')
      if (props.onSelect) {
        props.onSelect([
          {
            kind: 'base64',
            value: imgBase64,
            assetDocumentProps: {
              originalFilename: `OG Image - ${
                activeLayout.title || activeLayout.name
              } - ${new Date(Date.now()).toISOString()}`,
              source: {
                name: 'asset-source-ogimage',
                id: 'asset-source-ogimage',
              },
            },
          },
        ])
      } else {
        download(imgBase64, 'test.png')
      }
    } catch (error) {
      setStatus('error')
      console.error(error)
    }
  }

  return (
    <Card scheme="light" height="fill" sizing="border">
      <Card
        tone="default"
        padding={4}
        marginBottom={[4, 0]}
        borderBottom={true}
        style={{ textAlign: 'right' }}
      >
        <Flex justify="space-between" align="center">
          <Text size={3} weight="semibold">
            {props.dialog?.title || 'Generate image'}
          </Text>

          {/* If onClose is defined, we're in an assetSource, where we should provide a header with a close button */}
          {props.onClose && (
            <Button
              onClick={props.onClose}
              icon={CloseIcon}
              mode="bleed"
              tone="critical"
              title={props.dialog?.ariaClose || 'close'}
            ></Button>
          )}
        </Flex>
      </Card>
      <Root height="fill" overflow="auto">
        <Wrapper justify="center">
          <Box padding={3}>
            <Stack space={4}>
              {activeLayout.fields.map((field) => (
                <EditorField
                  field={field}
                  updateData={(newData) => setData(newData)}
                  data={data}
                  disabled={disabled}
                />
              ))}

              <Button
                // fontSize={[2, 2, 3]}
                // padding={[3, 3, 4]}
                icon={disabled ? Spinner : CogIcon}
                tone="primary"
                text={props.dialog?.finishCta || 'Create'}
                onClick={generateImage}
                disabled={disabled}
              />
            </Stack>
          </Box>
          <Box
            height="fill"
            overflow="auto"
            style={{
              maxWidth: `${width}px`,
            }}
          >
            <Stack space={3}>
              {props.layouts?.length > 1 && (
                <>
                  <Box>
                    <Text>Choose layout</Text>
                  </Box>
                  <Inline space={[3, 3, 4]}>
                    {props.layouts.map((layout, i) => (
                      <Button
                        key={layout.name || layout.title || `${i}-layout`}
                        mode={
                          activeLayout.name === layout.name
                            ? 'default'
                            : 'ghost'
                        }
                        tone={
                          activeLayout.name === layout.name
                            ? 'positive'
                            : 'default'
                        }
                        text={layout.title || layout.name}
                        onClick={() => setActiveLayout(layout)}
                        disabled={disabled}
                      />
                    ))}
                  </Inline>
                </>
              )}
              <div
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  boxSizing: 'border-box',
                }}
                ref={captureRef}
              >
                <LayoutComponent {...data} />
              </div>
            </Stack>
          </Box>
        </Wrapper>
      </Root>
    </Card>
  )
}

export default Editor

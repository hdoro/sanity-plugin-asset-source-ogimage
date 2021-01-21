import { Box, Button, Card, Container, Flex, Stack, Text } from '@sanity/ui'
import { CogIcon } from '@sanity/icons'
import { DialogLabels, EditorLayout, LayoutData, SanityDocument } from '@types'
import * as React from 'react'
import download from 'downloadjs'
import { toPng } from 'html-to-image'

import defaultLayout from './defaultLayout'
import EditorField from './EditorField'

interface EditorProps {
  layouts: EditorLayout[]
  onSelect?: () => void
  dialog?: DialogLabels
  document: SanityDocument
}

const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 630,
}

const Editor: React.FC<EditorProps> = (props) => {
  const captureRef = React.useRef<HTMLDivElement>()
  const [layout] = React.useState<EditorLayout>(
    props.layouts[0] || defaultLayout,
  )
  const [data, setData] = React.useState<LayoutData>(
    layout.prepare(props.document),
  )
  const LayoutComponent = layout.component as any

  React.useEffect(() => {
    setData(layout.prepare(props.document))
  }, [layout])

  const width = layout.dimensions?.width || DEFAULT_DIMENSIONS.width
  const height = layout.dimensions?.height || DEFAULT_DIMENSIONS.height

  async function generateImage(e: React.FormEvent) {
    e.preventDefault()
    if (!captureRef?.current) {
      return
    }
    try {
      const img = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 1,
      })
      download(img, 'test.png')
    } catch (error) {
      console.error(error)
    }
  }
  console.log({ data })

  return (
    <Card
      scheme="light"
      style={{
        height: '100%',
        minHeight: '100%',
      }}
      padding={3}
    >
      <Flex>
        <Box padding={3}>
          <Stack space={4}>
            <Text size={4}>{props.dialog?.title || 'Generate image'}</Text>
            {layout.fields.map((field) => (
              <EditorField
                field={field}
                updateData={(newData) => setData(newData)}
                data={data}
              />
            ))}

            <Button
              // fontSize={[2, 2, 3]}
              // padding={[3, 3, 4]}
              icon={CogIcon}
              tone="primary"
              text="Create"
              onClick={generateImage}
            />
          </Stack>
        </Box>
        <Container
          width={width}
          style={{
            overflow: 'auto',
            maxHeight: 'calc(100% - 60px)',
          }}
        >
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
        </Container>
      </Flex>
    </Card>
  )
}

export default Editor

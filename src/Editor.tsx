import { Card, Text } from '@sanity/ui'
import { DialogLabels, EditorLayout, SanityDocument } from '@types'
import * as React from 'react'

interface EditorProps {
  layouts: EditorLayout[]
  onSelect?: () => void
  dialog?: DialogLabels
  document: SanityDocument
}

const Editor: React.FC<EditorProps> = (props) => {
  return (
    <Card
      scheme="light"
      style={{
        height: '100%',
        minHeight: '100%',
      }}
    >
      <Card padding={3}>
        <Text size={4} as="h1">
          {props.dialog?.title || 'Generate image'}
        </Text>
      </Card>
    </Card>
  )
}

export default Editor

// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Card, Flex } from '@sanity/ui'
import useEditorLogic from '../hooks/useEditorLogic'
import { EditorProps } from '../types'
import FormControls from './FormControls'
import ImageViewer from './ImageViewer'
import PortalHead from './PortalHead'

const Editor = (props: EditorProps) => {
  const { document, dialog, onClose, ...restProps } = props
  const { generateImage, disabled, formBuilderProps, ...logic } = useEditorLogic(props)

  return (
    <Card height="fill" display="flex">
      <Flex direction="column" flex={1}>
        <PortalHead
          document={document}
          disabled={disabled}
          dialog={dialog}
          onClose={onClose}
          generateImage={generateImage}
        />
        <Flex
          justify="flex-start"
          align="stretch"
          height="fill"
          width="100%"
          sizing="border"
          padding={3}
        >
          {/* Form Controls */}
          {formBuilderProps && <FormControls {...formBuilderProps} />}

          {/* Image Viewer  */}
          <ImageViewer {...logic} {...restProps} document={document} disabled={disabled} />
        </Flex>
      </Flex>
    </Card>
  )
}

export default Editor

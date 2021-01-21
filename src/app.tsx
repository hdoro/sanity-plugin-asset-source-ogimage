import {
  Box,
  Portal,
  ThemeProvider,
  studioTheme,
  useGlobalKeyDown,
} from '@sanity/ui'
import React from 'react'
import isHotkey from 'is-hotkey'
import { SanityDocument, EditorLayout, DialogLabels } from '@types'
import defaultLayout from './defaultLayout'
import Editor from './Editor'

interface SelectedAsset {
  [key: string]: any
}

type Props = {
  // User-provided. See README for how they set it up
  layouts?: EditorLayout[]
  dialog?: DialogLabels
  // The props below are provided by Sanity
  /**
   * Exclusive to asset source dialogs.
   */
  onClose?: () => void
  /**
   * Exclusive to asset source dialogs.
   */
  onSelect?: () => void
  /**
   * Exclusive to studio tools.
   */
  tool?: string
  document?: SanityDocument
  selectedAssets?: SelectedAsset[]
  selectionType: 'single'
}

const MediaEditor = (props: Props) => {
  const handleGlobalKeyDown = React.useCallback((event: KeyboardEvent) => {
    // Close on escape key press
    if (isHotkey('esc', event) && props.onClose) {
      props.onClose()
    }
  }, [])
  useGlobalKeyDown(handleGlobalKeyDown)

  let layouts = props.layouts?.filter(
    (layout) => layout.prepare && layout.component,
  )
  if (!layouts?.length) {
    layouts = [defaultLayout]
  }
  if (!layouts?.length) {
    if (props.onClose) {
      props.onClose()
    }
    return null
  }
  const document: SanityDocument = props.document || { _id: 'unknown' }
  console.log({ props, layouts })

  const editorProps = {
    document,
    layouts,
    onSelect: props.onSelect,
    dialog: props.dialog,
  }

  return (
    <ThemeProvider theme={studioTheme}>
      {props.tool ? (
        <Box
          style={{
            height: '100%',
            position: 'relative',
          }}
        >
          <Editor {...editorProps} />
        </Box>
      ) : (
        <Portal>
          <Box
            style={{
              bottom: 0,
              height: 'auto',
              left: 0,
              position: 'fixed',
              top: 0,
              width: '100%',
              zIndex: 10000,
            }}
          >
            <Editor {...editorProps} />
          </Box>
        </Portal>
      )}
    </ThemeProvider>
  )
}

export default MediaEditor

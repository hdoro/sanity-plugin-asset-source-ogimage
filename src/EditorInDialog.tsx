import { Box, studioTheme, ThemeProvider, useGlobalKeyDown } from '@sanity/ui'
import isHotkey from 'is-hotkey'
import React from 'react'
import { createPortal } from 'react-dom'
import Editor from './components/Editor'
import { EditorLayout, EditorProps } from './types'

export const EditorInDialog = (props: EditorProps) => {
  const { onClose } = props
  const handleGlobalKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      // Close on escape key press
      if (isHotkey('esc', event) && onClose) {
        onClose()
      }
    },
    [onClose],
  )
  useGlobalKeyDown(handleGlobalKeyDown)

  const layouts: EditorLayout[] =
    props.layouts?.filter((layout) => typeof layout.component === 'function') || []

  if (!layouts?.length) {
    if (props.onClose) {
      props.onClose()
    }
    return null
  }

  return (
    <ThemeProvider theme={studioTheme}>
      {props.context === 'tool' ? (
        <Box
          style={{
            height: '100%',
            position: 'relative',
          }}
        >
          <Editor {...props} />
        </Box>
      ) : (
        // Use a portal to render outside the document pane
        createPortal(
          <Box
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              zIndex: 100000,
            }}
          >
            <Editor {...props} />
          </Box>,
          document.body,
        )
      )}
    </ThemeProvider>
  )
}

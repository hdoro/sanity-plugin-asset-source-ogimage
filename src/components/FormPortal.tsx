// eslint-disable-next-line no-unused-vars
import React, { SyntheticEvent } from 'react'
import { Box, Portal, PortalProvider, studioTheme, ThemeProvider, useLayer } from '@sanity/ui'
import useKeyPress from '../hooks/useKeyPress'
import useRootPortalElement from '../hooks/useRootPortalElement'
import { EditorLayout, EditorProps } from '../types'
import Editor from './Editor'

export const FormPortal = (props: EditorProps) => {
  const { onClose } = props

  const portalElement = useRootPortalElement()

  useKeyPress('escape', onClose)

  function handleStopPropagation(event: SyntheticEvent) {
    event.nativeEvent.stopImmediatePropagation()
    event.stopPropagation()
  }

  const { zIndex } = useLayer()

  const layouts: EditorLayout[] =
    props.layouts?.filter((layout) => typeof layout.component === 'function') || []

  if (!layouts?.length) {
    if (props.onClose) {
      props.onClose()
    }

    return null
  }

  return (
    <PortalProvider element={portalElement}>
      <ThemeProvider theme={studioTheme}>
        <Portal>
          <Box
            onDragEnter={handleStopPropagation}
            onDragLeave={handleStopPropagation}
            onDragOver={handleStopPropagation}
            onDrop={handleStopPropagation}
            onMouseUp={handleStopPropagation}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              top: 0,
              width: '100%',
              height: 'auto',
              zIndex,
            }}
          >
            <Editor {...props} />
          </Box>
        </Portal>
      </ThemeProvider>
    </PortalProvider>
  )
}

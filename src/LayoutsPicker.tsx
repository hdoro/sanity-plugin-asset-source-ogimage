import { Box, Button, Inline, Text } from '@sanity/ui'
import { EditorLayout } from '@types'
import * as React from 'react'

interface LayoutsPickerProps {
  layouts?: EditorLayout[]
  activeLayout?: EditorLayout
  disabled: boolean
  setActiveLayout?: (layout: EditorLayout) => void
}

const LayoutsPicker: React.FC<LayoutsPickerProps> = (props) => {
  if (
    !props.layouts?.length ||
    props.layouts.length < 2 ||
    !props.activeLayout ||
    !props.setActiveLayout
  ) {
    return null
  }
  return (
    <>
      <Box>
        <Text>Choose layout</Text>
      </Box>
      <Inline space={3}>
        {props.layouts.map((layout, i) => (
          <Button
            key={layout.name || layout.title || `${i}-layout`}
            mode={props.activeLayout.name === layout.name ? 'default' : 'ghost'}
            tone={
              props.activeLayout.name === layout.name ? 'positive' : 'default'
            }
            text={layout.title || layout.name}
            onClick={() => props.setActiveLayout(layout)}
            disabled={props.disabled}
          />
        ))}
      </Inline>
    </>
  )
}

export default LayoutsPicker

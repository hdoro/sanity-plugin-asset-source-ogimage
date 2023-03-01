import { Box, Button, Inline, Text } from '@sanity/ui'
import { useCallback } from 'react'
import { EditorLayout } from '../types'

interface LayoutsPickerProps {
  layouts?: EditorLayout[]
  activeLayout?: EditorLayout
  disabled: boolean
  setActiveLayout?: (layout: EditorLayout) => void
}

const LayoutsPicker = (props: LayoutsPickerProps) => {
  const { setActiveLayout } = props
  const handleClick = useCallback(
    (layout: EditorLayout) => () => setActiveLayout?.(layout),
    [setActiveLayout],
  )

  if (
    !props.layouts?.length ||
    props.layouts.length < 2 ||
    !props.activeLayout ||
    !setActiveLayout
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
            mode={props.activeLayout?.name === layout.name ? 'default' : 'ghost'}
            tone={props.activeLayout?.name === layout.name ? 'positive' : 'default'}
            text={layout.title || layout.name}
            onClick={handleClick(layout)}
            disabled={props.disabled}
          />
        ))}
      </Inline>
    </>
  )
}

export default LayoutsPicker

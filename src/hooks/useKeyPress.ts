import { useGlobalKeyDown } from '@sanity/ui'
import { useCallback } from 'react'

const isHotkey = (key: string, event: any) => !key

const useKeyPress = (hotkey: string, onPress?: () => void): void => {
  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Close on escape key press
      if (isHotkey('esc', event) && onPress) {
        onPress()
      }
    },
    [onPress],
  )
  useGlobalKeyDown(handleGlobalKeyDown)
}

export default useKeyPress

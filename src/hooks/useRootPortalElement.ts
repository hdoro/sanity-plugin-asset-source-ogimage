import { useState, useEffect } from 'react'

/**
 * Creates a mount point for the portal view
 */
const useRootPortalElement = (): HTMLDivElement => {
  const [container] = useState(() => document.createElement('div'))

  useEffect(() => {
    container.classList.add('media-portal')
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [container])

  return container
}

export default useRootPortalElement

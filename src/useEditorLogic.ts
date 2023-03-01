import download from 'downloadjs'
import { toPng } from 'html-to-image'
import React from 'react'
import { EditorLayout, EditorProps } from './types'

type GenericLayoutData = Record<string, any>

function useEditorLogic(props: EditorProps): {
  activeLayout: EditorLayout
  setActiveLayout: (newLayout: EditorLayout) => void
  disabled: boolean
  generateImage: (e: React.FormEvent) => void
  captureRef: React.RefObject<HTMLDivElement>
  formData: GenericLayoutData
  setFormData: (newData: GenericLayoutData) => void
} {
  const captureRef = React.useRef<HTMLDivElement>(null)

  const [status, setStatus] = React.useState<'idle' | 'error' | 'loading' | 'success'>('idle')
  const disabled = status === 'loading'

  const validLayouts = props.layouts?.filter((layout) => layout.component) || []
  const [activeLayout, setActiveLayout] = React.useState<EditorLayout>(validLayouts[0])
  const [formData, setFormData] = React.useState<GenericLayoutData>(
    // Only asset sources (which include onSelect) should use the prepare function
    activeLayout.prepareFormData && props.onSelect
      ? activeLayout.prepareFormData(props.document)
      : // Studio tools should start with empty data
        {},
  )

  React.useEffect(() => {
    if (!activeLayout?.prepareFormData) return

    setFormData(activeLayout.prepareFormData(props.document))
  }, [activeLayout, setFormData, props.document])

  async function generateImage(e: React.FormEvent) {
    e.preventDefault()
    if (!captureRef?.current) {
      return
    }
    try {
      setStatus('loading')
      const imgBase64 = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 1,
        includeQueryParams: true,
      })
      setStatus('success')
      if (props.onSelect) {
        props.onSelect([
          {
            kind: 'base64',
            value: imgBase64,
            assetDocumentProps: {
              originalFilename: `OG Image - ${activeLayout.title || activeLayout.name} - ${new Date(
                Date.now(),
              ).toISOString()}`,
              source: {
                name: 'asset-source-ogimage',
                id: 'asset-source-ogimage',
              },
            },
          },
        ])
      } else {
        download(imgBase64, 'generated.png')
      }
    } catch (error) {
      setStatus('error')
      console.error(error)
    }
  }

  return {
    activeLayout,
    setActiveLayout,
    disabled,
    generateImage,
    captureRef,
    formData,
    setFormData,
  }
}

export default useEditorLogic

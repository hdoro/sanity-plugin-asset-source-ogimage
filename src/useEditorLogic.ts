import download from 'downloadjs'
import { toPng } from 'html-to-image'
import React from 'react'
import { EditorProps } from './components/Editor'
import defaultLayout from './defaultLayout'
import { EditorLayout, LayoutData } from './types'

function useEditorLogic(props: EditorProps): {
  activeLayout: EditorLayout
  setActiveLayout: (newLayout: EditorLayout) => void
  disabled: boolean
  generateImage: (e: React.FormEvent) => void
  captureRef: React.MutableRefObject<HTMLDivElement>
  data: LayoutData
  setData: (newData: LayoutData) => void
} {
  const captureRef = React.useRef<HTMLDivElement>()

  const [status, setStatus] = React.useState<'idle' | 'error' | 'loading' | 'success'>('idle')
  const disabled = status === 'loading'

  const [activeLayout, setActiveLayout] = React.useState<EditorLayout>(
    props.layouts && props.layouts[0]?.component ? props.layouts[0] : (defaultLayout as any),
  )
  const [data, setData] = React.useState<LayoutData>(
    // Only asset sources (which include onSelect) should use the prepare function
    activeLayout.prepare && props.onSelect
      ? activeLayout.prepare(props.document)
      : // Studio tools should start with empty data
        {},
  )

  React.useEffect(() => {
    if (!activeLayout?.prepare) return

    setData(activeLayout.prepare(props.document))
  }, [activeLayout, setData, props.document])

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
    data,
    setData,
  }
}

export default useEditorLogic

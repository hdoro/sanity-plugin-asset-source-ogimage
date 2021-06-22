import { EditorLayout, LayoutData } from '@types'
import download from 'downloadjs'
import { toPng } from 'html-to-image'
import React from 'react'

import defaultLayout from './defaultLayout'
import { EditorProps } from './Editor'

function useEditorLogic(
  props: EditorProps,
): {
  activeLayout: EditorLayout
  setActiveLayout: (newLayout: EditorLayout) => void
  disabled: boolean
  generateImage: (e: React.FormEvent) => void
  captureRef: React.MutableRefObject<HTMLDivElement>
  data: LayoutData
  setData: (newData: LayoutData) => void
} {
  const captureRef = React.useRef<HTMLDivElement>()

  const [status, setStatus] = React.useState<
    'idle' | 'error' | 'loading' | 'success'
  >('idle')
  const disabled = status === 'loading'

  const [activeLayout, setActiveLayout] = React.useState<EditorLayout>(
    props.layouts && props.layouts[0]?.component
      ? props.layouts[0]
      : defaultLayout,
  )
  const [data, setData] = React.useState<LayoutData>(
    // Only asset sources (which include onSelect) should use the prepare function
    activeLayout.prepare && props.onSelect
      ? activeLayout.prepare(props.document)
      : // Studio tools should start with empty data
        {},
  )

  React.useEffect(() => {
    setData(activeLayout.prepare(props.document))
  }, [activeLayout])

  async function generateImage(e: React.FormEvent) {
    e.preventDefault()
    if (!captureRef?.current) {
      return
    }
    try {
      setStatus('loading')
      let imgBase64: string
      if (activeLayout.renderEndpoint) {
        const html = captureRef.current.getDoc().documentElement.outerHTML
        imgBase64 = await (
          await fetch(
            `${activeLayout.renderEndpoint}?html=${encodeURIComponent(html)}`,
          )
        ).text()
      } else {
        imgBase64 = await toPng(captureRef.current.getMountTarget(), {
          quality: 1,
          pixelRatio: 1,
        })
      }
      setStatus('success')
      if (props.onSelect) {
        props.onSelect([
          {
            kind: 'base64',
            value: imgBase64,
            assetDocumentProps: {
              originalFilename: `OG Image - ${
                activeLayout.title || activeLayout.name
              } - ${new Date(Date.now()).toISOString()}`,
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

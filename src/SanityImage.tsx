import * as React from 'react'
import imageUrlBuilder from '@sanity/image-url'
import { useDataset, useProjectId } from 'sanity'
import { SanityImageObject } from '@sanity/image-url/lib/types/types'

export const SanityImage = (props: { image?: SanityImageObject; width?: number }) => {
  const projectId = useProjectId()
  const dataset = useDataset()

  const builder = imageUrlBuilder({ projectId, dataset })

  if (!props.image?.asset?._ref) {
    return null
  }
  const src = builder
    .image(props.image)
    .width(props.width || 500)
    // html-to-image limitation: it can't render SVG images (unsure about other formats)
    .format('png')
    .url()

  if (!src) {
    return null
  }

  return <img src={src} alt="" />
}

import { SanityImage } from './types'
import * as React from 'react'
import imageUrlBuilder from '@sanity/image-url'
import { useDataset, useProjectId } from 'sanity'

interface Props {
  image?: SanityImage
  width?: number
}

const Image: React.FC<Props> = (props) => {
  const projectId = useProjectId()
  const dataset = useDataset()

  const builder = imageUrlBuilder({ projectId, dataset })

  if (!props.image?.asset?._ref) {
    return null
  }
  const src = builder
    .image(props.image)
    .width(props.width || 500)
    .url()

  if (!src) {
    return null
  }

  return <img src={src} alt="" />
}

export default Image

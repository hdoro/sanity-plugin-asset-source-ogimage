import { EditorLayout, MediaLayoutComponent } from '../types'
import React from 'react'
import { SanityImage } from '../SanityImage'
import { SanityImageObject } from '@sanity/image-url/lib/types/types'

interface FormData {
  /**
   * In minutes
   */
  duration: number
  coverTitle: string
  episodeTitle: string
}

interface DocumentData {
  episodeImage: SanityImageObject
  backgroundImage: SanityImageObject
}

const Component: MediaLayoutComponent<FormData, DocumentData> = ({
  formData: { coverTitle, duration, episodeTitle },
  document: { episodeImage, backgroundImage },
}) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'papayawhip',
      border: '2px solid green',
    }}
  >
    <div>
      <SanityImage image={backgroundImage} />
      <h1>{coverTitle || 'Title'}</h1>
      <div>
        <SanityImage image={episodeImage} />
        <div>
          {episodeTitle && <h2>{episodeTitle}</h2>}
          {duration && <p>{duration} minutes</p>}
        </div>
      </div>
      <div>Podcast logo</div>
    </div>
  </div>
)

const podcastInstagram: EditorLayout<FormData, DocumentData> = {
  name: 'podcastInstagram',
  title: 'Instagram podcast',
  component: Component,
  prepareFormData: (document) => {
    return {
      duration: document.duration,
      coverTitle: document.description,
      episodeTitle: document.title,
      episodeImage: document.thumbnail,
      backgroundImage: document.coverArt,
    }
  },
  fields: [
    {
      name: 'duration',
      title: 'Duration in minutes',
      description: 'Make sure this is according to reality',
      type: 'number',
    },
    { name: 'coverTitle', title: 'Cover title', type: 'string' },
    { name: 'episodeTitle', title: 'Episode title', type: 'string' },
    { name: 'episodeImage', title: 'Episode Image', type: 'image' },
    { name: 'backgroundImage', title: 'backgroundImage', type: 'image' },
  ],
  dimensions: {
    width: 1080,
    height: 1080,
  },
}

export default podcastInstagram

import { SanityImageObject } from '@sanity/image-url/lib/types/types'
import React from 'react'
import { SanityImage } from '../SanityImage'

// import css from './TwitterImageLayout.module.css'
import { EditorLayout, MediaLayoutComponent } from '../types'

// As this plugin's repo doesn't have css modules enabled, I'm not actually implementing styles
const css = {} as any

// I uploaded these in my Sanity studio and am using them as static data. I could pull this from the API or something like that, though ;)
const profilePic: SanityImageObject = {
  _type: 'image',
  asset: {
    _type: 'reference',
    _ref: 'image-1a67fe4bb878088e4857467f20fc221fe575e8ee-1059x1060-jpg',
  },
}

const svgPic: SanityImageObject = {
  _type: 'image',
  asset: {
    _type: 'reference',
    _ref: 'image-eea1db83cd7143c4229b5bc7f5c8f8b5ed4341ab-561x423-svg',
  },
}

const Component: MediaLayoutComponent<{ title: string }> = ({ formData: { title } }) => {
  return (
    <div className={css.root}>
      <h1 className={css.title}>{title || 'Title missing'}</h1>
      <div className={css.author}>
        <SanityImage image={profilePic} width={80} />
        Henrique Doro
      </div>
      <div className={css.svg}>
        <SanityImage image={svgPic} width={80} />
      </div>
    </div>
  )
}

const hdoroDevOgImage: EditorLayout<{
  title: string
}> = {
  name: 'hdoroDevOgImage',
  title: 'Hdoro.dev',
  component: Component,
  prepareFormData: (document) => {
    return {
      title: (document.title || document.seoTitle || '') as string,
    }
  },
  fields: [
    {
      title: 'Post title',
      name: 'title',
      type: 'string',
    },
  ],
  dimensions: {
    width: 1200,
    height: 628,
  },
}

export default hdoroDevOgImage

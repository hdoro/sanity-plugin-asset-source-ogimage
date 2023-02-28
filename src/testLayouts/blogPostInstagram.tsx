import { SanityImageObject } from '@sanity/image-url/lib/types/types'
import React from 'react'
import { SanityImage } from '../SanityImage'
import { EditorLayout } from '../types'

const blogPostInstagram: EditorLayout<
  {
    title: string
    subtitle: string
    date: string
    authorName: string
  },
  { authorImage?: SanityImageObject }
> = {
  name: 'blogPostInstagram',
  title: 'Blog post (Instagram)',
  // Start defining the form editors will fill to change the final image
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'subtitle',
      description: '❓ Optional',
      type: 'string',
    },
    {
      name: 'date',
      // ideally, it'd be a date, but that input isn't implemented yet
      type: 'string',
    },
    {
      name: 'authorImage',
      title: "Author's image",
      type: 'image',
    },
    {
      name: 'authorName',
      type: 'string',
    },
  ],
  dimensions: {
    width: 1080,
    height: 1080,
  },
  component: ({ formData: { title, subtitle, date, authorName }, document: { authorImage } }) => (
    <div>
      <h1>{title || 'Please insert a title'}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {date && <div>{date}</div>}
      {authorImage && authorName && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SanityImage image={authorImage} width={100} />
          {authorName}
        </div>
      )}
    </div>
  ),
}

export default blogPostInstagram

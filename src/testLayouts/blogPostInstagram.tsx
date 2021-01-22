import React from 'react'
import Image from '../Image'

const blogPostInstagram = {
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
      unsupportedError:
        'We get this automatically from the chosen author. Close this dialog and change it in the document to reflect it here.',
    },
    {
      name: 'authorName',
      type: 'string',
    },
  ],
  prepare: (document) => {
    return {
      title: document.title,
      subtitle: document.subtitle || document.excerpt,
      date: new Date(
        document._createdAt ? document._createdAt : Date.now(),
      ).toLocaleDateString('en'),
      authorImage: document.author?.image,
      authorName: document.author?.name,
    }
  },
  dimensions: {
    width: 1080,
    height: 1080,
  },
  component: ({ title, subtitle, date, authorImage, authorName }) => (
    <div>
      <h1>{title || 'Please insert a title'}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {date && <div>{date}</div>}
      {authorImage && authorName && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image image={authorImage} width={100} />
          {authorName}
        </div>
      )}
    </div>
  ),
}

export default blogPostInstagram

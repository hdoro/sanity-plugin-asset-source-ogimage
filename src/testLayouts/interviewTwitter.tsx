import { EditorLayout, MediaLayoutComponent } from '../types'
import React from 'react'
import { SanityImage } from '../components/SanityImage'
import { SanityImageObject } from '@sanity/image-url/lib/types/types'

interface FormData {
  title: string
  quote: string
  intervieweeName: string
}

interface DocumentData {
  intervieweePhoto?: SanityImageObject
  author?: {
    name: string
    photo: SanityImageObject
  }
  mainQuote?: string
  title?: string
  seoTitle?: string
}

const Component: MediaLayoutComponent<FormData, DocumentData> = ({
  formData: { title, intervieweeName, quote },
  document: { intervieweePhoto },
}) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#3333ee',
      border: '2px solid green',
      color: '#fff',
    }}
  >
    <div>
      <div>Your company's logo</div>
      <h1>{title || 'Title'}</h1>
      {quote && <blockquote>{quote}</blockquote>}
      {intervieweeName && <p>{intervieweeName}</p>}
      {intervieweePhoto && <SanityImage image={intervieweePhoto} width={300} />}
    </div>
  </div>
)

const interviewTwitter: EditorLayout<FormData, DocumentData> = {
  name: 'interviewTwitter',
  title: 'Interview (Twitter)',
  component: Component,
  prepareFormData: (document) => {
    return {
      title: document.title || document.seoTitle,
      intervieweeName: document.author?.name,
      intervieweePhoto: document.author?.photo,
      quote: document.mainQuote,
    }
  },
  fields: [
    {
      title: 'Post title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Main quote',
      name: 'quote',
      type: 'text',
    },
    {
      title: 'Interviewee name',
      name: 'intervieweeName',
      type: 'string',
    },
    {
      title: 'Interviewee avatar',
      name: 'intervieweePhoto',
      type: 'image',
    },
  ],
  dimensions: {
    width: 1200,
    height: 630,
  },
}

export default interviewTwitter

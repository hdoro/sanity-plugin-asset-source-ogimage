import { EditorLayout, SanityImage } from '@types'
import React from 'react'

interface LayoutProps {
  title: string
  userName: string
  userAvatar: SanityImage
}

const Component: React.FC<LayoutProps> = ({ title, userName }) => (
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
      <div>Indie hackers logo</div>
      <h1>{title || 'Title'}</h1>
      <p>Created by {userName}</p>
    </div>
  </div>
)

const indieHackersPost: EditorLayout<LayoutProps> = {
  name: 'indieHackersPost',
  title: 'Indie hackers post',
  component: Component,
  prepare: (document) => {
    return {
      title: document.title || document.seoTitle,
      userName: document.author?.name,
      userAvatar: document.author?.photo,
    }
  },
  fields: [
    {
      title: 'Post title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'User name',
      name: 'userName',
      type: 'string',
    },
    {
      title: 'User avatar',
      name: 'userAvatar',
      type: 'image',
    },
  ],
  dimensions: {
    width: 1200,
    height: 630,
  },
}

export default indieHackersPost

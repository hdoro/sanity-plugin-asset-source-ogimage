import { SanityImageObject } from '@sanity/image-url/lib/types/types'
import React from 'react'
import styled from 'styled-components'
import { SanityImage } from '../components/SanityImage'
import { EditorLayout, MediaLayoutComponent } from '../types'

interface FormData {
  title: string
  authorName: string
  profilePic: SanityImageObject
  mainImage: SanityImageObject
}

const Root = styled.div`
  /* The beauty of non-responsive layouts: magic pixels all around 😍 */
  position: relative;
  padding: 100px 55px 65px;
  height: 100%;
  box-sizing: border-box;
  background: white;

  /* space-mono-regular - latin */
  @font-face {
    font-family: 'Space Mono';
    font-style: normal;
    font-weight: 400;
    src: local(''), url('/static/fonts/space-mono-v6-latin-regular.woff2') format('woff2'),
      /* Chrome 26+, Opera 23+, Firefox 39+ */ url('/static/fonts/space-mono-v6-latin-regular.woff')
        format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
  }

  .title {
    font-size: 64px;
    font-weight: bold;
    line-height: 1.2;
    color: #1c2e3f;
    max-width: 600px;
    margin: 0 0 230px;
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  }

  .author {
    position: absolute;
    left: 55px;
    bottom: 65px;
    font-size: 36px;
    color: #5f2b92;
    display: flex;
    align-items: center;
    font-family: 'Space Mono', 'Courier New', Courier, monospace;
  }

  .author img {
    border-radius: 50%;
    height: 80px;
    width: 80px;
    object-fit: cover;
    margin-right: 15px;
  }

  .svg {
    position: absolute;
    right: 40px;
    bottom: -25px;
    width: 561px;
  }
`

const Component: MediaLayoutComponent<FormData> = ({
  formData: { title, authorName, profilePic, mainImage },
}) => {
  return (
    <Root>
      <h1 className={'title'}>{title || 'Title missing'}</h1>
      <div className={'author'}>
        <SanityImage image={profilePic} width={80} />
        {authorName}
      </div>
      <div className={'svg'}>
        <SanityImage image={mainImage} width={561} />
      </div>
    </Root>
  )
}

export const HdoroOgImage: EditorLayout<FormData> = {
  name: 'hdoroDevOgImage',
  title: 'Hdoro.dev',
  component: Component,
  prepareFormData: (document) => {
    return {
      title: (document.title || document.seoTitle || '') as string,
      authorName: 'Henrique Doro',

      // I uploaded these in my Sanity studio and am using them as starting data
      profilePic: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-1a67fe4bb878088e4857467f20fc221fe575e8ee-1059x1060-jpg',
        },
      },
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-eea1db83cd7143c4229b5bc7f5c8f8b5ed4341ab-561x423-svg',
        },
      },
    }
  },
  fields: [
    {
      title: 'Post title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Author name',
      name: 'authorName',
      type: 'string',
    },
    {
      title: 'Profile picture',
      name: 'profilePic',
      type: 'image',
    },
    {
      title: 'Featured image',
      name: 'mainImage',
      type: 'image',
    },
  ],
  dimensions: {
    width: 1200,
    height: 628,
  },
}

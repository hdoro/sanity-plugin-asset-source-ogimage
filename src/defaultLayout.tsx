import { Card, Container, Text } from '@sanity/ui'
import { EditorLayout, PrepareFunction, SanityImage } from '@types'
import * as React from 'react'
import Image from './Image'

interface DefaultLayoutProps {
  title?: string
  logo?: SanityImage
}

export const DefaultComponent: React.FC<DefaultLayoutProps> = ({
  title = 'Title missing',
  logo,
}) => {
  return (
    <Card
      scheme="light"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        border: '5px solid red',
        boxSizing: 'border-box',
      }}
      padding={3}
    >
      <Container>
        <Text size={3}>{title}</Text>
        <Image image={logo} width={500} />
      </Container>
    </Card>
  )
}

// Ideally, users will provide their own prepare function, this is an unlikely fallback
export const defaultPrepare: PrepareFunction<DefaultLayoutProps> = (
  document,
) => {
  return {
    // Possible common values for title & image
    title:
      document.title ||
      document.seoTitle | document.seo?.title ||
      document.hero?.title,
    logo:
      document.ogImage ||
      document.image ||
      document.hero?.image ||
      document.logo,
  }
}

const defaultLayout: EditorLayout = {
  component: DefaultComponent,
  prepare: defaultPrepare,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Logo / image',
      name: 'logo',
      type: 'image',
    },
  ],
}

export default defaultLayout

import { Card, Container, Stack } from '@sanity/ui'
import { EditorLayout, PrepareFunction, SanityImage } from '@types'
import * as React from 'react'
import styled from 'styled-components'

import Image from './Image'

interface DefaultLayoutProps {
  title?: string
  logo?: SanityImage
  subtitle?: string
  includeBorder: boolean
}

const Title = styled.h1`
  font-size: 58px;
  font-weight: 600;
  margin: 0;
`

const SubTitle = styled.h2`
  font-size: 30px;
  font-weight: 400;
  margin: 0;
`

const LogoWrapper = styled.div`
  position: absolute;
  right: 1em;
  bottom: 1em;
`

export const DefaultLayoutComponent: React.FC<DefaultLayoutProps> = ({
  title,
  logo,
  subtitle,
  includeBorder,
}) => {
  return (
    <Card
      scheme="light"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: includeBorder ? '5px solid var(--card-border-color)' : 'none',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
      }}
      padding={3}
    >
      <Container>
        <Stack space={3}>
          {title && <Title>{title}</Title>}
          {subtitle && <SubTitle>{subtitle}</SubTitle>}
          <LogoWrapper>
            <Image image={logo} width={100} />
          </LogoWrapper>
        </Stack>
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
    includeBorder: false,
  }
}

const defaultLayout: EditorLayout<DefaultLayoutProps> = {
  name: 'default',
  title: 'Default layout',
  component: DefaultLayoutComponent,
  prepare: defaultPrepare,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Subtitle',
      name: 'subtitle',
      type: 'text',
    },
    {
      title: 'Logo / image',
      name: 'logo',
      type: 'image',
    },
    {
      title: 'Include borders',
      name: 'includeBorder',
      type: 'boolean',
    },
  ],
}

export default defaultLayout

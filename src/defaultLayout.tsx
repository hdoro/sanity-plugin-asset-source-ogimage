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
    <div>
      {title}
      <Image image={logo} width={500} />
    </div>
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
}

export default defaultLayout

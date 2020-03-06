import React from 'react'
import OgImageEditor from './OgImageEditor'
import { starIcon } from './icons'
import { EditorFooter, EditorLogo } from './DefaultComponents'

export const DEFAULT_PROPS = {
  footer: EditorFooter,
  select: {
    title: 'meta.title',
    description: 'meta.description'
  },
  dialogTitle: 'Create sharing Image',
  logo: EditorLogo
}

export const PLUGIN_META = {
  title: 'Create sharing image',
  name: 'asset-source-ogimage',
  icon: starIcon
}

export const EditorComponent = OgImageEditor

export default {
  ...PLUGIN_META,
  component: sanityProps => (
    <OgImageEditor sanityProps={sanityProps} {...DEFAULT_PROPS} />
  )
}

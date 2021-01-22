import { ImageIcon } from '@sanity/icons'

import MediaEditor from './app'
// import TestInstance from './testLayouts/TestInstance'

export default {
  name: 'asset-source-ogimage',
  title: 'Generate image',
  component: MediaEditor,
  // component: TestInstance,
  icon: ImageIcon,
}

import Image from './Image'
import defaultLayout, { DefaultLayoutComponent } from './defaultLayout'

export { Image, MediaEditor, defaultLayout, DefaultLayoutComponent }

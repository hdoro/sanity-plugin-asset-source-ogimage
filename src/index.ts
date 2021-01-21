import React from 'react'
import { ImageIcon } from '@sanity/icons'

import ImageEditor from './app'
import TestInstance from './testLayouts/TestInstance'

export default {
  name: 'asset-source-ogimage',
  title: 'Generate image',
  component: TestInstance,
  icon: ImageIcon,
}

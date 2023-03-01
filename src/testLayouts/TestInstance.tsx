import React from 'react'

import { EditorInDialog } from '../EditorInDialog'
import blogPostInstagram from './blogPostInstagram'
import { HdoroOgImage } from './hdoroDevOgImage'
import interviewTwitter from './interviewTwitter'
import podcastInstagram from './podcastInstagram'

const ComponentName = (props: any) => {
  return (
    <EditorInDialog
      {...props}
      layouts={[podcastInstagram, interviewTwitter, HdoroOgImage, blogPostInstagram]}
    />
  )
}

export default ComponentName

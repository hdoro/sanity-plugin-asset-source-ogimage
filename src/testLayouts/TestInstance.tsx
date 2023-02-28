import React from 'react'

import { EditorInDialog } from '../EditorInDialog'
import blogPostInstagram from './blogPostInstagram'
import hdoroDevOgImage from './hdoroDevOgImage'
import interviewTwitter from './interviewTwitter'
import podcastInstagram from './podcastInstagram'

const ComponentName = (props: any) => {
  return (
    <EditorInDialog
      {...props}
      layouts={[podcastInstagram, interviewTwitter, hdoroDevOgImage, blogPostInstagram]}
    />
  )
}

export default ComponentName

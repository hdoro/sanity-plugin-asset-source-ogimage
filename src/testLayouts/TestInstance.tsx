import React from 'react'

import { FormPortal } from '../components/FormPortal'
import blogPostInstagram from './blogPostInstagram'
import { HdoroOgImage } from './hdoroDevOgImage'
import interviewTwitter from './interviewTwitter'
import podcastInstagram from './podcastInstagram'

const ComponentName = (props: any) => {
  return (
    <FormPortal
      {...props}
      layouts={[podcastInstagram, interviewTwitter, HdoroOgImage, blogPostInstagram]}
    />
  )
}

export default ComponentName

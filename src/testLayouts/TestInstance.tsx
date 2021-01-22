import React from 'react'

import MediaEditor from '../app'
import blogPostInstagram from './blogPostInstagram'
import hdoroDevOgImage from './hdoroDevOgImage'
import interviewTwitter from './interviewTwitter'
import podcastInstagram from './podcastInstagram'

const ComponentName: React.FC<any> = (props) => {
  return (
    <MediaEditor
      {...props}
      layouts={[
        podcastInstagram,
        interviewTwitter,
        hdoroDevOgImage,
        blogPostInstagram,
      ]}
    />
  )
}

export default ComponentName

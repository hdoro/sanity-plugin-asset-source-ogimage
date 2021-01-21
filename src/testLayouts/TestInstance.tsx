import React from 'react'

import MediaEditor from '../app'
import indieHackersPost from './IndieHackersPost'
import podcastInstagramPicture from './podcastInstagramPicture'

const ComponentName: React.FC<any> = (props) => {
  return (
    <MediaEditor
      {...props}
      layouts={[podcastInstagramPicture, indieHackersPost]}
    />
  )
}

export default ComponentName

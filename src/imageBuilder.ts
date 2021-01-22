import client from 'part:@sanity/base/client'
import imageUrlBuilder from '@sanity/image-url'

const imageBuilder = imageUrlBuilder(client)

export default imageBuilder

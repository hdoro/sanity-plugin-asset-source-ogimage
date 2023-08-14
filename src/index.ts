import { ImageIcon } from '@sanity/icons'
import { AssetSource, definePlugin } from 'sanity'
import { BuildEditorAssetSource } from './BuildEditorAssetSource'
import { EditorConfiguration } from './types'

const plugin = {
  title: 'Generate OG Image',
  name: 'opengraph',
  icon: ImageIcon,
}

export const mediaAssetSource = (options: EditorConfiguration): AssetSource => ({
  ...plugin,
  component: BuildEditorAssetSource(options),
})

export const opengraph = definePlugin<EditorConfiguration>((options) => ({
  name: plugin.name,
  form: {
    image: {
      assetSources: (prev) => {
        return [...prev, mediaAssetSource({ ...options, context: 'asset-source' })]
      },
    },
  },
}))

export * from './BuildEditorAssetSource'
export * from './components/FormPortal'
export * from './components/SanityImage'
export * from './types'

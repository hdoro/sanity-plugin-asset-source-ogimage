import { AssetSource, SanityDocument, useFormValue } from 'sanity'
import { FormPortal } from './components/FormPortal'
import { EditorConfiguration } from './types'

export function BuildEditorAssetSource(config: EditorConfiguration): AssetSource['component'] {
  return function EditorAssetSource(props) {
    const document = (useFormValue([]) as SanityDocument) || {
      _id: 'loading_doc',
      _type: 'loading_type',
      _createdAt: 'loading_createdAt',
      _updatedAt: 'loading_updatedAt',
      _rev: 'loading_rev',
    }

    if (!config.layouts?.some((layout) => typeof layout.component === 'function')) {
      throw new Error('[media-editor] No valid layouts configured')
    }

    if (props.assetType !== 'image') {
      throw new Error('[media-editor] This asset source only supports images')
    }

    if (props.selectionType !== 'single') {
      throw new Error('[media-editor] This asset source only supports single selection')
    }

    return <FormPortal {...props} {...config} document={document} />
  }
}

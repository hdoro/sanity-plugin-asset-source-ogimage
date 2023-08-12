import { Doc, Mut, Mutation } from '@sanity/mutator'
import download from 'downloadjs'
import { toPng } from 'html-to-image'
import React, { useCallback, useMemo } from 'react'
import {
  createPatchChannel,
  createSchema,
  defineType,
  FormBuilderProps,
  ImageAsset,
  ObjectSchemaType,
  PatchEvent,
  SchemaTypeDefinition,
  toMutationPatches,
  useFormState,
  useSchema,
} from 'sanity'
import { EditorLayout, EditorProps } from '../types'

type GenericLayoutData = Record<string, any>

function useEditorLogic(props: EditorProps): {
  activeLayout: EditorLayout
  setActiveLayout: (newLayout: EditorLayout) => void
  disabled: boolean
  generateImage: (e: React.FormEvent) => void
  captureRef: React.RefObject<HTMLDivElement>
  formData: GenericLayoutData
  formBuilderProps: FormBuilderProps | false
} {
  const captureRef = React.useRef<HTMLDivElement>(null)
  const schema = useSchema()

  const [status, setStatus] = React.useState<'idle' | 'error' | 'loading' | 'success'>('idle')
  const disabled = status === 'loading'

  const validLayouts = props.layouts?.filter((layout) => layout.component) || []
  const [activeLayout, setActiveLayout] = React.useState<EditorLayout>(validLayouts[0])

  const [formData, setFormData] = React.useState<GenericLayoutData>(
    // Only asset sources (which include onSelect) should use the prepare function
    activeLayout.prepareFormData && props.onSelect
      ? activeLayout.prepareFormData(props.document)
      : // Studio tools should start with empty data
        {},
  )

  React.useEffect(() => {
    if (!activeLayout?.prepareFormData) return

    setFormData(activeLayout.prepareFormData(props.document))
  }, [activeLayout, setFormData, props.document])

  const schemaType = createSchema({
    name: 'default',
    types: [
      // Make sure to include users' custom types in case they're referencing any
      ...((schema._original?.types as SchemaTypeDefinition[]) || []).filter(
        // Exclude native Sanity types
        (s) => !s.name.startsWith('sanity.') && !['slug', 'geopoint'].includes(s.name),
      ),

      defineType({
        name: 'media-editor.internal',
        type: 'object',
        fields: activeLayout.fields || [{ name: 'title', type: 'string' }],
      }),
    ],
  }).get('media-editor.internal') as ObjectSchemaType

  const formBuilderOnChange = useCallback(
    (changeEvent: PatchEvent) => {
      const transitiveId = 'fake-id'
      const mutation = new Mutation({
        mutations: toMutationPatches(changeEvent.patches).map(
          (m) =>
            ({
              patch: { id: transitiveId, ...m },
            } as Mut),
        ),
      })
      const newData = mutation.apply({
        ...formData,
        _id: transitiveId,
      } as Doc)

      if (!newData) return

      // console.log({ formData, changeEvent, mutation, newData })
      delete (newData as Partial<Doc>)._id

      setFormData(newData)
    },
    [formData, setFormData],
  )

  const formState = useFormState(schemaType, {
    value: formData,
    presence: [],
    validation: [],
    focusPath: [],
    openPath: [],
    comparisonValue: formData,
  })

  const patchChannel = useMemo(() => createPatchChannel(), [])

  const formBuilderProps: FormBuilderProps | false = !!formState &&
    !!activeLayout?.fields?.length && {
      ...formState,
      focused: true,
      changed: false,
      validation: [],
      // eslint-disable-next-line
      __internal_patchChannel: patchChannel,
      collapsedFieldSets: undefined,
      collapsedPaths: undefined,
      onChange: formBuilderOnChange,
      onFieldGroupSelect: noop,
      onPathBlur: noop,
      onPathFocus: noop,
      onPathOpen: noop,
      onSetFieldSetCollapsed: noop,
      onSetPathCollapsed: noop,
    }

  async function generateImage(e: React.FormEvent) {
    e.preventDefault()
    if (!captureRef?.current) {
      return
    }
    try {
      setStatus('loading')
      const imgBase64 = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 1,
        includeQueryParams: true,
      })
      setStatus('success')
      if (props.onSelect) {
        props.onSelect([
          {
            kind: 'base64',
            value: imgBase64,
            assetDocumentProps: {
              originalFilename: `OG Image - ${activeLayout.title || activeLayout.name} - ${new Date(
                Date.now(),
              ).toISOString()}`,
              source: {
                name: 'asset-source-ogimage',
                id: 'asset-source-ogimage',
              },
            } as Partial<ImageAsset> as any,
          },
        ])
      } else {
        download(imgBase64, 'generated.png')
      }
    } catch (error) {
      setStatus('error')
      console.error(error)
    }
  }

  return {
    activeLayout,
    setActiveLayout,
    disabled,
    generateImage,
    captureRef,
    formData,
    formBuilderProps,
  }
}

export default useEditorLogic

function noop() {
  // noop
}

import { CloseIcon, GenerateIcon } from '@sanity/icons'
import { Button, Card, Flex, Inline, Spinner, Stack, Text } from '@sanity/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  createPatchChannel,
  FormBuilder,
  PatchEvent,
  SanityDocument,
  useDocumentPresence,
  useFormState,
  useFormValue,
} from 'sanity'
import { EditorProps } from '../types'
import useEditorLogic from '../useEditorLogic'
import LayoutsPicker from './LayoutsPicker'

const DEFAULT_DIMENSIONS = {
  width: 1200,
  height: 630,
}

const Editor = (props: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState(containerRef?.current?.getBoundingClientRect())
  const {
    activeLayout,
    setActiveLayout,
    generateImage,
    disabled,
    captureRef,
    formData,
    setFormData,
  } = useEditorLogic(props)
  const fields = activeLayout.fields || []
  const document = useFormValue([]) as SanityDocument
  const schemaType: Parameters<typeof useFormState>[0] = {
    fields: fields as any,
    name: `object`,
    jsonType: 'object',
    // eslint-disable-next-line
    __experimental_search: [],
  }
  const [value, setValue] = useState()

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerRect(entry.target?.getBoundingClientRect())
      }
    })
    if (containerRef?.current) observer.observe(containerRef?.current)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  const onChange = useCallback((changeEvent: PatchEvent) => {
    console.log(changeEvent)
  }, [])
  // const state = useFormState(schemaType, {

  // })
  // state.
  // const formBuilderContext = useFormBuilder()
  // formBuilderContext.

  // const {
  //   // validation,
  //   formState,
  //   // collapsedFieldSets,
  //   // collapsedPaths,
  //   // onChange,
  //   // editState,
  //   // documentId,
  //   // documentType,
  //   // ready,
  //   // onFocus,
  //   // onBlur,
  //   // onSetCollapsedPath,
  //   // onPathOpen,
  //   // onSetCollapsedFieldSet,
  //   // onSetActiveFieldGroup,
  // } = useDocumentPane()
  const presence = useDocumentPresence(document?._id || '')
  const patchChannel = useMemo(() => createPatchChannel(), [])
  const LayoutComponent = activeLayout.component

  const width = activeLayout.dimensions?.width || DEFAULT_DIMENSIONS.width
  const height = activeLayout.dimensions?.height || DEFAULT_DIMENSIONS.height

  return (
    <Card
      scheme="light"
      height="fill"
      sizing="border"
      display="flex"
      style={{ flexDirection: 'column' }}
    >
      <Card
        tone="default"
        padding={4}
        marginBottom={[4, 0]}
        borderBottom
        style={{ textAlign: 'right' }}
      >
        <Flex justify="space-between" align="center">
          <Inline space={3}>
            <Text size={3} weight="semibold">
              {props.dialog?.title || 'Create image'}
            </Text>
            <Button
              icon={disabled ? Spinner : GenerateIcon}
              tone="positive"
              text={props.dialog?.finishCta || 'Generate'}
              onClick={generateImage}
              disabled={disabled}
            />
          </Inline>
          {/* If onClose is defined, we're in an assetSource, where we should provide a header with a close button */}
          {props.onClose && (
            <Button
              onClick={props.onClose}
              icon={CloseIcon}
              mode="bleed"
              tone="critical"
              title={props.dialog?.ariaClose || 'close'}
            />
          )}
        </Flex>
      </Card>
      <Flex
        justify="flex-start"
        align="flex-start"
        height="fill"
        width="100%"
        sizing="border"
        padding={3}
      >
        <Card
          padding={3}
          marginRight={4}
          style={{ maxWidth: '350px', flex: '1 0 200px' }}
          sizing="border"
          overflow="auto"
        >
          <Stack space={4}>
            <p>Form!</p>
            <FormBuilder
              __internal_patchChannel={patchChannel}
              collapsedFieldSets={undefined}
              collapsedPaths={undefined}
              focusPath={[]}
              changed
              focused
              id="media-editor"
              presence={presence}
              schemaType={schemaType}
              onChange={onChange}
              value={value}
              onFieldGroupSelect={console.info}
              onPathBlur={console.info}
              onPathFocus={console.info}
              onPathOpen={console.info}
              onSetFieldSetCollapsed={console.info}
              onSetPathCollapsed={console.info}
              groups={[]}
              members={[]}
              validation={[]}
              // focusPath={formState.focusPath}
              // groups={formState.groups}
              // members={formState.members}
              // collapsedFieldSets={collapsedFieldSets}
              // collapsedPaths={collapsedPaths}
              // onChange={onChange}
              // onFieldGroupSelect={onSetActiveFieldGroup}
              // onPathBlur={onBlur}
              // onPathFocus={onFocus}
              // onPathOpen={onPathOpen}
              // onSetFieldSetCollapsed={onSetCollapsedFieldSet}
              // onSetPathCollapsed={onSetCollapsedPath}
              // validation={validation}
              // value={formState.value}
            />
          </Stack>
        </Card>
        <Card
          height="fill"
          overflow="hidden"
          style={{
            padding: '20px 10px',
            maxWidth: `${width + 10 * 2}px`,
          }}
          sizing="border"
        >
          <Flex gap={3} direction="column">
            <LayoutsPicker
              layouts={props.layouts}
              activeLayout={activeLayout}
              disabled={disabled}
              setActiveLayout={setActiveLayout}
            />

            <div style={{ flex: 1, overflow: 'hidden' }} ref={containerRef}>
              <Card
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  transformOrigin: 'top left',
                  transform: getScaleFitTransform(containerRect, width, height),
                }}
                border
                sizing="border"
                overflow="hidden"
              >
                <div
                  ref={captureRef}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    // Hack to display the full border of the parent card
                    transform: 'scale(0.99)',
                  }}
                >
                  {LayoutComponent && <LayoutComponent document={document} formData={formData} />}
                </div>
              </Card>
            </div>
          </Flex>
        </Card>
      </Flex>
    </Card>
  )
}

export default Editor

/**
 * Returns a CSS transform that fits the given width and height into the given container
 */
function getScaleFitTransform(
  containerRect: DOMRect | undefined,
  width: number,
  height: number,
): string | undefined {
  if (!containerRect) return undefined

  const scaleX = containerRect.width / width
  const scaleY = containerRect.height / height
  const scale = Math.min(scaleX, scaleY)

  if (scale > 1) return undefined

  return `scale(${scale})`
}

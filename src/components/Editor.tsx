import { CloseIcon, GenerateIcon } from '@sanity/icons'
import { Button, Card, Flex, Inline, Spinner, Stack, Text } from '@sanity/ui'
import { useCallback, useMemo, useState } from 'react'
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
    name: `media-editor--${activeLayout.name}`,
    jsonType: 'object',
    // eslint-disable-next-line
    __experimental_search: [],
  }
  const [value, setValue] = useState()

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
        wrap="wrap"
        overflow="auto"
        style={{ width: '100%', height: 'auto', minHeight: '0' }}
        sizing="border"
        padding={3}
      >
        <Card
          padding={3}
          marginRight={4}
          style={{ maxWidth: '350px', flex: '1 0 200px' }}
          sizing="border"
        >
          <Stack space={4}>
            {/* <FormBuilder
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
            /> */}
          </Stack>
        </Card>
        <Card
          height="fill"
          overflow="auto"
          style={{
            padding: '20px 10px',
            maxWidth: `${width + 10 * 2}px`,
          }}
          shadow={3}
          sizing="border"
        >
          <Stack space={3}>
            <LayoutsPicker
              layouts={props.layouts}
              activeLayout={activeLayout}
              disabled={disabled}
              setActiveLayout={setActiveLayout}
            />

            <div
              style={{
                width: `${width}px`,
                height: `${height}px`,
                boxSizing: 'border-box',
              }}
              ref={captureRef}
            >
              {LayoutComponent && <LayoutComponent document={document} formData={formData} />}
            </div>
          </Stack>
        </Card>
      </Flex>
    </Card>
  )
}

export default Editor

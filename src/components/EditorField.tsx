import { Box, Stack, Switch, Text, TextArea, TextInput } from '@sanity/ui'
import React from 'react'
import { FieldDefinition, FormField } from 'sanity'

interface EditorFieldProps {
  field: FieldDefinition
  formData: Record<string, any>
  updateFormData: (data: Record<string, any>) => void
  disabled: boolean
}

const UNSUPORTED_TYPES: FieldDefinition['type'][] = [
  'array',
  'date',
  'datetime',
  'image',
  'reference',
]

const EditorField: React.FC<EditorFieldProps> = ({
  field,
  formData = {},
  updateFormData,
  disabled,
}) => {
  if (!field?.type || !field.name || !updateFormData) {
    return null
  }
  const label = field.title || field.name
  const value = formData[field.name] || undefined

  if (UNSUPORTED_TYPES.includes(field.type)) {
    return (
      <Box marginTop={2}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            {label}
          </Text>
          <Text size={0}>
            {field.unsupportedError ||
              'Close this dialog and edit the document to change this field.'}
          </Text>
        </Stack>
      </Box>
    )
  }

  if (field.type === 'object') {
    if (!('fields' in field) || !field.fields?.length) {
      return null
    }
    // @TODO: fieldset
    return (
      <div>
        {field.fields.map((fld) => (
          <EditorField
            key={fld.name}
            updateFormData={(newData) =>
              updateFormData({
                ...formData,
                [field.name]: newData,
              })
            }
            field={fld}
            formData={value}
            disabled={disabled}
          />
        ))}
      </div>
    )
  }

  if (!['boolean', 'number', 'text', 'string'].includes(field.type)) {
    console.error('Asset-source OG Image: wrong field type received')
    return null
  }

  function onChange(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let newValue: string | boolean | number = e.currentTarget.value || ''
    if (e.currentTarget.type === 'checkbox' && 'checked' in e.currentTarget) {
      newValue = e.currentTarget.checked
    }
    if (e.currentTarget.type === 'number') {
      newValue = Number(newValue)
    }
    e.preventDefault()
    updateFormData({
      ...formData,
      [field.name]: newValue,
    })
  }

  const commonProps = {
    onChange,
    value,
    disabled,
  }

  return (
    <FormField label={label} description={field.description}>
      {field.type === 'boolean' && <Switch checked={value === true} onChange={onChange} />}
      {field.type === 'text' && <TextArea {...commonProps} rows={1} />}
      {(field.type === 'string' || field.type === 'number') && (
        <TextInput type={field.type === 'number' ? 'number' : 'text'} {...commonProps} />
      )}
    </FormField>
  )
}

export default EditorField

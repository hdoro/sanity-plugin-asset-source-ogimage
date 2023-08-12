// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Card, Stack, Layer } from '@sanity/ui'
import { FormBuilder, FormBuilderProps } from 'sanity'

const FormControls = (props: FormBuilderProps) => (
  <Card
    paddingLeft={2}
    paddingTop={2}
    paddingRight={4}
    paddingBottom={4}
    marginRight={3}
    style={{ maxWidth: '370px', flex: '1 0 200px' }}
    sizing="border"
    overflow="auto"
    height="fill"
  >
    <Stack space={4}>
      <Layer zOffset={10000}>
        <FormBuilder {...props} />
      </Layer>
    </Stack>
  </Card>
)

export default FormControls

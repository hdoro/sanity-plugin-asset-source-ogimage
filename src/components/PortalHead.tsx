import { CloseIcon, GenerateIcon, Icon } from '@sanity/icons'
import { Box, Button, Flex, Inline, Spinner, Text } from '@sanity/ui'
import React from 'react'
import { SanityDocument } from 'sanity'
import { DialogLabels } from '../types'

type PortalHeadProps = {
  document: SanityDocument
  disabled: boolean
  dialog?: DialogLabels | undefined
  onClose?: () => void
  generateImage: (e: React.FormEvent<Element>) => void
}

const PortalHead = (props: PortalHeadProps) => {
  const { document, dialog, disabled, onClose, generateImage } = props

  // Row: Current document / generate button / close button
  return (
    <Box
      padding={2}
      style={{
        borderBottom: '1px solid var(--card-border-color)',
      }}
    >
      <Flex align="center" justify="space-between">
        {/* Label */}
        <Box flex={1} marginX={3}>
          <Inline style={{ whiteSpace: 'nowrap' }}>
            <Text textOverflow="ellipsis" weight="semibold">
              <span>{dialog?.title || 'Create Open Graph Image'}</span>
            </Text>

            {document && (
              <Box display={['none', 'none', 'block']}>
                <Text>
                  <span style={{ margin: '0 0.5em' }}>
                    <Icon symbol="arrow-right" />
                  </span>
                  <span style={{ textTransform: 'capitalize' }}>{document._type}</span>
                </Text>
              </Box>
            )}
          </Inline>
        </Box>

        <Flex marginX={2}>
          {/* Generate */}
          <Button
            fontSize={1}
            icon={disabled ? Spinner : GenerateIcon}
            tone="positive"
            text={dialog?.finishCta || 'Generate'}
            onClick={generateImage}
            disabled={disabled}
          />

          {/* Close */}
          {onClose && (
            <Box style={{ flexShrink: 0 }}>
              <Button
                disabled={!onClose}
                icon={CloseIcon}
                mode="bleed"
                onClick={onClose}
                radius={2}
                title={dialog?.ariaClose || 'close'}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default PortalHead

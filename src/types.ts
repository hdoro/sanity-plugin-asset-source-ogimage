import React from 'react'
import { AssetSourceComponentProps, FieldDefinition, SanityDocument } from 'sanity'

export interface DialogLabels {
  /**
   * Title above the dialog.
   */
  title?: string
  /**
   * Text of the generation button.
   */
  finishCta?: string
  /**
   * The a11y title for the close button in the dialog.
   */
  ariaClose?: string
}

export type MediaLayoutComponent<FormData = {}, DocumentData = {}> = React.ComponentType<{
  formData: Partial<FormData>
  document: DocumentData & SanityDocument
}>

export type PrepareFunction<FormData = {}, DocumentData = {}> = (
  document: DocumentData & SanityDocument,
) => Partial<FormData>

export type EditorLayout<FormData = {}, DocumentData = {}> = {
  /**
   * Needs to be unique to identify this layout among others.
   */
  name: string

  /**
   * Visible label to users. Only shows when we have 2 or more layouts.
   */
  title?: string

  /**
   * React component which renders the layout.
   */
  component?: MediaLayoutComponent<FormData, DocumentData>

  /**
   * Fields editable by users to change the component data and see changes in the layout live.
   */
  fields?: FieldDefinition[]

  /**
   * Function which gets the current document.
   * Is irrelevant in the context of studio tools as the layout won't receive a document, so if you're only using it there you can ignore this.
   */
  prepareFormData?: PrepareFunction<FormData, DocumentData>

  /**
   * Common examples include:
   * 1200x630 - Twitter, LinkedIn & Facebook
   * 256x256 - WhatsApp
   * 1080x1080 - Instagram square
   */
  dimensions?: {
    width: number
    height: number
  }
}

export interface EditorConfiguration {
  layouts?: EditorLayout[]
  dialog?: DialogLabels
  context?: 'tool' | 'asset-source'
}

export type EditorProps = {
  // The props below are provided by Sanity
  document: SanityDocument
} & EditorConfiguration &
  Partial<AssetSourceComponentProps>

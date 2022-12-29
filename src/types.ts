import React from 'react'
import { FieldDefinition } from 'sanity'

export interface SanityDocument {
  _id: string
  [key: string]: any
}

export interface SanityImage {
  _type?: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

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

export interface LayoutData {
  [key: string]: any
}

export type PrepareFunction<Data = LayoutData> = (document: SanityDocument) => Data

export type LayoutFieldTypes =
  | 'string'
  | 'text'
  | 'number'
  | 'image'
  | 'object'
  | 'boolean'
  | 'array'
  | 'date'
  | 'datetime'
  | 'reference'

export type EditorLayout<Data = any> = {
  /**
   * Needs to be unique to identify this layout among others.
   */
  name: string
  /**
   * Visible label to users. Only shows when we have 2 or more layouts.
   */
  title?: string
  /**
   * React component which renders
   */
  component?: React.Component<Data> | React.FC<Data>
  /**
   * Function which gets the current document.
   * Is irrelevant in the context of studio tools as the layout won't receive a document, so if you're only using it there you can ignore this.
   */
  prepare?: PrepareFunction<Data>
  /**
   * Fields editable by users to change the component data and see changes in the layout live.
   */
  fields?: FieldDefinition[]
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

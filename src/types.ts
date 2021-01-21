export interface SanityDocument {
  _id: string
  [key: string]: any
}

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface DialogLabels {
  /**
   * Shows above the form
   */
  title?: string
  /**
   * For the image generation button
   */
  finishCta?: string
  /**
   * The a11y title for the close button in the dialog
   */
  ariaClose?: string
}

export interface LayoutData {
  [key: string]: any
}

export type PrepareFunction<Data = LayoutData> = (
  document: SanityDocument,
) => Data

export interface LayoutField {
  /**
   * What will show up to editors for changing the value of the property live.
   */
  title: string
  description?: string
  /**
   * Equivalent to the property name in prepare's resulting LayoutData object.
   */
  name: string
  /**
   * Arrays and images aren't supported (yet?)
   */
  type: 'string' | 'text' | 'number' | 'image' | 'object' | 'boolean' | 'array'
  /**
   * Exclusive to objects
   */
  fields?: LayoutField[]
  /**
   * Helpful error message for editors when they can't edit that given field in the Editor dialog.
   * Exclusive to non-supported types (arrays and images).
   */
  unsupportedError?: string
}

export type EditorLayout<Data = LayoutData> = {
  /**
   * Needs to be unique
   */
  name: string
  title?: string
  component: React.Component<Data> | React.FC<Data>
  prepare: PrepareFunction<Data>
  fields: LayoutField[]
  dimensions?: {
    width: number
    height: number
  }
}

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
  title?: string
  finishCta?: string
}

export interface LayoutData {
  [key: string]: any
}

export type PrepareFunction<Data = LayoutData> = (
  document: SanityDocument,
) => Data

export interface EditorLayout {
  component: React.Component | React.FC
  prepare: PrepareFunction
}

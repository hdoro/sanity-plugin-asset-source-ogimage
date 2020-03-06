import React from 'react'
import Dialog from 'part:@sanity/components/dialogs/fullscreen'

import styles from './ogImageEditorStyles.css'
import { getObjProperty, printImage, getFontSize } from './utils'
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from './DefaultComponents'

export default function OgImageEditor({
  sanityProps,
  footer,
  select,
  dialogTitle,
  logo
}) {
  // We use wrapperRef to generate the screenshot
  const wrapperRef = React.useRef(null)

  // Define the initial values for title and description
  const initialTitle =
    getObjProperty(
      (select.title && select.title.split('.')) || [],
      sanityProps.document
    ) || DEFAULT_TITLE
  const initialDescription =
    getObjProperty(
      (select.description && select.description.split('.')) || [],
      sanityProps.document
    ) || DEFAULT_DESCRIPTION

  // And create their own states
  const [title, setTitle] = React.useState(initialTitle)
  const [description, setDescription] = React.useState(initialDescription)
  const [isSaving, setSaving] = React.useState(false)

  const instantiatedPrint = () => {
    printImage({ onSelect: sanityProps.onSelect, setSaving, wrapperRef })
  }

  const closeDialog = () => {
    if (!isSaving) {
      sanityProps.onClose()
    }
  }
  return (
    <Dialog title={dialogTitle} onClose={closeDialog} isOpen>
      <div className={styles.wrapper}>
        <main ref={wrapperRef} className={styles.main}>
          <div className={styles.container}>
            <div>
              <div
                className={styles.textareaWrapper}
                style={{
                  fontSize: `${getFontSize({
                    str: title,
                    min: 4,
                    baseline: 6
                  })}em`
                }}
              >
                <textarea
                  disabled={isSaving}
                  className={styles.title}
                  placeholder="Page title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <div
                  className={styles.title + ' ' + styles.hiddenSpacer}
                  aria-hidden={true}
                >
                  {title}
                </div>
              </div>
              <div
                className={styles.textareaWrapper}
                style={{
                  fontSize: `${getFontSize({
                    str: description,
                    min: 2.5,
                    reductionRate: -1 / 70
                  })}em`
                }}
              >
                <textarea
                  disabled={isSaving}
                  className={styles.description}
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div
                  className={styles.description + ' ' + styles.hiddenSpacer}
                  aria-hidden={true}
                >
                  {description}
                </div>
              </div>
            </div>
          </div>

          {logo()}
        </main>
        {footer({
          isSaving,
          printImage: instantiatedPrint
        })}
      </div>
    </Dialog>
  )
}

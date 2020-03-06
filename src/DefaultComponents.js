import React from 'react'
import Button from 'part:@sanity/components/buttons/default'
import Logo from 'part:@sanity/base/brand-logo'

import { saveIcon } from './icons'

import styles from './ogImageEditorStyles.css'

export const EditorFooter = ({ isSaving = false, printImage }) => (
  <>
    <p className={styles.tip}>
      💡 <strong>tip:</strong> click on the title and/or description to edit
      them.
    </p>
    <p style={{ textAlign: 'center' }}>
      <Button
        color="success"
        onClick={printImage}
        icon={saveIcon}
        title="Create and save"
        disabled={isSaving}
        loading={isSaving}
      >
        Create and save
      </Button>
    </p>
  </>
)

export const EditorLogo = () => (
  <div className={styles.logo}>
    <Logo />
  </div>
)

export const DEFAULT_TITLE = 'Title'
export const DEFAULT_DESCRIPTION = 'Description'

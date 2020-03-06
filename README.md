# Sanity Asset Source Plugin: og:image generation

Allow editors to easily create sharing images customized to their branding and show a preview of how the content will look on social media.

## Installing

If you want to install it globally, go ahead and in your studio folder run:

`sanity install asset-source-ogimage`

This, however, installs the asset source for _every_ image field you have in your studio, which is probably not ideal.

If you want to add it to a specific field, follow the example:

```
# Install the package in your project, but don't activate it in Sanity
npm install sanity-plugin-asset-source-ogimage
```

```js
// Import the default image upload component
import DefaultSource from 'part:@sanity/form-builder/input/image/asset-source-default';

// And the default export from this plugin
import OgImageGenerator from 'sanity-plugin-asset-source-ogimage';

// then in the schema
{
  name: 'ogImage',
  title: 'Social sharing image',
  type: 'image',
  options: {
    sources: [DefaultSource, OgImageGenerator],
  },
}
// ...
// Alternatively, you could transform `ogImage in its own
// reusable schema `object` if it's being used in many places.
```

This is going to get you a barebones starter, which you can customize by following the guide below.

## Customizing

We highly encourage you to customize the image editor to fit your needs and brand. To do so, instead of importing the default export like shown above, you can import the parts you want and overwrite them:

```js
import DefaultSource from 'part:@sanity/form-builder/input/image/asset-source-default';
import {
  EditorComponent, // the actual React component
  PLUGIN_META, // some basic info to make the plugin work
  DEFAULT_PROPS // documented below
} from 'sanity-plugin-asset-source-ogimage';

// And don't forget import React for customizing the component
import React from 'react'

// then in the schema
{
  name: 'ogImage',
  title: 'Social sharing image',
  type: 'image',
  options: {
    sources: [DefaultSource, {
      ...PLUGIN_META,
      // customize the title, name and icon as you see fit
      title: 'New sharing image',
      // and overwrite the component
      component: sanityProps => (
        <EditorComponent sanityProps={sanityProps} {...DEFAULT_PROPS} dialogTitle="New sharing image" />
      )
    }],
  },
}
// ...

/*

DEFAULT_PROPS shape:
- footer: React component
  * The default includes the "Create and save" button
- dialogTitle: string
  * The title that shows in the image creation dialog
- logo: React component
  * Used to brand your OG image
  * Defaults to the current studio's logo
- select:
  - title: string (ex: meta.title)
    * the key of the field to use as the initial title
    * references the current page's schema
  - description: string
    * the key of the field to use as the initial description
    * references the current page's schema
*/
```

I haven't had the time and energy to break the image template component into several chunks or to create idiomatic CSS classes to allow for powerful layout customization, but feel free to look into the source code and do so. Oh, and PRs are always welcome!

## Ideas and possible future features

- Multiple possible layouts for editors to choose from
- Find a way to deal with custom fonts.
  - Right now, the saving process will take several seconds if using a web font that isn't saved locally.
  - This is triggered by `html-to-image` running 800+ requests to download the font, which slows down the whole window and makes waiting for it quite painful

## Inspiration

Refer to the [Design Inspirations doc](https://github.com/kaordica/sanity-plugin-asset-source-ogimage/blob/master/DESIGN_INSPIRATION.md) for cool OG image designs that might spark some ideas 😉

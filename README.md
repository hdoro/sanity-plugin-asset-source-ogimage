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

- Whatever data you want
- Array of layouts
- Each layout is an object with:
  - a react component for displaying the final thing
  - a prepare function which returns data to be used by the component
- Prepare function gets the current document and returns an object with data for the layout
- We'll provide a very simple default layout which receives a logo and title prop
- From data types, we'll provide a simple UI for editors to overwrite the data coming from the document
  - As a starter, I'd probably go with just booleans, text and number. Later we can expand that.
  - If a format isn't supported, such as an object or image, then we'd point editors to the document ("Close this dialog to edit this")
- bonus: upon uploading, create a `media.tag` document with `name = "og image"` and add it to the uploaded asset to group it in the upcoming media plugin v2

## Ideas and possible future features

- Multiple possible layouts for editors to choose from
- Find a way to deal with custom fonts.
  - Right now, the saving process will take several seconds if using a web font that isn't saved locally.
  - This is triggered by `html-to-image` running 800+ requests to download the font, which slows down the whole window and makes waiting for it quite painful

## Inspiration

Refer to the [Design Inspirations doc](https://github.com/kaordica/sanity-plugin-asset-source-ogimage/blob/master/DESIGN_INSPIRATION.md) for cool OG image designs that might spark some ideas 😉

# Sanity Asset Source Plugin: og:image generation

Allow editors to easily create sharing images customized to their branding and show a preview of how the content will look on social media.

![GIF showing this plugin in action](/images/demonstration-gif.gif)

You can follow a [video tutorial](https://www.youtube.com/watch?v=w68Cx35VcVY) or read through the installing section below:

[![Screenshot of the video](https://i.ytimg.com/vi/w68Cx35VcVY/maxresdefault.jpg)](https://www.youtube.com/watch?v=w68Cx35VcVY)

## Installing

This plugin is not installable via `sanity install` because it requires extra configuration to work. Start by installing it through npm / yarn:

```bash
# Install the package in your project, but don't activate it in Sanity
npm install sanity-plugin-asset-source-ogimage
yarn install sanity-plugin-asset-source-ogimage
```

🚨 You need `@sanity/core` 2.2.0 or greater.

### Adding it to image fields

```js
// Import the default image upload component or whatever other asset source you want to provide
import DefaultSource from 'part:@sanity/form-builder/input/image/asset-source-default';

// And the default export from this plugin
import OgImageGenerator from 'sanity-plugin-asset-source-ogimage';

// then in the schema, add options.sources to your image field
{
  name: 'ogImage',
  title: 'Social sharing image',
  type: 'image',
  options: {
    sources: [DefaultSource, OgImageGenerator],
  },
}
// ...
// Alternatively, you could transform ogImage in its own
// reusable schema if it's being used in many places.
```

👉 You'll definitely want to customize this plugin with your own image layouts. Refer to the [customizing section](#customizing) for that.

You can also add it to all image fields by implementing `part:@sanity/form-builder/input/image/asset-sources` in your `sanity.json`:

```json
// sanity.json
"parts": [
  //...
  {
    "implements": "part:@sanity/form-builder/input/image/asset-sources",
    "path": "./parts/assetSources.js"
  }
]
```

```js
// /parts/assetSources.js
// Import the default image upload component or whatever other asset source you want to provide
import DefaultSource from 'part:@sanity/form-builder/input/image/asset-source-default'

// And the default export from this plugin
import OgImageGenerator from 'sanity-plugin-asset-source-ogimage'

export default [DefaultSource, OgImageGenerator]
```

🚨 Be careful when using this method, as it'll add this asset source to _all image fields_, which is probably not what you want.

### Adding it as a studio tool

If you want it to be accessible at all times to editors, then you can add it as a studio tool to be linked from the Sanity top navbar:

```json
// sanity.json
"parts": [
  //...
  {
    "implements": "part:@sanity/base/tool",
    "path": "parts/sharingImageTool.js"
  }
]
```

```js
// parts/sharingImageTool.js
import React from 'react'
import { MediaEditor } from 'sanity-plugin-asset-source-ogimage'
import TwitterImageLayout from './TwitterImageLayout'

export default {
  name: 'sharing-image',
  title: 'Generate image',
  component: MediaEditor,
}
```

💡 When used as a studio tool, generating an image will prompt users to download it instead of adding it to a document as there's no selected document. This makes for a very useful tool for generating images to post on Social media and similar.

![Screenshot showing this plugin as a studio tool](/images/studio-tool-demonstration.png)

---

These methods are going to get you a barebones starter, which you can customize by following the guide below.

## Customizing

At the heart of this plugin we have **layouts**. Each layout defines how to transform a document into data, what fields editors should be able to edit and what React component to use to render the final image.

All the fields a layout can have are as follow:

```ts
type EditorLayout<Data = LayoutData> = {
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
   * Function which gets the current document and generates a data object from it.
   * It's only ran when the layout is first booted up. Users will be able to overwrite its data after that.
   * Is irrelevant in the context of studio tools as the layout won't receive a document, so if you're only using it there you can ignore this.
   */
  prepare?: (document: SanityDocument) => Data
  /**
   * Fields editable by users to change the component data and see changes in the layout live.
   */
  fields?: {
    /**
     * Labels for editors changing the value of the property live.
     */
    title: string
    description?: string
    name: string
    /**
     * Array, date, datetime, reference and image aren't supported (yet?)
     */
    type: SanityFieldTypes
    /**
     * Helpful error message for editors when they can't edit that given field in the Editor dialog.
     * Exclusive to non-supported types
     */
    unsupportedError?: string
  }[]
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
```

### Creating a layout

Let's walk you through creating a **simple blog post sharing image layout** for Instagram. It shows the current author, title of the post, date of publication and an optional subtitle. Here's how we'd define it:

```js
import React from 'react'
// Special component that renders the src for a given `_type: "image"` object
import { Image } from 'sanity-plugin-asset-source-ogimage'

export const blogPostInstagramLayout = {
  name: 'blogPostInstagram',
  title: 'Blog post (Instagram)',
  // Start defining the form editors will fill to change the final image
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'subtitle',
      description: '❓ Optional',
      type: 'string',
    },
    {
      name: 'date',
      // ideally, it'd be a date, but that input isn't implemented yet
      type: 'string',
    },
    {
      name: 'authorImage',
      title: "Author's image",
      type: 'image',
      unsupportedError:
        'We get this automatically from the chosen author. Close this dialog and change it in the document to reflect it here.',
    },
    {
      name: 'authorName',
      type: 'string',
    },
  ],
  prepare: (document) => {
    return {
      title: document.title,
      subtitle: document.subtitle || document.excerpt,
      date: new Date(
        document._createdAt ? document._createdAt : Date.now(),
      ).toLocaleDateString('en'),
      authorImage: document.author?.image,
      authorName: document.author?.name,
    }
  },
  dimensions: {
    width: 1080,
    height: 1080,
  },
  component: ({ title, subtitle, date, authorImage, authorName }) => (
    <div>
      <h1>{title || 'Please insert a title'}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {date && <div>{date}</div>}
      {authorImage && authorName && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image image={authorImage} width={100} />
          {authorName}
        </div>
      )}
    </div>
  ),
}
```

🔁 To recap, above:

- we define the form which editors can use to customize their images
- add a prepare function which gets the current document and generates the initial layout data
  - only applicable to asset sources, feel free to skip this for tools as there we don't have a selected document.
- specify our Instagram post dimensions (1080x1080px)
- and finish by adding a React component to render the resulting data

### Adding a custom layout to your generator

In the [Installing](#installing) section above we added this plugin's default export - now we'll customize it. Let's use the initial example of adding it to an image field:

```js
import React from 'react'
import { MediaEditor } from 'sanity-plugin-asset-source-ogimage';

// taken from the layout we built above
import { blogPostInstagramLayout } from './blogPostInstagramLayout'
// And let's pretend we have another layout
import { blogPostTwitterLayout } from './blogPostTwitterLayout'

// in the schema, add options.sources to your image field
{
  name: 'ogImage',
  title: 'Social sharing image',
  type: 'image',
  options: {
    sources: [
      {
        name: 'sharing-image',
        title: 'Generate sharing image',
        component: (props) => (
          <MediaEditor
            // It's vital to forward props to MediaEditor
            {...props}
            // Our custom layouts
            layouts={[
              blogPostInstagramLayout,
              blogPostTwitterLayout,
            ]}
            // See dialog section below
            dialog={{
              title: 'Create sharing image',
            }}
          />
        ),
        icon: () => <div>🎨</div>,
      }
    ],
  },
}
```

Refer to [Example Layouts](#example-layouts) below for inspiration 😀

### Changing dialog labels

If you're building a non-english studio or just want to customize your wording, you can pass a `dialog` object to `MediaEditor` with the following:

```ts
interface DialogLabels {
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
```

In practice:

```jsx
// ...
<MediaEditor
  {...props}
  dialog={{
    title: 'Generate art',
    finishCta: 'Blow their minds!',
  }}
/>
// ...
```

## Example layouts

Refer to [src/testLayouts](https://github.com/hdoro/sanity-plugin-asset-source-ogimage/tree/main/src/testLayouts) for layout examples you can learn from.

Here's a list of ideas for inspiration:

- Use some **generative art** or random element placement to create unique images every time users load your layout.
  - You could use something like [tsparticles](https://www.npmjs.com/package/tsparticles) for that
- Query a weather API to style your card differently based on what's going on in your editor's location
- Provide the same layout in 2 different dimensions - one for square social media images and one for landscape. Then, have 2 `ogImage` fields in your document, each pointing to one of these layouts.

## Known limits

This plugin uses the excellent [html-to-image](https://www.npmjs.com/package/html-to-image) package to render a base64 PNG string out of the DOM element created by your layouts. It does that by converting the result to an SVG, which gets rendered into a `<canvas>` element which, finally, the browser can handle and download.

It's a cumbersome process where many things can go wrong, so here are some things to watch out for:

- `<iframe>` content doesn't go into the final picture
- A huge DOM tree with a super complex layout will fail
- Web fonts are tricky and may slow down the rendering process. It's recommended to use local fonts instead of served over Typekit, Google Fonts or similar.
- Animations are, well, pointless
- `<canvas>` element may be problematic

## Querying all images generated by this plugin

Based on my experience, it's often the case that editors use the plugin to generate an image only to replace it later, **leaving the generated image unused**.

That's intentional, as we're giving them the option to quickly get something generic that is good enough for the majority of use cases, but also allowing for replacing them later with a bespoke image.

However, this quickly amounts to a bunch of unused image files which pollute our search and increase our monthly costs (not to mention the energy cost of keeping those in store!). To deal with that, you can run the following query to find all those unused ones and delete them using [Sanity's CLI](https://www.sanity.io/docs/cli).

```groq
{
  "all": *[
    _type == "sanity.imageAsset" &&
    source.name == "asset-source-ogimage"
  ] {
    _id,
    _createdAt,
    url,
  },
  "inUse": *[
    _type == "sanity.imageAsset" &&
    source.name == "asset-source-ogimage" &&
    count(*[references(^._id)]) > 0
  ] {
    _id,
    _createdAt,
    url,
  },
  "unused-delete-me": *[
    _type == "sanity.imageAsset" &&
    source.name == "asset-source-ogimage" &&
    count(*[references(^._id)]) > 0
  ] {
    _id,
    _createdAt,
    url,
  },
```

## Brain dump of ideas for the future

- Image, date and array inputs (probably using @sanity/core/form-builder)
- Checkbox & radio version for string inputs
- Let editors know when the image is bigger than their screens and ask them to zoom-out
- Help layout authors with helper functions such as `clampFontSize`
- Dealing with references
  - as it stands, the `prepare` function needs to be sync, but if we make it async we can then allow developers to query references
  - There may be another way, look into how Sanity core deals with the `select` object
- Debug Switch component
  - You have to click it twice every time you want to change it
- Allow for customizing images' asset data (such as using a descriptive `originalFileName`)
- Hook into image generation process for hitting APIs or changing other documents with the image selected.
- Hook for disabling generation to allow for querying APIs in layouts
- Multi-dimension layouts that keep the same data and form but allow for triggering dimensions. Ideal for the same layout used across IG, WhatsApp, LinkedIn, etc.
- Fix TS types not being carried over with the npm package
- Should `@sanity/ui` & `styled-components` be peerDependencies?

<!-- ## Inspiration

Refer to the [Design Inspirations doc](https://github.com/hdoro/sanity-plugin-asset-source-ogimage/blob/main/DESIGN_INSPIRATION.md) for cool OG image designs that might spark some ideas 😉 -->

## Ideas from the community

Between parenthesis is the Twitch username of who suggested these:

- Name badges (geoffjball)
- Meme generator (anniepen)
- presentations (rennehir)
- ads for for marketing teams (kevpedia)
- product builder with layers (brentrobbins)
- certificates of completion (geoffjball)
- instagram stories (lennart_gastler)
- Google Streets map to render an address (brentrobbins)
- 3D models with WebGL (locheed_83)

## Contributing

As long as you are respectful, feel free to chime in with ideas, bug reports, feature requests and PRs 😊

**Oh, and do submit screenshots of your layouts!** This way we can help others with inspiration - let's help our editors rock o/

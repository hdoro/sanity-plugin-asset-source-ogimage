/**
 * Returns a CSS transform that fits the given width and height into the given container
 */
const getScaleFitTransform = (
  containerRect: DOMRect | undefined,
  width: number,
  height: number,
): string | undefined => {
  if (!containerRect) return undefined

  const scaleX = containerRect.width / width
  const scaleY = containerRect.height / height
  const scale = Math.min(scaleX, scaleY)

  if (scale > 1) return undefined

  return `scale(${scale})`
}

export default getScaleFitTransform

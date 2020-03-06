import htmlToImage from 'html-to-image'

export function getObjProperty(p, o) {
  // Taken from https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
  return p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
}

export function getFontSize({ baseline = 4, min = 1.25, str = '', reductionRate = -1 / 50 }) {
  const size = reductionRate * str.length + baseline
  // Fallback to min for long strings
  return Math.max(size, min)
}

export async function printImage({ onSelect, setSaving, wrapperRef }) {
  console.log('Rolando!')
  console.time('Printing');
  setSaving(true);
  const fileBlob = await htmlToImage.toBlob(wrapperRef.current, {
    height: 628,
    width: 1200,
  });
  setSaving(false);
  console.timeEnd('Printing');
  onSelect([
    {
      kind: 'file',
      value: fileBlob,
    },
  ]);
};
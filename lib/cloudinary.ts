// Adds a crop transform to a Cloudinary delivery URL; any other URL is returned as it is.
export function cloudinaryFill(url: string, width: number, height: number) {
  return url.replace(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)/,
    `$1c_fill,w_${width},h_${height},q_auto,f_auto/`
  )
}

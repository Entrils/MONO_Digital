/** Local, responsive artwork shared by the portfolio, services and case studies. */
export default function ProjectImage({
  image,
  alt,
  sizes = "(max-width: 767px) 88vw, 44vw",
  ...props
}) {
  return (
    <img
      src={`/art/${image}-1400.webp`}
      srcSet={[640, 1000, 1400]
        .map((width) => `/art/${image}-${width}.webp ${width}w`)
        .join(", ")}
      sizes={sizes}
      width={1400}
      height={1050}
      loading="lazy"
      decoding="async"
      alt={alt}
      {...props}
    />
  );
}

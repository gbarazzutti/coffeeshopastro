import { z } from 'astro:content'
import { array } from 'astro:schema'

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
})

const featuredImagesSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema,
})

export const BaseWPSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
      rendered: z.string()
    }),
    content: z.object({
      rendered: z.string()
    }),
    featured_images: featuredImagesSchema,
    acf: z.object({
      subtitle: z.string()
    })
})

const gallerySchema = z.object({
    large: imageSchema,
    full: imageSchema,
})

export const GalleryPageSchema = BaseWPSchema.extend({
    gallery: z.array(gallerySchema)
})

const processSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z.string()
})

export const ProcessPageSchema = BaseWPSchema.extend({
    acf: z.object({
        subtitle: z.string()
    }).catchall(processSchema)
})

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
})

export const CategoriesSlugSchema = z.array(CategorySchema.pick({
    slug: true
}))

const CategoriesSchema = z.array(CategorySchema)

// Schema para Posts. Podríamos copiar el BaseWPSchema y quitar el campo de ACF, pero seria duplicar código.
// Heredamos todo el contenido de BaseWPSchema y omitimo el campo 'acf'

export const PostSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema
})

// Ahora hay un problema, con esto traemos solo un post. Porque el esquema base parte desde un objeto (z.object)
// Vamos a crear un arreglo con el PostSchema para que traiga todos los posts

export const PostsSchema = z.array(PostSchema)
export type Post = z.infer<typeof PostSchema>
export type Gallery = z.infer<typeof gallerySchema>
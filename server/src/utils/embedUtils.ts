import { EmbedEntity } from "../entities/postEntity";

const embedTypeMap: Record<string, string> = {
  "app.bsky.embed.images": "images",
  "app.bsky.embed.external": "external",
  "app.bsky.embed.record": "record",
  "app.bsky.embed.recordWithMedia": "recordWithMedia",
};

export function normalizeEmbedType(type: string): string {
  if (type) {
    const baseType = type.split("#")[0];
    return embedTypeMap[baseType]
  }
  return '';
}

export function buildEmbed(type: string, embed: any): EmbedEntity {
  switch (type) {
    case 'images': return {
      type,
      images: embed?.images?.map((image: any) => ({
        thumb: image.thumb,
        alt: image.alt
      }))
    }
    case 'external': return {
      type,
      external: {
        description: embed?.external?.description,
        thumb: embed?.external?.thumb,
        title: embed?.external?.title,
        uri: embed?.external?.uri
      }
    }
    case 'record': return {
      type,
      record: {
        author: {
          avatar: embed?.record?.author?.avatar,
          displayName: embed?.record?.author?.displayName,
          handle: embed?.record?.author?.handle
        },
        createdAt: embed?.record?.value?.createdAt,
        text: embed?.record?.value?.text,
        rkey: embed?.record?.uri?.split('/').pop()
      }
    }
    case 'recordWithMedia': return {
      type,
      record: {
        author: {
          avatar: embed?.record?.record?.author?.avatar,
          displayName: embed?.record?.record?.author?.displayName,
          handle: embed?.record?.record?.author?.handle
        },
        createdAt: embed?.record?.record?.value?.createdAt,
        text: embed?.record?.record?.value?.text,
        rkey: embed?.record?.record?.uri?.split('/').pop()
      }
    }
    default: return { type }
  }
}
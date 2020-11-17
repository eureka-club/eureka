export const TABLE_NAME = 'post';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.language`]: `${TABLE_NAME}.language`,
  [`${alias}.content_text`]: `${TABLE_NAME}.content_text`,
  [`${alias}.is_public`]: `${TABLE_NAME}.is_public`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface PostDbObject {
  'post.id': string;
  'post.language': string;
  'post.content_text': string;
  'post.is_public': boolean;
  'post.created_at': string;
  'post.updated_at': string;
}

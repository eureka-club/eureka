export const TABLE_NAME = 'local_image';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.original_filename`]: `${TABLE_NAME}.original_filename`,
  [`${alias}.stored_file`]: `${TABLE_NAME}.stored_file`,
  [`${alias}.mime_type`]: `${TABLE_NAME}.mime_type`,
  [`${alias}.content_hash`]: `${TABLE_NAME}.content_hash`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface LocalImageDbObject {
  'local_image.id': string;
  'local_image.original_filename': string;
  'local_image.stored_file': string;
  'local_image.mime_type': string;
  'local_image.content_hash': string;
  'local_image.created_at': string;
  'local_image.updated_at': string;
}

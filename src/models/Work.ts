export const TABLE_NAME = 'work';

export const schema = (alias: string): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.type`]: `${TABLE_NAME}.type`,
  [`${alias}.title`]: `${TABLE_NAME}.title`,
  [`${alias}.author`]: `${TABLE_NAME}.author`,
  [`${alias}.year_created`]: `${TABLE_NAME}.year_created`,
  [`${alias}.link`]: `${TABLE_NAME}.link`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface WorkDbObject {
  'work.id': string;
  'work.type': string;
  'work.title': string;
  'work.author': string;
  'work.year_created': string;
  'work.link': string;
  'work.created_at': string;
  'work.updated_at': string;
}

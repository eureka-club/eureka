export const TABLE_NAME = 'user';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.user_name`]: `${TABLE_NAME}.user_name`,
  [`${alias}.roles`]: `${TABLE_NAME}.roles`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface CreatorDbObject {
  'creator.id': string;
  'creator.user_name': string;
  'creator.roles': string;
  'creator.created_at': string;
  'creator.updated_at': string;
}

export interface UserDbObject {
  'user.id': string;
  'user.user_name': string;
  'user.roles': string;
  'user.created_at': string;
  'user.updated_at': string;
}

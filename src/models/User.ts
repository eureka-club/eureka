export const TABLE_NAME = 'users';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.name`]: `${TABLE_NAME}.name`,
  [`${alias}.email`]: `${TABLE_NAME}.email`,
  [`${alias}.image`]: `${TABLE_NAME}.image`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface CreatorDbObject {
  'creator.id': string;
  'creator.name': string;
  'creator.email': string;
  'creator.image': string;
  'creator.created_at': string;
  'creator.updated_at': string;
}

export interface UserDbObject {
  'users.id': string;
  'users.name': string;
  'users.email': string;
  'users.image': string;
  'users.created_at': string;
  'users.updated_at': string;
}

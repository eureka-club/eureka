export const TABLE_NAME = 'user';

export const schema = (alias: string): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.user_name`]: `${TABLE_NAME}.user_name`,
  [`${alias}.roles`]: `${TABLE_NAME}.roles`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

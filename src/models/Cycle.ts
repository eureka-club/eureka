export const TABLE_NAME = 'cycle';

export const schema = (alias: string = TABLE_NAME): Record<string, string> => ({
  [`${alias}.id`]: `${TABLE_NAME}.id`,
  [`${alias}.title`]: `${TABLE_NAME}.title`,
  [`${alias}.languages`]: `${TABLE_NAME}.languages`,
  [`${alias}.content_text`]: `${TABLE_NAME}.content_text`,
  [`${alias}.start_date`]: `${TABLE_NAME}.start_date`,
  [`${alias}.end_date`]: `${TABLE_NAME}.end_date`,
  [`${alias}.created_at`]: `${TABLE_NAME}.created_at`,
  [`${alias}.updated_at`]: `${TABLE_NAME}.updated_at`,
});

export interface CycleDbObject {
  'cycle.id': string;
  'cycle.title': string;
  'cycle.languages': string;
  'cycle.content_text': string;
  'cycle.start_date': string;
  'cycle.end_date': string;
  'cycle.created_at': string;
  'cycle.updated_at': string;
}

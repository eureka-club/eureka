import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import * as uuid from 'uuid';

import { TABLE_NAME as CYCLE_TABLE_NAME } from '../../../models/Cycle';
import getApiHandler from '../../../lib/getApiHandler';
import { getDbConnection } from '../../../lib/db';
import { asyncForEach } from '../../../lib/utils';

const CYCLE_POST_TABLE_NAME = 'cycle_post';
const TEMPORARY_CYCLE_CREATOR_UUID = '340c3ef1-d00b-4480-b9a3-60ce197fdff8';

export const config = {
  api: {
    bodyParser: false,
  },
};

const createCycle = async (fields: Record<string, string[]>): Promise<string> => {
  const connection = getDbConnection();
  const table = connection(CYCLE_TABLE_NAME);

  const pk = uuid.v4();
  await table.insert({
    id: pk,
    creator_id: TEMPORARY_CYCLE_CREATOR_UUID,
    title: fields.cycleTitle[0].trim(),
    languages: JSON.stringify(fields.cycleLanguage[0]),
    content_text: fields.cycleDescription != null ? fields.cycleDescription[0].trim() : null,
    start_date: fields.cycleStartDate[0],
    end_date: fields.cycleEndDate[0],
  });

  return pk;
};

const linkCycleToPosts = async (cycleUuid: string, fields: Record<string, string | string[]>): Promise<void> => {
  const connection = getDbConnection();
  const table = connection(CYCLE_POST_TABLE_NAME);

  if (Array.isArray(fields.postId)) {
    await asyncForEach(fields.postId, async (postId, idx) => {
      await table.insert({
        cycle_id: cycleUuid,
        post_id: postId,
        is_cover: idx === 0,
      });
    });
  }
};

export default getApiHandler().post<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
        return;
      }

      try {
        const cycleDbRecordUuid = await createCycle(fields);
        await linkCycleToPosts(cycleDbRecordUuid, fields);

        res.json({ newCycleUuid: cycleDbRecordUuid });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      }
    });
  },
);

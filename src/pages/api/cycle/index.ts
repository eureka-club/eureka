import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import * as uuid from 'uuid';

import { TABLE_NAME as CYCLE_TABLE_NAME } from '../../../models/Cycle';
import { Session } from '../../../types';
import getApiHandler from '../../../lib/getApiHandler';
import { getDbConnection } from '../../../lib/db';
import { asyncForEach } from '../../../lib/utils';

const CYCLE_POST_TABLE_NAME = 'cycle_post';

export const config = {
  api: {
    bodyParser: false,
  },
};

const createCycle = async (fields: Record<string, string[]>, creatorId: number): Promise<string> => {
  const connection = getDbConnection();
  const table = connection(CYCLE_TABLE_NAME);

  const pk = uuid.v4();
  await table.insert({
    id: pk,
    creator_id: creatorId,
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
    const session = (await getSession({ req })) as Session;
    if (session == null) {
      res.status(401).end();
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
        return;
      }

      try {
        const cycleDbRecordUuid = await createCycle(fields, session.user.id);
        await linkCycleToPosts(cycleDbRecordUuid, fields);

        res.json({ newCycleUuid: cycleDbRecordUuid });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      }
    });
  },
);

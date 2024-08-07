import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form } from 'multiparty';
import { Session, FileUpload, Languages } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, findWithoutLangRestrict, remove, updateFromServerFields } from '../../../src/facades/work';
import { createFromServerFields as editionCreateFromServerFields } from '@/src/facades/edition';
import { storeUpload } from '@/src/facades/fileUpload';
import { Edition, Work } from '@prisma/client';
import { CreateEditionServerPayload } from '@/src/types/edition';
import { WorkDetail } from '@/src/types/work';
import { MISSING_FIELD, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_code';
// import redis from '../../../src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      return res.status(200).json({ status: UNAUTHORIZED, error: UNAUTHORIZED });
    }

    const { id, lang: l } = req.query;
    const language = l ? Languages[l.toString()] : null;

    if (typeof id !== 'string') {
      return res.status(200).json({ error: MISSING_FIELD('id') });
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      return res.status(200).json({ error: MISSING_FIELD('id') });
    }

    try {
      let work = null;
      if (language) work = await find(idNum, language, session);
      else work = await findWithoutLangRestrict(idNum, session);

      if (work == null) {
        res.status(404).end();
        return;
      }

      await remove(idNum);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    // if (session == null) {
    //   res.status(200).json({ error: 'Unauthorized', work: null });
    //   return;
    // }
    const { id, lang: l } = req.query;
    const language = l ? Languages[l.toString()] : null;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      let work = null; 
      if (language) work = await find(idNum, language, session);
      else work = await findWithoutLangRestrict(idNum, session);
      if (work == null) {
        return res.status(200).json(null);
      }
      res.status(200).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      return res.status(401).json({ error: UNAUTHORIZED });
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ error: SERVER_ERROR });
        return;
      }
      if (fields.publicationYear) fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const now = dayjs().utc();

      const { id: id_ } = fields;
      const id = parseInt(id_, 10);
      if (!Number.isInteger(id)) {
        return res.status(200).json({ status: 'OK', work: null });
      }
      let editionsIds: { id: number }[] = [];

      const worksToSaveAsEdition: WorkDetail[] = fields.editions?.length
        ? JSON.parse(fields.editions[0])
        : undefined;

      const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
      try {
        if (worksToSaveAsEdition?.length) {
          const editions = worksToSaveAsEdition.reduce((p, c) => {
            const edition: CreateEditionServerPayload = {
              title: c.title,
              language: c.language,
              isbn: c.isbn!,
              contentText: c.contentText!,
              publicationYear: c.publicationYear!,
              countryOfOrigin: c.countryOfOrigin!,
              ToCheck: false,
              length: c.language,
              workId: id,
              createdAt: now.toDate(),
              creatorId: c.creatorId,
              updatedAt: now.toDate(),
              localImages: c.localImages.map((l) => ({ id: l.id })),
            };
            p.push(edition);
            return p;
          }, [] as CreateEditionServerPayload[]);

          let removeOldWorks: Promise<Work>[] = [];
          worksToSaveAsEdition.forEach((w) => {
            removeOldWorks.push(remove(w.id));
          });

          await Promise.all(removeOldWorks);

          let saveEditions: Promise<Edition>[] = [];
          editions.forEach((e) => {
            saveEditions.push(editionCreateFromServerFields(e));
          });

          const editionsSaved = await Promise.all(saveEditions);
          editionsIds = editionsSaved.map(({ id }) => ({ id }));
        }

        const uploadData = coverImage ? await storeUpload(coverImage) : null;

        delete fields.id;
        delete fields.localImages;
        delete fields.favs;
        delete fields.ratings;
        delete fields.posts;
        delete fields._count;
        delete fields.readOrWatchedWorks;

        const fieldsA = { ...fields };
        const work = await updateFromServerFields(fieldsA, uploadData, id, editionsIds);
        // await redis.flushall();
        res.status(200).json({ work });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ error: SERVER_ERROR });
      } finally {
        //prisma.$disconnect();
      }
    });
  });

/* .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    let data = req.query;
    const id = parseInt(data.id as string, 10);

    try {
      let r: Work;
      r = await prisma.work.update({
        //Esto lo uso para el validar obra en BackOffice, se puede llevar a un facade
        where: { id },
        data: {
          ToCheck: false,
        },
      });
      res.status(200).json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  });*/

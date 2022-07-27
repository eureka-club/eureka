import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
  methods: ['GET', 'HEAD'],
})

export function middleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
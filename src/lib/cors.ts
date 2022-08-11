import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

export const cors = Cors({
  // methods: ['GET', 'HEAD'],
  origin:/http(s)?:\/\/(www\.)?(localhost:3000|eurekastaging.azurewebsites.net|eureka.club)$/
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
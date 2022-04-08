import { NextApiRequest, NextApiResponse } from "next"

export default (request: NextApiRequest, response: NextApiResponse) => {
  console.log('Chegou')

  response.status(200).json({
    ok: true
  })
}
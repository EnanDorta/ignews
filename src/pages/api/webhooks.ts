import { NextApiRequest, NextApiResponse } from "next"

import Stripe from 'stripe'

import { stripe } from '../../service/stripe'

import { Readable } from 'stream'

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
    
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const buf = await buffer(request)
    const secret = request.headers['stripe-signature']

    let event = Stripe.EventsResource

    try { 
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {

    }

    response.status(200).json({
      ok: true
    }) 
  }
  console.log('Chegou')

}
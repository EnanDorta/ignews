import { query } from 'faunadb'
 
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { fauna } from '../../../service/fauna'

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  // jwt: {
  //   signingKey: process.env.SIGNIN_KEY,
  // },
  callbacks: {
    async signIn({ user, account, email, profile, credentials }) {
      const Email = user.email
      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(Email)
               )
            )
          ),
          query.Create(
            query.Collection('users'),
            { data: { Email } }
          ),
          query.Get(
            query.Match(
              query.Index('user_by_email'),
              query.Casefold(Email)
            )
          )
        )
      ) 
        return true
      }
      catch {
        return false
      }
    },
  }
})

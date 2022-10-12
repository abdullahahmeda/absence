import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth, { NextAuthOptions } from 'next-auth'
import loginSchema from '../../../validation/loginSchema'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'اسم المستخدم', type: 'text' },
        password: { label: 'كلمة المرور', type: 'password' }
      },
      async authorize (credentials, req) {
        let body
        try {
          body = await loginSchema.validate(credentials, { stripUnknown: true })
        } catch (error) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: {
            username: body.username
          }
        })

        if (!user) return null

        const isPasswordCorrect = await bcrypt.compare(
          body.password,
          user.password
        )
        if (!isPasswordCorrect) return null

        return {
          ...user,
          password: undefined
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session ({ session, token }) {
      if (session !== undefined) {
        session.user.username = token.username
      }
      return session
    }
  }
}

export default NextAuth(authOptions)

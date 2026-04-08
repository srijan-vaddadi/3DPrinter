import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    GitHub,
    // Dev-only credentials provider for testing without OAuth
    Credentials({
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@print3d.com' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },
      async authorize(credentials) {
        // Demo login — accepts any email with password "password"
        if (credentials?.password === 'password' && credentials?.email) {
          return {
            id: '1',
            name: 'Demo User',
            email: credentials.email as string,
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const isProtected = request.nextUrl.pathname.startsWith('/checkout');
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
});

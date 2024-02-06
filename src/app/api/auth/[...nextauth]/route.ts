import { JWT } from "next-auth/jwt";
import { Backend_URL } from "@component/lib/constant";
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, {NextAuthOptions} from "next-auth";
async function refreshToken(token: JWT): Promise<JWT> {
    const data = {
        refreshToken: token.refreshToken
    };
    const res = await fetch(Backend_URL + "/authentication/refresh-tokens", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    });

    const response = await res.json();

    return {
        ...token,
        refreshToken: response.refreshToken,
    };
}

 const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch(Backend_URL + "/authentication/sign-in", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()
                if (res.ok && user) {
                    return {...user, email: credentials?.email }
                }
                throw new Error(res.statusText)
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                accessToken: token.accessToken,
            }
        },
        jwt: async ({ token, user }) => {
            if (user) {
                return {
                    ...token,
                    ...user
                }
            }
            if (typeof token.expiresIn === 'number') {
                const currTime = Date.now();
                if (currTime > token.expiresIn) {
                    return token;
                }
            }

            return await refreshToken(token);
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
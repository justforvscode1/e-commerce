import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./mongodb"
import User from "@/models/user"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                try {
                    await dbConnect()
                    const userdata = await User.findOne({ email: credentials.email }).select("+password");
                    if (!userdata) {
                        return null
                    }
                    if (!userdata.password) {
                        return null
                    }
                    const passcheck = await bcrypt.compare(credentials.password, userdata.password);
                    if (!passcheck) {
                        return null

                    }
                    return {
                        id: userdata._id.toString(),
                        email: userdata.email,
                        firstName: userdata.firstName,
                        profileImage: userdata.profileImage,
                        authMethods: userdata.authMethods
                    };
                } catch (error) {
                    return null;
                }

            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, credentials }) {
            await dbConnect();
            // checking that what data comes in these fields..........
            // console.log("this is user data", user);
            // console.log("this is account data", account);
            // console.log("this is profile data", profile);
            // console.log("this is credentials data data", credentials);
            // return true
            if (account?.provider === "credentials") {
                return true

            }

            try {
                const findoneuser = await User.findOne({ email: user.email })
                const providerIdField = `${account.provider}Id`
                if (findoneuser) {

                        findoneuser[providerIdField] = account.providerAccountId;

                        if (!findoneuser.authMethods.includes(account.provider)) {
                            findoneuser.authMethods.push(account.provider);
                        }
                        if (!findoneuser.firstName && user?.name) {
                            findoneuser.firstName = user.name;
                        }
                        if (!findoneuser.profileImage && user.image) {
                            findoneuser.profileImage = user.image;
                        }
                    
                    findoneuser.lastLogin = new Date();
                    findoneuser.isEmailVerified = true;
                    await findoneuser.save();
                    user.id = findoneuser._id.toString();

                    return true
                }
                const newUser = new User({
                    email: user.email,
                    firstName: profile?.name || user.name || "User",
                    lastName: "",
                    [providerIdField]: account.providerAccountId,
                    authMethods: [account.provider],
                    profileImage: profile?.image || user.image || null,
                    isEmailVerified: true,

                    lastLogin: new Date()
                });

                await newUser.save();

                user.id = newUser._id.toString();

                return true

            } catch (error) {
                console.error("SignIn error:", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user._id || user.id
                token.email = user.email;
                token.firstName = user.firstName;
                token.profileImage = user.profileImage;
                token.authMethods = user.authMethods;
            }

            if (account) {
                token.provider = account.provider;
            }

            return token;
        },


        async session({ session, token }) {

            session.user.id = token.id;
            session.user.firstName = token.firstName;
            session.user.profileImage = token.profileImage;
            session.user.authMethods = token.authMethods;
            session.user.provider = token.provider;

            return session;
        }
    },

    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}

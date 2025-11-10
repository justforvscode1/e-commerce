import User from "@/models/user";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch user data (password excluded by default due to select: false)
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Return all user data (password is already excluded)
    return Response.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hasPassword: !!user.password, // Check if password exists without exposing it
      googleId: user.googleId,
      githubId: user.githubId,
      discordId: user.discordId,
      authMethods: user.authMethods,
      profileImage: user.profileImage,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      
      // ✅ Formatted linked accounts
      linkedAccounts: {
        google: !!user.googleId,
        github: !!user.githubId,
        discord: !!user.discordId,
        credentials: user.authMethods.includes('credentials')
      }
    });
    
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
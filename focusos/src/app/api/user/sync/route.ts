import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const supabase = await createSupabaseAdminClient();

    const username =
      clerkUser.username ??
      `user_${userId.replace("user_", "").slice(0, 8)}`;

    const displayName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      null;

    const { data, error } = await supabase.rpc("sync_clerk_user", {
      p_clerk_id: userId,
      p_username: username,
      p_display_name: displayName,
      p_avatar_url: clerkUser.imageUrl ?? null,
      p_email:
        clerkUser.emailAddresses[0]?.emailAddress ?? null,
    });

    if (error) {
      console.error("[user/sync] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to sync user", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[user/sync] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

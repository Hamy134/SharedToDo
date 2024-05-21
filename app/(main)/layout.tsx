import { auth } from "@clerk/nextjs/server";
import type { PropsWithChildren } from "react";

import { db } from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";

import { Navigation } from "./_components/navigation";
import { SearchCommand } from "./_components/search-command";

const MainLayout = async ({ children }: PropsWithChildren) => {
  const { userId, redirectToSignIn } = auth();
  const isSubscribed = await checkSubscription();

  if (!userId) return redirectToSignIn();

  const workspaces = await db.workspace.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-full flex dark:bg-[#0D171E]">
      <Navigation workspaces={workspaces} isSubscribed={isSubscribed} />

      <main className="relative flex-1 h-full overflow-y-auto scrollbar">
        <SearchCommand workspaces={workspaces} />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
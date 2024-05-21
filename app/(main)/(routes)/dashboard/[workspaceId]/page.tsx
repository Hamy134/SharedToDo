import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { WelcomeScreen } from "@/components/welcome-screen";
import { db } from "@/lib/db";
import { TaskListWrapper } from "@/app/(main)/_components/task-list-wrapper";

type WorkspaceIdPageProps = {
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const { userId, redirectToSignIn } = auth();

  if (!userId) return redirectToSignIn();

  const workspace = await db.workspace.findUnique({
    where: {
      id: params.workspaceId,
      userId,
    },
    include: {
      todos: {
        orderBy: {
          order: "asc",
        },
        include: {
          subtasks: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!workspace) redirect("/dashboard");

  if (workspace.todos.length === 0) {
    return (
      <WelcomeScreen
        workspaceId={workspace.id}
        title={
          <>
            Create your first{" "}
            <span className="text-primary font-bold">Todo list</span> to get
            started.
          </>
        }
        imgUrl={{
          default: {
            src: "/empty.png",
            alt: "Empty",
          },
          dark: {
            src: "/empty-dark.png",
            alt: "Empty",
          },
        }}
        type="workspace"
      />
    );
  }

  return (
    <div className="flex mt-[55px] mx-2 flex-col flex-1 p-4">
      <TaskListWrapper workspace={workspace} />
    </div>
  );
};

export default WorkspaceIdPage;

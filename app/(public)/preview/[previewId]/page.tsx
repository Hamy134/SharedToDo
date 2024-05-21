import { Home } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { TaskList } from "@/app/(main)/_components/task-list";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

type PreviewIdPageProps = {
  params: {
    previewId: string;
  };
};

const PreviewIdPage = async ({ params }: PreviewIdPageProps) => {
  if (!params?.previewId) redirect("/");

  const workspace = await db.workspace.findUnique({
    where: {
      publicId: params.previewId,
      isPublic: true,
    },
    include: {
      todos: {
        include: {
          subtasks: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!workspace) notFound();

  return (
    <main className="mx-4">
      <div className="flex items-center justify-between py-4">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" /> Home
          </Link>
        </Button>

        <div className="flex gap-x-2 items-center justify-center">
          <h1 className="text-4xl">{workspace.name}</h1>
          <Badge variant="outline">Preview</Badge>
        </div>

        <ModeToggle />
      </div>

      <TaskList workspaceId={workspace.id} todos={workspace.todos} isPreview />
    </main>
  );
};

export default PreviewIdPage;

"use client";

import type { Workspace } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Item } from "./item";

type WorkspaceListProps = {
  workspaces: Workspace[];
};

export const WorkspaceList = ({ workspaces }: WorkspaceListProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      {workspaces.map(({ id, name }) => (
        <Item
          active={params.workspaceId === id}
          key={id}
          id={id}
          label={name}
          onClick={() => router.push(`/dashboard/${id}`)}
        />
      ))}
    </div>
  );
};

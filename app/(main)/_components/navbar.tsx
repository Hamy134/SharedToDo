import { SignOutButton, useUser } from "@clerk/nextjs";
import { Workspace } from "@prisma/client";
import {
  CircleArrowUp,
  CircleUserRound,
  LogOut,
  Menu,
  Settings,
  Settings2,
  Share2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/use-action";
import { useProfile } from "@/hooks/use-profile";
import { useSettings } from "@/hooks/use-settings";
import { useShare } from "@/hooks/use-share";
import { Search } from "./search";
import { Title } from "./title";
import { UserAvatar } from "./user-avatar";

type NavbarProps = {
  isCollapsed: boolean;
  onResetWidth: () => void;
  workspaces: Workspace[];
  isSubscribed: boolean;
};

export const Navbar = ({
  isCollapsed,
  onResetWidth,
  workspaces,
  isSubscribed,
}: NavbarProps) => {
  const params = useParams();
  const router = useRouter();
  const settings = useSettings();
  const profile = useProfile();
  const share = useShare();
  const { isLoaded, isSignedIn, user } = useUser();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      toast.dismiss();
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleSubscribe = () => {
    if (isSubscribed) {
      execute({});
      toast.loading("Redirecting...");
    } else router.push("/#pricing");
  };

  const handleShare = () => {
    const workspace = workspaces.find(({ id }) => id === params.workspaceId);
    if (workspace) {
      share.setWorkspace(workspace);
      share.onOpen();
    }
  };

  return (
    <nav className="bg-background w-full flex items-center justify-between gap-x-4 py-4 px-4"> {/* Added py-4 and px-4 for padding */}
      <div className="flex items-center gap-x-2">
        {isCollapsed && (
          <button onClick={onResetWidth} aria-label="Expand Menu">
            <Menu role="button" className="h-6 w-6 text-muted-foreground" />
          </button>
        )}
        <Title id={params.workspaceId as string} name={workspaces.find(({ id }) => id === params.workspaceId)?.name} />
      </div>
      <div className="flex items-center gap-x-2 justify-center flex-grow">
        <div className="hidden md:flex w-full max-w-md lg:max-w-lg">
          <Search className="w-full" />
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <div className="md:hidden">
          <Search />
        </div>
        <Button
          onClick={handleShare}
          disabled={!params.workspaceId}
          aria-disabled={!params.workspaceId}
          size="icon"
          aria-label="Share your workspace"
        >
          <Hint description="Share your workspace" sideOffset={12}>
            <Share2 className="h-6 w-6" />
          </Hint>
        </Button>
        <DropdownMenu>
          <Hint description="View Profile" side="left" sideOffset={12}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                aria-label="Profile"
              >
                <UserAvatar src={user.imageUrl} alt={user.firstName || ""} />
              </Button>
            </DropdownMenuTrigger>
          </Hint>
          <DropdownMenuContent className="w-52" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <p className="text-xs leading-none dark:text-primary/80 text-muted-foreground">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={profile.onOpen}>
                <CircleUserRound className="h-4 w-4 mr-1 text-primary" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSubscribe}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isSubscribed ? (
                  <>
                    <Settings2 className="h-4 w-4 mr-1 text-primary" />
                    Manage Subscription
                  </>
                ) : (
                  <>
                    <CircleArrowUp className="h-4 w-4 mr-1 text-primary" />
                    Upgrade
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={settings.onOpen}>
                <Settings className="h-4 w-4 mr-1 text-primary" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton redirectUrl="/sign-in">
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-1 text-primary" />
                Log out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

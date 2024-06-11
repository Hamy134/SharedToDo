import { Logo } from "@/components/logo";

import { ActionButtons } from "./action-buttons";
import { checkSubscription } from "@/lib/subscription";

export const Navbar = async () => {
  const isSubscribed = await checkSubscription();

  return (
    <header className="flex items-center justify-between px-10 border-b border-slate-300/30 fixed w-full py-1 bg-white/20 backdrop-blur-md z-50">
      <Logo />

      <div className="flex items-center justify-between">
        <ActionButtons isSubscribed={isSubscribed} />
      </div>
    </header>
  );
};

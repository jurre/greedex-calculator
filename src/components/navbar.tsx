import { UserSession } from "@/components/user-session";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/20 backdrop-blur-sm">
      <div className="container mx-auto flex h-[63px] items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-2">
            {/* Logo or brand name would go here */}
            <p className="font-bold text-2xl text-primary">
              GREEN<span className="text-muted-foreground">DEX</span>
            </p>
          </div>
          <UserSession />
        </div>
      </div>
    </nav>
  );
}

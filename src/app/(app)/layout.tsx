import { Navbar } from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col">
        {children}
      </main>
    </>
  );
}

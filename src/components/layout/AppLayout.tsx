import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarInput } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";

export default function AppLayout() {
  // Default to dark appearance (fits BeastCRM style)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full ambient-bg">
        <AppSidebar />
        <SidebarInset>
          <header className="h-14 flex items-center border-b px-3 gap-2">
            <SidebarTrigger />
            <Link to="/dashboard" className="font-semibold text-sm md:text-base">
              BeastCRM Clone
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:block w-64">
                <SidebarInput placeholder="Buscar" aria-label="Buscar" />
              </div>
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                <RefreshCcw className="h-4 w-4" />
                <span>Actualizar</span>
              </Button>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4" />
                <span>Nuevo mensaje</span>
              </Button>
            </div>
          </header>
          <div className="p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

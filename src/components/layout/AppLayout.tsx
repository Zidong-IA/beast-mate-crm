import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarInput } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, LogOut, User } from "lucide-react";
import { ContactSelector } from "@/components/ContactSelector";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppLayout() {
  const { user, signOut } = useAuth();
  
  // Default to dark appearance (fits BeastCRM style)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
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
              <ContactSelector>
                <Button variant="hero" size="sm">
                  <Plus className="h-4 w-4" />
                  <span>Nuevo mensaje</span>
                </Button>
              </ContactSelector>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

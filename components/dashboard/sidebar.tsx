"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  LogOut,
  Store,
  Users,
  Settings,
  PackagePlus,
  PackageMinus,
  Menu,
  BarChart3,
  ShoppingBag,
  Home,
  ChevronDown,
  ChevronRight,
  Warehouse,
  TrendingUp,
  FileText,
  Bell,
  MessageSquare,
  PackageX,
  PackagePlusIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useCartStore } from "@/lib/store/cart-store";
import NotificationsModal from "./notificationsModal";

// Group manager navigation into logical sections
const managerNavigationSections = [
  {
    title: "Order Management",
    icon: ShoppingCart,
    items: [
      {
        name: "Orders",
        href: "/dashboard/bar/manager/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Product Management",
    icon: Package,
    items: [
      {
        name: "Products",
        href: "/dashboard/bar/manager/products/discounts",
        icon: Package,
      },
      {
        name: "Catalog",
        href: "/dashboard/bar/manager/catalog",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "Inventory Management",
    icon: Warehouse,
    items: [
      // { name: "Stock In", href: "/dashboard/bar/manager/stock-in", icon: PackagePlus },
       {
        name: "Stock Master",
        href: "/dashboard/bar/manager/stock-master",
        icon: PackagePlus,
      },
      // {
      //   name: "EBM Stock Movement",
      //   href: "/dashboard/bar/manager/stock-movement",
      //   icon: PackageMinus,
      // },
      
      {
        name: "Imported",
        href: "/dashboard/bar/manager/imported",
        icon: FileText,
      },
      {
        name: "Purchases",
        href: "/dashboard/bar/manager/purchase-sales-transactions",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    items: [
      {
        name: "Inventory Report",
        href: "/dashboard/bar/manager/inventory-report",
        icon: BarChart3,
      },
      {
        name: "Sales Report",
        href: "/dashboard/bar/manager/sales-report",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      {
        name: "User Management",
        href: "/dashboard/bar/manager/users",
        icon: Users,
      },
    ],
  },
];

const adminNavigation = [
  { name: "Orders", href: "/dashboard/bar/partner/orders", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/bar/partner/products", icon: Package },
  { name: "Migrated Products", href: "/dashboard/bar/partner/products/migrated", icon: PackagePlusIcon },
  {
    name: "Catalog",
    href: "/dashboard/bar/partner/catalog",
    icon: ShoppingBag,
  },
  // {
  //   name: "Stock In",
  //   href: "/dashboard/bar/partner/stock-in",
  //   icon: PackagePlus,
  // },
  {
    name: "Inventory Report",
    href: "/dashboard/bar/partner/inventory-report",
    icon: BarChart3,
  },
  {
    name: "User Management",
    href: "/dashboard/bar/partner/users",
    icon: Users,
  },
];

const distributorNavigation = [
  {
    name: "Catalog",
    href: "/dashboard/bar/waiters/catalog",
    icon: ShoppingBag,
  },
  {
    name: "My Orders",
    href: "/dashboard/bar/waiters/orders",
    icon: ClipboardList,
  },
];

const chefNavigation = [
  {
    name: "My Orders",
    href: "/dashboard/bar/chef/orders",
    icon: ClipboardList,
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Initialize with sections that contain the current path
    const activeSections: string[] = [];
    managerNavigationSections.forEach((section) => {
      if (section.items.some((item) => pathname.startsWith(item.href))) {
        activeSections.push(section.title);
      }
    });
    return activeSections;
  });

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isSectionExpanded = (title: string) => expandedSections.includes(title);

  const renderManagerNavigation = () => {
    return managerNavigationSections.map((section) => {
      const SectionIcon = section.icon;
      const isExpanded = isSectionExpanded(section.title);
      const hasActiveItem = section.items.some((item) =>
        pathname.startsWith(item.href)
      );

      return (
        <div key={section.title} className="space-y-1">
          <button
            onClick={() => toggleSection(section.title)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              hasActiveItem
                ? "bg-primary/10 text-primary"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <SectionIcon className="h-4 w-4" />
              <span>{section.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 space-y-1 border-l border-white/10 pl-2">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <ItemIcon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  const renderAdminNavigation = () => {
    return adminNavigation.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5" />
          {item.name}
        </Link>
      );
    });
  };

  const renderDistributorNavigation = () => {
    return distributorNavigation.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5" />
          {item.name}
        </Link>
      );
    });
  };


  const renderChefNavigation = () => {
    return chefNavigation.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5" />
          {item.name}
        </Link>
      );
    });
  };

  const renderNavigation = () => {
    if (user?.role === "MANAGER") {
      return renderManagerNavigation();
    } else if (user?.role === "PARTNER_ADMIN") {
      return renderAdminNavigation();
    } else if(user?.role === "WAITER") {
      return renderDistributorNavigation();
    }else{
      return renderChefNavigation();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <NotificationsModal/>

      {/* Scrollable navigation area with custom scrollbar */}
      <nav className="flex-1 space-y-2 p-4 bg-black overflow-y-auto scrollbar-custom">
        <div className="pt-2">
          <Link
            href={
              user?.role === "MANAGER"
                ? "/dashboard/bar/manager"
                : user?.role === "WAITER"
                ? "/dashboard/bar/waiters"
                : user?.role === "PARTNER_ADMIN"
                ? "/dashboard/bar/partner"
                : "/dashboard/bar"
            }
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-4",
              pathname ===
                (user?.role === "MANAGER"
                  ? "/dashboard/bar/manager"
                  : user?.role === "WAITER"
                  ? "/dashboard/bar/waiters"
                  : "/dashboard/settingss")
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
        </div>

        {renderNavigation()}

        <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
          <Link
            href={
              user?.role === "MANAGER"
                ? "/dashboard/bar/manager/settings"
                : user?.role === "WAITER"
                ? "/dashboard/bar/waiters/settings"
                : user?.role === "PARTNER_ADMIN"
                ? "/dashboard/bar/partner/settings"
                : "/dashboard/settings"
            }
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname ===
                (user?.role === "MANAGER"
                  ? "/dashboard/bar/manager/settings"
                  : user?.role === "WAITER"
                  ? "/dashboard/bar/waiters/settings"
                  : user?.role === "PARTNER_ADMIN"
                  ? "/dashboard/bar/partner/settings"
                  : "/dashboard/settings")
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>

          {user?.role === "PARTNER_ADMIN" && (
            <Link
              href={"/dashboard/bar/partner/settings/company"}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/dashboard/bar/partner/settings/company"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Settings className="h-5 w-5" />
              Company & EBM Settings
            </Link>
          )}
        </div>
      </nav>

      {/* Fixed footer section */}
      <div className="border-t border-white/10 p-4 bg-black shrink-0">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {user?.name}
              </span>
              <span className="text-xs capitalize text-gray-400">
                {user?.role}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent border-white/20 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="md" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Logging Out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const path = usePathname();
  const catPath = path.includes("/catalog");

  const cartWithPath = catPath && items.length > 0 ? true : false;

  return (
    <>
      {/* Add custom scrollbar styles globally */}
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          border: none;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .scrollbar-custom::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* For Firefox */
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        /* Style the sheet content scrollbar too */
        [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          width: 6px;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
          background: transparent;
        }

        [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      `}</style>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-black text-white border-white/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 bg-black border-white/10 scrollbar-custom"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={`hidden ${
          cartWithPath ? "" : "lg:flex"
        } h-screen w-72 flex-col border-r border-white/10 bg-black`}
      >
        <SidebarContent />
      </div>
    </>
  );
}

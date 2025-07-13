"use client";
import React, { memo, useRef } from "react";
import Container from "./Container";
import Logo from "./Logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useTheme } from "next-themes";
import SearchInput from "./SearchInput";
import { LogIn, Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "debounce";
const Switch = dynamic(() => import("./ui/switch").then((mod) => mod.Switch), {
  ssr: false,
  loading: () => null,
});

const Navbar = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const isDark = theme === "dark";
  const handleSearchInput = () => {
    if (!searchInput.current) return;
    const url = new URLSearchParams(searchParams);
    if (url.get("q")) url.set("q", searchInput.current.value);
    else url.append("q", searchInput.current.value);
    if (!searchInput.current?.value) url.delete("q");
    debounceRoute(`/blogs/search?${url.toString()}`);
  };
  const debounceRoute = debounce((url: string) => {
    router.push(url);
  }, 300);

  return (
    <nav className="py-8 overflow-hidden">
      <Container>
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <Logo />
          </Link>
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>Home</NavigationMenuItem>
              <NavigationMenuItem asChild>
                <Link href={"/settings"}>Settings</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>Pages</NavigationMenuItem>

              <NavigationMenuItem asChild>
                <Link href={"/writeBlog"}>Write Blog</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex pe-2 justify-center items-center gap-5">
            {status !== "authenticated" && (
              <Link href={"/auth/signin"} className="text-secondary-foreground">
                <LogIn size={16} />
              </Link>
            )}

            <div className="max-md:hidden">
              <SearchInput
                ref={searchInput}
                defaultValue={searchParams.get("q") as string}
                onChange={handleSearchInput}
              />
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={(status) => {
                setTheme(status ? "dark" : "light");
              }}
            />

            <Menu
              onClick={toggleSidebar}
              className="md:hidden cursor-pointer"
            />
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src={data.user.image?.url || ""}
                      width={20}
                      height={20}
                      className="w-10 h-10 rounded-full"
                    />
                    <AvatarFallback className="w-10 font-semibold capitalize  h-10 rounded-full">
                      {data.user.name?.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/author/${data.user.userId}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={"/settings"}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        redirectTo: "/",
                      })
                    }
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default memo(Navbar);

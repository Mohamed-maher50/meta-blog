"use client";
import React, { memo, useRef } from "react";
import Container from "../utils/Container";
import Logo from "../miscellaneous/Logo";

import { useTheme } from "next-themes";
import { Bookmark, LogIn, LogOut, PenBoxIcon, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "debounce";

import NotificationsDropDownMenu from "../notifications/NotificationsMenu";
import SearchInput from "../miscellaneous/SearchInput";
import WithAuth from "../auth/WithAuth";
const Switch = dynamic(() => import("../ui/switch").then((mod) => mod.Switch), {
  ssr: false,
  loading: () => null,
});

const Navbar = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme, theme } = useTheme();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const isDark = theme === "dark";
  const handleSearchInput = () => {
    if (!searchInput.current) return;
    const url = new URLSearchParams(searchParams);
    if (url.get("q")) url.set("q", searchInput.current.value);
    else url.append("q", searchInput.current.value);
    if (!searchInput.current?.value) url.delete("q");
    debounceRoute(`/search/blogs?${url.toString()}`);
  };

  const debounceRoute = debounce((url: string) => {
    router.push(url);
  }, 300);
  return (
    <nav className="py-8 border-b border-b-secondary overflow-hidden">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 content-center">
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          <div className="flex   justify-center items-center gap-2">
            <Link
              hidden={status === "authenticated"}
              href={"/auth/signin"}
              className="text-secondary-foreground"
            >
              <span className="sr-only ">login</span>
              <LogIn size={16} />
            </Link>

            <div className=" mx-1">
              <SearchInput
                ref={searchInput}
                defaultValue={searchParams.get("q") as string}
                onChange={handleSearchInput}
              />
            </div>
            <WithAuth>
              <NotificationsDropDownMenu />
            </WithAuth>
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="profile links"
                  className="cursor-pointer "
                >
                  <Avatar>
                    <AvatarImage
                      src={data.user.image as string}
                      className=" rounded-full"
                      aria-label={`${data.user.name} image`}
                    />
                    <AvatarFallback className="w-10 font-semibold capitalize  h-10 rounded-full">
                      {data.user.name?.split("")[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="flex min-w-40  justify-between items-center">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <Switch
                      className="max-md:hidden"
                      checked={isDark}
                      onCheckedChange={(status) => {
                        setTheme(status ? "dark" : "light");
                      }}
                      aria-label="Toggle dark mode"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/author/${data.user.userId}`}>
                      <User className="text-muted-foreground duration-500 dark:hover:text-white" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/blogs/new`}>
                      <PenBoxIcon className="text-muted-foreground  capitalize duration-500 dark:hover:text-white" />
                      Write Story
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/favorites`}>
                      <Bookmark className="text-muted-foreground duration-500 dark:hover:text-white" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        redirectTo: "/",
                      })
                    }
                  >
                    <LogOut className="text-muted-foreground duration-500 dark:hover:text-white" />
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

"use client";
import React, { memo, useCallback, useRef, useState } from "react";
import Container from "../utils/Container";
import Logo from "../miscellaneous/Logo";

import { useTheme } from "next-themes";
import { Bookmark, LogOut, Menu, PenBoxIcon, User } from "lucide-react";
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
import WithAuth from "../auth/WithAuth";
import { Button } from "../ui/button";
import InputSearchLoader from "../InputSearchLoader";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
const Switch = dynamic(() => import("../ui/switch").then((mod) => mod.Switch), {
  ssr: false,
  loading: () => null,
});

const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme, theme } = useTheme();
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef<HTMLInputElement | null>(null);
  console.log(status);
  const isDark = theme === "dark";
  const handleSearchInput = () => {
    if (!isSearching) setIsSearching(true);
    if (!searchInput.current) return;
    const url = new URLSearchParams(searchParams);
    if (url.get("q")) url.set("q", searchInput.current.value);
    else url.append("q", searchInput.current.value);
    if (!searchInput.current?.value) url.delete("q");
    debounceRoute(`/search/blogs?${url.toString()}`);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRoute = useCallback(
    debounce((url: string) => {
      setIsSearching(false);
      router.push(url);
      if (isSheetOpen) setIsSheetOpen(false);
    }, 1000),
    []
  );
  return (
    <nav className="py-4 border-b border-b-secondary overflow-hidden">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 content-center">
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          <div className="flex   justify-center items-center gap-2">
            <div className=" mx-1 max-md:hidden">
              <InputSearchLoader
                ref={searchInput}
                isLoading={isSearching}
                placeholder="Search..."
                onChange={handleSearchInput}
                defaultValue={searchParams.get("q") as string}
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
            <div className="max-md:hidden ">
              <Button
                asChild
                variant={"ghost"}
                hidden={status === "authenticated"}
              >
                <Link href={"/auth/signin"}>Log in</Link>
              </Button>
              <Button asChild hidden={status === "authenticated"}>
                <Link href={"/auth/signUp"}>sign up</Link>
              </Button>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="px-4">
                <div className="space-y-4 mt-8">
                  {/* Mobile Search */}
                  <InputSearchLoader
                    ref={searchInput}
                    isLoading={isSearching}
                    placeholder="Search..."
                    onChange={handleSearchInput}
                    defaultValue={searchParams.get("q") as string}
                  />

                  <div className="space-y-2">
                    {status == "authenticated" ? (
                      <>
                        <div className="flex items-center gap-3 rounded-lg p-2 border border-border">
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
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {data.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {data.user.email}
                            </p>
                          </div>
                        </div>
                        <Link href="/profile">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            My Profile
                          </Button>
                        </Link>
                        <Link href="/settings">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            Settings
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" className="block">
                          <Button className="w-full">Sign Up</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default memo(Navbar);

"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "debounce";

import NotificationsDropDownMenu from "../notifications/NotificationsMenu";
import WithAuth from "../auth/WithAuth";
import { Button } from "../ui/button";
import InputSearchLoader from "../InputSearchLoader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";

const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme, theme } = useTheme();
  const [isSearching, setIsSearching] = useState(false);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
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
  useEffect(() => {
    setMounted(true);
  }, []);

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
                  <Avatar className="flex items-center justify-center">
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
                    {mounted && (
                      <Switch
                        checked={!isDark}
                        onCheckedChange={(status) => {
                          setTheme(status ? "light" : "dark");
                        }}
                        aria-label={`Toggle ${theme} mode`}
                      />
                    )}
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
            {mounted ||
              (status == "authenticated" && (
                <Switch
                  checked={!isDark}
                  className="md:hidden"
                  onCheckedChange={(status) => {
                    setTheme(status ? "light" : "dark");
                  }}
                  aria-label={`Toggle ${theme} mode`}
                />
              ))}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pt-2 px-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <div className="space-y-4 mt-8">
                  {/* Mobile Search */}

                  <WithAuth>
                    <div className="flex items-center gap-3 rounded-lg p-2 border border-border">
                      <Avatar>
                        <AvatarImage
                          src={data?.user.image as string}
                          className=" rounded-full"
                          aria-label={`${data?.user.name} image`}
                        />
                        <AvatarFallback className="w-10 font-semibold capitalize  h-10 rounded-full">
                          {data?.user.name?.split("")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {data?.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {data?.user.email}
                        </p>
                      </div>
                    </div>
                  </WithAuth>
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
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start"
                          >
                            <Link href={`/author/${data.user.userId}`}>
                              <User className="text-muted-foreground duration-500 dark:hover:text-white" />
                              My Profile
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start"
                          >
                            <Link href={`/favorites`}>
                              <Bookmark className="text-muted-foreground duration-500 dark:hover:text-white" />
                              My Favorites
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose>
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start"
                          >
                            <Link href={`/author/${data.user.userId}`}>
                              <PenBoxIcon className="text-muted-foreground  capitalize duration-500 dark:hover:text-white" />
                              Write Story
                            </Link>
                          </Button>
                        </SheetClose>

                        <Button
                          onClick={() =>
                            signOut({
                              redirectTo: "/",
                            })
                          }
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/signin" className="block">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/signUp" className="block">
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

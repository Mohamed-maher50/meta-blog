"use client";
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import SearchInput from "./SearchInput";
import { Menu } from "lucide-react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="py-8 overflow-hidden">
      <Container>
        <div className="flex justify-between items-center">
          <Logo />
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>Home</NavigationMenuItem>
              <NavigationMenuItem>Blog</NavigationMenuItem>
              <NavigationMenuItem> Pages</NavigationMenuItem>
              <NavigationMenuItem> Contact</NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex pe-2 justify-center items-center gap-5">
            <div className="max-md:hidden">
              <SearchInput />
            </div>
            <Switch
              onCheckedChange={(status) => {
                setTheme(status ? "dark" : "light");
              }}
            />

            <Menu
              onClick={toggleSidebar}
              className="md:hidden cursor-pointer"
            />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;

import { SocialKey } from "@/schema/UserSettingsSchema";
import {
  Facebook,
  Instagram,
  Linkedin,
  LucideProps,
  Twitter,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const socialMediaLinks: {
  name: SocialKey;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  id: number;
  placeholder?: string;
}[] = [];
export const socialLink = {
  instagram: {
    Icon: Instagram,
    placeholder: "Ex: https://instagram.com/username",
  },
  linkedin: {
    Icon: Linkedin,
    placeholder: "Ex: https://linkedin.com/in/username",
  },
  twitter: {
    Icon: Twitter,
    placeholder: "Ex: https://x.com/username",
  },
  facebook: {
    Icon: Facebook,
    placeholder: "Ex: https://facebook.com/username",
  },
};

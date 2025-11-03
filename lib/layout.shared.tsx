import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { TernSecureIcon } from "@/app/layout.client";
import Shield from "@/public/shield.png";

export const logo = (
  <>
    <Image
      alt="TernSecure"
      src={Shield}
      sizes="100px"
      className="hidden w-22 [.uwu_&]:block"
      aria-label="TernSecure"
    />
    <TernSecureIcon className="size-5 [.uwu_&]:hidden text-primary" />
  </>
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium [.uwu_&]:hidden [header_&]:text-[15px]">
            TernSecure
          </span>
        </>
      ),
      url: "/",
    },
  };
}

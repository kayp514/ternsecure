import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import "../globals.home.css";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        { text: "Authentication", url: "/" },
        { text: "Docs", url: "/docs" },
      ]}
    >
      {children}
    </HomeLayout>
  );
}

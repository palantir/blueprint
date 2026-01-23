import type { Metadata } from "next";
import { NextProvider } from "fumadocs-core/framework/next";
import { ThemeProvider } from "@/components/fumadocs/ThemeProvider";
import "./globals.scss";

export const metadata: Metadata = {
    title: "Blueprint Documentation",
    description: "A React-based UI toolkit for the web",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <NextProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </NextProvider>
            </body>
        </html>
    );
}

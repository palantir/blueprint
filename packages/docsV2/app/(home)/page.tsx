import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">Blueprint Docs V2</h1>
            <p className="text-lg text-fd-muted-foreground mb-8">Fumadocs Trial</p>
            <Link
                href="/docs"
                className="px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90"
            >
                View Documentation
            </Link>
        </main>
    );
}

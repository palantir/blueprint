import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header style={{ padding: "4rem 0", textAlign: "center" }}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div>
                    <Link className="button button--secondary button--lg" to="/docsV2/docs/card">
                        View Components
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`${siteConfig.title}`} description="Blueprint UI Documentation - Docusaurus Edition">
            <HomepageHeader />
            <main>
                <section style={{ padding: "2rem 0", textAlign: "center" }}>
                    <div className="container">
                        <p>This is an experimental Docusaurus-based documentation site for Blueprint.</p>
                        <p>Currently showcasing Card and Callout components.</p>
                    </div>
                </section>
            </main>
        </Layout>
    );
}

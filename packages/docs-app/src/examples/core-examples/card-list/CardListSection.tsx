import { Card, CardList, Section, SectionCard } from "@blueprintjs/core";

export default function CardListSection() {
    return (
        <Section title="Fresh Ingredients" style={{ maxWidth: 400 }}>
            <SectionCard padded={false} style={{ height: 152, overflowY: "auto" }}>
                <CardList bordered={false}>
                    <Card>Tomatoes</Card>
                    <Card>Garlic</Card>
                    <Card>Olive Oil</Card>
                    <Card>Basil</Card>
                    <Card>Parmesan</Card>
                    <Card>Pine Nuts</Card>
                </CardList>
            </SectionCard>
        </Section>
    );
}

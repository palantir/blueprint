import { Card, CardList } from "@blueprintjs/core";

export default function CardListBasic() {
    return (
        <CardList style={{ maxWidth: 300 }}>
            <Card>Apples</Card>
            <Card>Oranges</Card>
            <Card>Bananas</Card>
        </CardList>
    );
}

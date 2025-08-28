import { Card, CardList } from "@blueprintjs/core";

export default function CardListCompact() {
    return (
        <div className="group center" style={{ justifyContent: "center", width: "100%" }}>
            <CardList compact={false} style={{ maxWidth: 200 }}>
                <Card>Spaghetti</Card>
                <Card>Lasagna</Card>
                <Card>Ravioli</Card>
            </CardList>
            <CardList compact={true} style={{ maxWidth: 200 }}>
                <Card>Penne</Card>
                <Card>Fettuccine</Card>
                <Card>Rigatoni</Card>
            </CardList>
        </div>
    );
}

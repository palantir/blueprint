import { Card, CardList } from "@blueprintjs/core";

export default function CardListBordered() {
    return (
        <div className="group" style={{ justifyContent: "center", width: "100%" }}>
            <CardList bordered={true} style={{ maxWidth: 200 }}>
                <Card>Bread</Card>
                <Card>Cheese</Card>
                <Card>Butter</Card>
            </CardList>
            <CardList bordered={false} style={{ maxWidth: 200 }}>
                <Card>Honey</Card>
                <Card>Jam</Card>
                <Card>Peanut Butter</Card>
            </CardList>
        </div>
    );
}

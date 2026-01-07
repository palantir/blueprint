import { Card, Elevation } from "@blueprintjs/core";

export default function CardElevation() {
    return (
        <div className="group" style={{ gap: 40 }}>
            <Card elevation={Elevation.ZERO}>0</Card>
            <Card elevation={Elevation.ONE}>1</Card>
            <Card elevation={Elevation.TWO}>2</Card>
            <Card elevation={Elevation.THREE}>3</Card>
            <Card elevation={Elevation.FOUR}>4</Card>
        </div>
    );
}

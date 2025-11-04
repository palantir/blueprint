/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Card, Classes, Colors, Divider, Icon, type IconProps, Tooltip } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Box } from "@blueprintjs/labs";

export const BoxObjectCardExample: React.FC<ExampleProps> = props => {
    return (
        <Example options={false} {...props}>
            <Box display="flex" flexDirection="column" gap={3}>
                <ObjectCard
                    color={Colors.BLUE3}
                    description="Flight tracking and scheduling"
                    icon="airplane"
                    label="Flights"
                    numberOfDependencies={8}
                    numberOfObjects={1243}
                />
                <ObjectCard
                    color={Colors.GREEN3}
                    description="Airport locations and facility information"
                    icon="map-marker"
                    label="Airports"
                    numberOfDependencies={3}
                    numberOfObjects={187}
                />
                <ObjectCard
                    color={Colors.INDIGO3}
                    description="Flight paths and route networks"
                    icon="route"
                    label="Routes"
                    numberOfDependencies={5}
                    numberOfObjects={342}
                    experimental={true}
                />
                <ObjectCard
                    color={Colors.VIOLET3}
                    description="Passenger bookings and travel records"
                    icon="people"
                    label="Passengers"
                    numberOfDependencies={12}
                    numberOfObjects={8456}
                />
            </Box>
        </Example>
    );
};

interface ObjectCardProps {
    color?: string;
    description: string;
    experimental?: boolean;
    icon: IconProps["icon"];
    label: string;
    numberOfDependencies?: number;
    numberOfObjects?: number;
}

function ObjectCard({
    color = Colors.GRAY3,
    description,
    experimental = false,
    icon,
    label,
    numberOfDependencies = 0,
    numberOfObjects = 0,
}: ObjectCardProps) {
    return (
        <Card compact={true} style={{ width: 320 }}>
            <Box display="flex" alignItems="center" paddingYEnd={3}>
                <Box
                    display="flex"
                    padding={2}
                    style={{
                        backgroundColor: color + "1A",
                        borderRadius: 2,
                    }}
                >
                    <Icon color={color} icon={icon} />
                </Box>
                <Box display="flex" flexDirection="column" marginX={2}>
                    <strong>{label}</strong>
                    <small className={Classes.TEXT_MUTED}>{numberOfObjects} objects</small>
                </Box>
                {experimental && (
                    <Box asChild={true} marginLeft="auto">
                        <Tooltip content="Experimental">
                            <Icon color={Colors.ORANGE3} icon="lab-test" />
                        </Tooltip>
                    </Box>
                )}
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
                <small className={Classes.TEXT_MUTED}>{numberOfDependencies} dependencies</small>
                <Divider />
                <div className={Classes.TEXT_MUTED}>{description}</div>
            </Box>
        </Card>
    );
}

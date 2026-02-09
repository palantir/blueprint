/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useState } from "react";

import {
    Button,
    Card,
    Classes,
    Code,
    Colors,
    FileInput,
    FormGroup,
    Icon,
    type IconName,
    Section,
    SectionCard,
} from "@blueprintjs/core";
import { SVGIconContainer } from "@blueprintjs/icons";
import { Box, Flex } from "@blueprintjs/labs";

import { ColorPicker } from "./ColorPicker";
import { IconSelect } from "./IconSelect";
import { IconSizeSelect } from "./IconSizeSelect";

interface CustomIconData {
    isActive: boolean;
    name: string;
    originalViewBox: string;
    paths: string[];
}

interface IconPreviewProps {
    customIconData: CustomIconData | null;
    onCustomIconClear: () => void;
    onCustomIconUpload: (data: CustomIconData) => void;
    onIconSelect: (icon: IconName) => void;
    parseSVGFile: (file: File) => Promise<CustomIconData>;
    selectedIcon: IconName;
}

export const IconPreview = ({
    customIconData,
    onCustomIconClear,
    onCustomIconUpload,
    onIconSelect,
    parseSVGFile,
    selectedIcon,
}: IconPreviewProps) => {
    const [iconSize, setIconSize] = useState(20);
    const [iconColor, setIconColor] = useState<string>(Colors.BLACK);
    const [fileName, setFileName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleFileChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            const input = event.currentTarget;
            const file = input.files?.[0];

            if (!file) {
                return;
            }

            setFileName(file.name);
            setError("");

            parseSVGFile(file)
                .then(data => {
                    onCustomIconUpload(data);
                })
                .catch(err => {
                    setError(err.message || "Failed to parse SVG file");
                    setFileName("");
                });
        },
        [onCustomIconUpload, parseSVGFile],
    );

    const handleClearCustomIcon = useCallback(() => {
        onCustomIconClear();
        setFileName("");
        setError("");
    }, [onCustomIconClear]);

    const isCustomIconActive = customIconData?.isActive === true;

    return (
        <Section collapsible={true} title="Icon Preview">
            <Flex asChild={true} alignItems="center" gap={8}>
                <SectionCard>
                    <div>
                        <FormGroup label="Select Icon">
                            <IconSelect
                                disabled={isCustomIconActive}
                                onIconSelect={onIconSelect}
                                value={selectedIcon}
                            />
                        </FormGroup>
                        <Box className={Classes.TEXT_MUTED} marginBottom={4}>
                            <small>- OR -</small>
                        </Box>
                        <FormGroup
                            helperText={error || (fileName ? `Uploaded: ${fileName}` : undefined)}
                            intent={error ? "danger" : undefined}
                            label="Upload Custom SVG"
                        >
                            <Flex gap={2}>
                                <FileInput
                                    buttonText="Browse"
                                    disabled={isCustomIconActive}
                                    fill={true}
                                    hasSelection={!!fileName}
                                    inputProps={{
                                        accept: ".svg",
                                        onChange: handleFileChange,
                                    }}
                                    text={fileName || "Choose file..."}
                                    style={{ maxWidth: 200 }}
                                />
                                {isCustomIconActive && (
                                    <Button
                                        icon="cross"
                                        onClick={handleClearCustomIcon}
                                        aria-label="clear custom icon"
                                        intent="danger"
                                    />
                                )}
                            </Flex>
                        </FormGroup>

                        <FormGroup label="Icon Size">
                            <IconSizeSelect value={iconSize} onChange={setIconSize} />
                        </FormGroup>
                        <Box asChild={true} marginBottom={0}>
                            <FormGroup label="Icon Color">
                                <ColorPicker value={iconColor} onChange={setIconColor} />
                            </FormGroup>
                        </Box>
                    </div>
                    <Flex
                        asChild={true}
                        alignItems="center"
                        flexDirection="column"
                        gap={4}
                        justifyContent="center"
                        style={{ aspectRatio: "1 / 1", width: "200px" }}
                    >
                        <Card elevation={2}>
                            {isCustomIconActive && customIconData ? (
                                <SVGIconContainer
                                    iconName={customIconData.name as IconName}
                                    size={iconSize}
                                    svgProps={
                                        { viewBox: customIconData.originalViewBox } as React.SVGAttributes<SVGElement>
                                    }
                                >
                                    {customIconData.paths.map((d, i) => (
                                        <path d={d} key={i} style={{ fill: iconColor }} />
                                    ))}
                                </SVGIconContainer>
                            ) : (
                                <Icon icon={selectedIcon} size={iconSize} style={{ color: iconColor }} />
                            )}
                            <Code>{isCustomIconActive && customIconData ? customIconData.name : selectedIcon}</Code>
                        </Card>
                    </Flex>
                </SectionCard>
            </Flex>
        </Section>
    );
};

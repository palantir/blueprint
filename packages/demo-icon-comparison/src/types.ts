export interface IconData {
  name: string;
  displayName?: string;
  oldIcon?: string; // Old Blueprint SVG content
  newIconSvg?: string; // New Figma SVG content
  isUnfilled: boolean; // Changed from filled to outlined
  hasMajorChange: boolean; // Major design change
  isManuallyTagged: boolean; // User manually set any tag
  newName?: string; // Renamed icon name
}

export interface IconMetadata {
  iconName: string;
  displayName: string;
  tags: string;
  group: string;
}

export interface ManualOverrides {
  [iconName: string]: {
    isUnfilled?: boolean;
    hasMajorChange?: boolean;
    newName?: string; // Renamed icon name
    timestamp?: number; // When last edited
  };
}

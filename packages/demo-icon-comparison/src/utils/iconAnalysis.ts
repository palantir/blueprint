import { exportInteractiveHTMLReport } from './exportInteractiveHTML';

/**
 * Analyze SVG content to determine if it's filled or outlined style
 */
export function analyzeIconStyle(svgContent: string): 'filled' | 'outlined' {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const paths = doc.querySelectorAll('path');

  for (const path of Array.from(paths)) {
    const fillRule = path.getAttribute('fill-rule');
    const fill = path.getAttribute('fill');
    const stroke = path.getAttribute('stroke');
    const d = path.getAttribute('d') || '';

    // Filled icons typically have:
    // - fill-rule attribute (evenodd or nonzero)
    // - Complex paths with many segments
    // - No stroke attribute

    if (fillRule && fillRule !== 'none') {
      return 'filled';
    }

    if (fill && fill !== 'none' && !stroke) {
      // Count path segments
      const segments = d.split(/[MLHVCSQTAZmlhvcsqtaz]/).filter(Boolean);
      if (segments.length > 3) {
        return 'filled';
      }
    }

    // Outlined icons typically have:
    // - stroke attribute
    // - Simpler paths
    if (stroke && stroke !== 'none') {
      return 'outlined';
    }
  }

  // Default to outlined if unclear
  return 'outlined';
}

/**
 * Load manual overrides from localStorage
 */
export function loadManualOverrides(): Record<string, { isUnfilled?: boolean; hasMajorChange?: boolean }> {
  try {
    const stored = localStorage.getItem('icon-comparison-overrides');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save manual overrides to localStorage
 */
export function saveManualOverrides(overrides: Record<string, { isUnfilled?: boolean; hasMajorChange?: boolean }>): void {
  try {
    localStorage.setItem('icon-comparison-overrides', JSON.stringify(overrides));
  } catch (error) {
    console.error('Failed to save overrides:', error);
  }
}

/**
 * Export tagged icons as JSON
 */
export function exportTaggedIcons(icons: Array<{ name: string; isUnfilled: boolean; hasMajorChange: boolean; isManuallyTagged: boolean }>) {
  const taggedIcons = icons
    .filter(icon => icon.isUnfilled || icon.hasMajorChange)
    .map(icon => ({
      name: icon.name,
      filledToUnfilled: icon.isUnfilled,
      majorChange: icon.hasMajorChange,
      tags: [
        icon.isUnfilled ? 'filled→unfilled' : null,
        icon.hasMajorChange ? 'major-change' : null
      ].filter(Boolean)
    }));

  const dataStr = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalIcons: icons.length,
    taggedCount: taggedIcons.length,
    filledToUnfilledCount: icons.filter(i => i.isUnfilled).length,
    majorChangeCount: icons.filter(i => i.hasMajorChange).length,
    taggedIcons
  }, null, 2);

  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `icon-tags-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Export tagged icons as CSV
 */
export function exportTaggedIconsCSV(icons: Array<{ name: string; isUnfilled: boolean; hasMajorChange: boolean; isManuallyTagged: boolean }>) {
  const taggedIcons = icons.filter(icon => icon.isUnfilled || icon.hasMajorChange);

  const csvContent = [
    ['Icon Name', 'Filled→Unfilled', 'Major Change', 'Tags'].join(','),
    ...taggedIcons.map(icon => {
      const tags = [
        icon.isUnfilled ? 'filled→unfilled' : null,
        icon.hasMajorChange ? 'major-change' : null
      ].filter(Boolean).join('; ');
      return [
        icon.name,
        icon.isUnfilled ? 'Yes' : 'No',
        icon.hasMajorChange ? 'Yes' : 'No',
        tags
      ].join(',');
    })
  ].join('\n');

  const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  const exportFileDefaultName = `icon-tags-${new Date().toISOString().split('T')[0]}.csv`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Export interactive HTML report with ALL icons (tagged and untagged)
 */
export function exportHTMLReport(icons: Array<{ name: string; displayName?: string; oldIcon?: string; newIconSvg?: string; isUnfilled: boolean; hasMajorChange: boolean; newName?: string }>) {
  // Use the new interactive HTML export
  exportInteractiveHTMLReport(icons);
}

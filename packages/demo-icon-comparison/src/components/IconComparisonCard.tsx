import React, { useState } from 'react';
import { Tag } from '@blueprintjs/core';
import styles from '../styles.module.scss';

interface IconComparisonCardProps {
  iconName: string;
  displayName?: string;
  oldIconSvg: string | null;
  newIconSvg: string | null;
  isUnfilled: boolean;
  hasMajorChange: boolean;
  isManuallyTagged: boolean;
  newName?: string;
  onToggleUnfilled: () => void;
  onToggleMajorChange: () => void;
  onRename: (newName: string) => void;
}

export const IconComparisonCard: React.FC<IconComparisonCardProps> = ({
  iconName,
  displayName,
  oldIconSvg,
  newIconSvg,
  isUnfilled,
  hasMajorChange,
  isManuallyTagged,
  newName,
  onToggleUnfilled,
  onToggleMajorChange,
  onRename,
}) => {
  const [renameValue, setRenameValue] = useState(newName || '');

  const handleRenameBlur = () => {
    if (renameValue !== (newName || '')) {
      onRename(renameValue);
    }
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename(renameValue);
    }
  };

  return (
    <article className={styles.card}>
      {/* Card Header with Tags */}
      <div className={styles.cardHeader}>
        <div className={styles.tagList}>
          {/* Outline Change Tag */}
          {isUnfilled ? (
            <span className={`${styles.tag} ${styles.tagOutline} ${styles.tagActive}`}>
              <span className={`${styles.filterDot} ${styles.dotAmber}`}></span>
              Outline Change
              <button
                className={styles.tagRemove}
                onClick={onToggleUnfilled}
                aria-label="Remove outline change tag"
              >
                ×
              </button>
            </span>
          ) : (
            <span
              className={`${styles.tag} ${styles.tagOutline} ${styles.tagInactive}`}
              onClick={onToggleUnfilled}
            >
              <span className={`${styles.filterDot} ${styles.dotAmber}`}></span>
              Outline Change
            </span>
          )}

          {/* Major Design Change Tag */}
          {hasMajorChange ? (
            <span className={`${styles.tag} ${styles.tagDesign} ${styles.tagActive}`}>
              <span className={`${styles.filterDot} ${styles.dotViolet}`}></span>
              Design Change
              <button
                className={styles.tagRemove}
                onClick={onToggleMajorChange}
                aria-label="Remove design change tag"
              >
                ×
              </button>
            </span>
          ) : (
            <span
              className={`${styles.tag} ${styles.tagDesign} ${styles.tagInactive}`}
              onClick={onToggleMajorChange}
            >
              <span className={`${styles.filterDot} ${styles.dotViolet}`}></span>
              Design Change
            </span>
          )}
        </div>
      </div>

      {/* Icon Comparison Area */}
      <div className={styles.comparisonArea}>
        <div className={styles.vsBadge}>VS</div>

        {/* Current Icon */}
        <div className={styles.iconColumn}>
          <div className={styles.iconBox}>
            {oldIconSvg ? (
              <div dangerouslySetInnerHTML={{ __html: oldIconSvg }} />
            ) : (
              <svg viewBox="0 0 24 24" width="32" height="32">
                <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.2" />
              </svg>
            )}
          </div>
          <div className={styles.labelGroup}>
            <span className={styles.versionLabel}>Current</span>
            <div className={styles.iconName}>{iconName}</div>
          </div>
        </div>

        {/* New Icon */}
        <div className={styles.iconColumn}>
          <div className={styles.iconBox}>
            {newIconSvg ? (
              <div dangerouslySetInnerHTML={{ __html: newIconSvg }} />
            ) : (
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <div className={styles.labelGroup}>
            <span className={styles.versionLabel}>New</span>
            <input
              type="text"
              className={styles.iconNameInput}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameBlur}
              onKeyPress={handleRenameKeyPress}
              placeholder={iconName}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * Export interactive HTML report with ALL icons (tagged and untagged) with JavaScript filtering
 */
export function exportInteractiveHTMLReport(icons: Array<{
  name: string;
  displayName?: string;
  oldIcon?: string;
  newIconSvg?: string;
  isUnfilled: boolean;
  hasMajorChange: boolean;
  newName?: string;
}>) {
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Prepare icons data as JSON for embedding
  const iconsData = icons.map(icon => ({
    name: icon.name,
    displayName: icon.displayName || icon.name,
    oldIconSvg: icon.oldIcon || '',
    newIconSvg: icon.newIconSvg || '',
    isUnfilled: icon.isUnfilled,
    hasMajorChange: icon.hasMajorChange,
    hasTag: icon.isUnfilled || icon.hasMajorChange,
  }));

  const totalCount = icons.length;
  const taggedCount = icons.filter(i => i.isUnfilled || i.hasMajorChange).length;
  const untaggedCount = icons.filter(i => !i.isUnfilled && !i.hasMajorChange).length;
  const unfilledCount = icons.filter(i => i.isUnfilled).length;
  const majorChangeCount = icons.filter(i => i.hasMajorChange).length;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blueprint Icon Comparison Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --color-blue: #2d72d2;
      --color-indigo: #5642a6;
      --color-gray: #5f6b7c;
      --color-amber: #d99e0b;
      --color-bg-app: #f6f7f9;
      --color-bg-card: #ffffff;
      --color-border: #d3d8de;
      --color-text-primary: #1c2127;
      --color-text-muted: #5f6b7c;
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;
      --spacing-xl: 20px;
      --spacing-2xl: 24px;
      --spacing-3xl: 32px;
      --radius-sm: 3px;
      --radius-md: 6px;
      --radius-lg: 12px;
      --radius-pill: 999px;
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-medium: 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      background-color: var(--color-bg-app);
      color: var(--color-text-primary);
      font-size: 14px;
      line-height: 1.28581;
      letter-spacing: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-3xl);
    }

    .header {
      background: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-lg) var(--spacing-3xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .app-logo {
      width: 32px;
      height: 32px;
      color: var(--color-blue);
      flex-shrink: 0;
    }

    .header-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0;
      color: var(--color-text-primary);
    }

    .subtitle {
      font-size: 12px;
      color: var(--color-text-muted);
    }

    .filter-bar {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      padding: var(--spacing-lg) var(--spacing-3xl);
      display: flex;
      gap: var(--spacing-lg);
      justify-content: space-between;
      align-items: center;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--spacing-3xl);
    }

    .filter-chips {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .search-input {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-family: inherit;
      color: var(--color-text-primary);
      background: var(--color-bg-card);
      width: 240px;
      transition: all var(--transition-fast);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-blue);
      box-shadow: 0 0 0 1px var(--color-blue);
    }

    .search-input::placeholder {
      color: var(--color-text-muted);
      opacity: 0.6;
    }

    .filter-chip {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-pill);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all var(--transition-medium);
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: transparent;
      color: var(--color-text-primary);
    }

    .filter-chip:hover {
      background: rgba(211, 216, 222, 0.3);
    }

    .filter-chip.chip-all {
      background: rgba(45, 114, 210, 0.1);
      border-color: rgba(45, 114, 210, 0.2);
    }

    .filter-chip.chip-blue {
      background: rgba(45, 114, 210, 0.1);
      border-color: rgba(45, 114, 210, 0.2);
    }

    .filter-chip.chip-gray {
      background: rgba(95, 107, 124, 0.1);
      border-color: rgba(95, 107, 124, 0.2);
    }

    .filter-chip.chip-amber {
      background: rgba(217, 158, 11, 0.1);
      border-color: rgba(217, 158, 11, 0.2);
    }

    .filter-chip.chip-indigo {
      background: rgba(86, 66, 166, 0.1);
      border-color: rgba(86, 66, 166, 0.2);
    }

    .count-badge {
      font-size: 14px;
      font-weight: 400;
      color: currentColor;
      opacity: 0.6;
    }

    .filter-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .dot-blue {
      background: var(--color-blue);
    }

    .dot-gray {
      background: var(--color-gray);
    }

    .dot-amber {
      background: var(--color-amber);
    }

    .dot-indigo {
      background: var(--color-indigo);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .card {
      background-color: var(--color-bg-card);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      border: 1px solid var(--color-border);
      transition: all var(--transition-fast);
    }

    .card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-height: 24px;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-pill);
      font-size: 11px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .tag-outline {
      background-color: rgba(217, 158, 11, 0.2);
      border: 1px solid rgba(217, 158, 11, 0.3);
    }

    .tag-design {
      background-color: rgba(86, 66, 166, 0.2);
      border: 1px solid rgba(86, 66, 166, 0.3);
    }

    .comparison-area {
      display: flex;
      align-items: stretch;
      gap: var(--spacing-sm);
      position: relative;
    }

    .vs-badge {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--color-text-primary);
      color: #ffffff;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 500;
      font-style: italic;
      z-index: 10;
      border: 2px solid var(--color-bg-card);
    }

    .icon-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      min-width: 0;
    }

    .icon-box {
      background-color: var(--color-bg-app);
      border-radius: var(--radius-md);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg);
    }

    .icon-box svg {
      width: 32px;
      height: 32px;
      fill: var(--color-text-primary);
    }

    .label-group {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .version-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      color: var(--color-text-primary);
      opacity: 0.4;
    }

    .icon-name {
      font-size: 14px;
      font-weight: 400;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-results {
      background: white;
      padding: 48px;
      border-radius: var(--radius-lg);
      text-align: center;
      color: var(--color-text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .no-results-icon {
      width: 64px;
      height: 64px;
      color: var(--color-text-muted);
      opacity: 0.3;
    }

    .no-results h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .no-results p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 1200px) {
      .icon-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .icon-grid {
        grid-template-columns: 1fr;
      }
      .header, .filter-bar, .container {
        padding-left: var(--spacing-lg);
        padding-right: var(--spacing-lg);
      }
    }

    @media print {
      body { background: white; padding: 0; }
      .filter-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="currentColor"
        class="app-logo"
      >
        <path d="M17 14.5C17 14.2033 17.088 13.9133 17.2528 13.6666C17.4176 13.42 17.6519 13.2277 17.926 13.1142C18.2001 13.0006 18.5017 12.9709 18.7926 13.0288C19.0836 13.0867 19.3509 13.2296 19.5607 13.4393C19.7704 13.6491 19.9133 13.9164 19.9712 14.2074C20.0291 14.4983 19.9993 14.7999 19.8858 15.074C19.7723 15.3481 19.58 15.5824 19.3334 15.7472C19.0867 15.912 18.7967 16 18.5 16C18.1022 16 17.7206 15.842 17.4393 15.5607C17.158 15.2794 17 14.8978 17 14.5ZM30 7.5C29.9997 8.16677 29.809 8.81958 29.4502 9.38161C29.0915 9.94364 28.5797 10.3915 27.975 10.6725C27.8019 13.2011 26.6761 15.57 24.8248 17.3011C22.9736 19.0322 20.5346 19.9967 18 20H14C13.6022 20 13.2206 20.158 12.9393 20.4393C12.658 20.7206 12.5 21.1022 12.5 21.5C12.5 21.8978 12.658 22.2794 12.9393 22.5607C13.2206 22.842 13.6022 23 14 23H21C21.2652 23 21.5196 23.1054 21.7071 23.2929C21.8946 23.4804 22 23.7348 22 24C22 24.2652 21.8946 24.5196 21.7071 24.7071C21.5196 24.8946 21.2652 25 21 25H15V27H19C19.2652 27 19.5196 27.1054 19.7071 27.2929C19.8946 27.4804 20 27.7348 20 28C20 28.2652 19.8946 28.5196 19.7071 28.7071C19.5196 28.8946 19.2652 29 19 29H12C9.34784 29 6.8043 27.9464 4.92893 26.0711C3.05357 24.1957 2 21.6522 2 19C2 16.3478 3.05357 13.8043 4.92893 11.9289C6.8043 10.0536 9.34784 9 12 9H26.5C26.8978 9 27.2794 8.84196 27.5607 8.56066C27.842 8.27936 28 7.89782 28 7.5C28 7.10218 27.842 6.72064 27.5607 6.43934C27.2794 6.15804 26.8978 6 26.5 6H16C15.2044 6 14.4413 5.68393 13.8787 5.12132C13.3161 4.55871 13 3.79565 13 3C13 2.73478 13.1054 2.48043 13.2929 2.29289C13.4804 2.10536 13.7348 2 14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 15.1054 3.51957 15.2929 3.70711C15.4804 3.89464 15.7348 4 16 4H26.5C27.4283 4 28.3185 4.36875 28.9749 5.02513C29.6313 5.6815 30 6.57174 30 7.5ZM10.715 22.775C10.6387 22.6681 10.542 22.5774 10.4306 22.5078C10.3192 22.4383 10.1952 22.3914 10.0657 22.3698C9.93612 22.3482 9.80359 22.3524 9.67565 22.382C9.54771 22.4116 9.42686 22.4662 9.32 22.5425L7.4 23.9175C7.19748 24.0765 7.0641 24.3075 7.02763 24.5624C6.99116 24.8173 7.05443 25.0764 7.20424 25.2859C7.35406 25.4953 7.57888 25.6388 7.83189 25.6866C8.0849 25.7344 8.3466 25.6828 8.5625 25.5425L10.4825 24.1675C10.6976 24.0134 10.8429 23.7803 10.8864 23.5193C10.93 23.2583 10.8684 22.9906 10.715 22.775ZM10.5275 18.3225L5.69375 16.125C5.57368 16.0665 5.4431 16.0326 5.30973 16.0254C5.17636 16.0182 5.0429 16.0378 4.91722 16.083C4.79154 16.1282 4.67619 16.1981 4.57798 16.2887C4.47977 16.3792 4.40069 16.4885 4.3454 16.6101C4.29012 16.7317 4.25976 16.8631 4.2561 16.9966C4.25245 17.1301 4.27558 17.263 4.32413 17.3874C4.37267 17.5119 4.44566 17.6253 4.53877 17.7211C4.63188 17.8168 4.74323 17.893 4.86625 17.945L9.7 20.1437C9.81974 20.1979 9.94898 20.228 10.0803 20.2321C10.2117 20.2363 10.3426 20.2146 10.4655 20.1681C10.5885 20.1217 10.701 20.0515 10.7968 19.9615C10.8926 19.8715 10.9697 19.7635 11.0238 19.6437C11.1326 19.4027 11.1415 19.1283 11.0485 18.8806C10.9555 18.633 10.7681 18.4323 10.5275 18.3225ZM25.9375 11H15V18H18C19.9479 17.9976 21.8282 17.2857 23.2892 15.9973C24.7501 14.7089 25.6916 12.9323 25.9375 11Z"/>
      </svg>
      <div class="header-text">
        <h1>Blueprint Icon Comparison Report</h1>
        <div class="subtitle">Generated: ${formatDate()} • Interactive Report</div>
      </div>
    </div>
  </div>

  <div class="filter-bar">
    <div class="filter-chips">
      <div class="filter-chip chip-all" data-filter="all" onclick="setFilter('all')">
        All Comparisons <span class="count-badge">(${totalCount})</span>
      </div>
      <div class="filter-chip" data-filter="tagged" onclick="setFilter('tagged')">
        <span class="filter-dot dot-blue"></span>
        Tagged <span class="count-badge">(${taggedCount})</span>
      </div>
      <div class="filter-chip" data-filter="untagged" onclick="setFilter('untagged')">
        <span class="filter-dot dot-gray"></span>
        Untagged <span class="count-badge">(${untaggedCount})</span>
      </div>
      <div class="filter-chip" data-filter="outline" onclick="setFilter('outline')">
        <span class="filter-dot dot-amber"></span>
        Outline Change <span class="count-badge">(${unfilledCount})</span>
      </div>
      <div class="filter-chip" data-filter="design" onclick="setFilter('design')">
        <span class="filter-dot dot-indigo"></span>
        Major Design Change <span class="count-badge">(${majorChangeCount})</span>
      </div>
    </div>
    <input
      type="text"
      class="search-input"
      id="searchInput"
      placeholder="Search icons..."
      oninput="handleSearch()"
    />
  </div>

  <div class="content-wrapper">
    <div id="iconGrid" class="icon-grid"></div>
    <div id="noResults" class="no-results" style="display: none;">
      <svg
        class="no-results-icon"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M17 14.5C17 14.2033 17.088 13.9133 17.2528 13.6666C17.4176 13.42 17.6519 13.2277 17.926 13.1142C18.2001 13.0006 18.5017 12.9709 18.7926 13.0288C19.0836 13.0867 19.3509 13.2296 19.5607 13.4393C19.7704 13.6491 19.9133 13.9164 19.9712 14.2074C20.0291 14.4983 19.9993 14.7999 19.8858 15.074C19.7723 15.3481 19.58 15.5824 19.3334 15.7472C19.0867 15.912 18.7967 16 18.5 16C18.1022 16 17.7206 15.842 17.4393 15.5607C17.158 15.2794 17 14.8978 17 14.5ZM30 7.5C29.9997 8.16677 29.809 8.81958 29.4502 9.38161C29.0915 9.94364 28.5797 10.3915 27.975 10.6725C27.8019 13.2011 26.6761 15.57 24.8248 17.3011C22.9736 19.0322 20.5346 19.9967 18 20H14C13.6022 20 13.2206 20.158 12.9393 20.4393C12.658 20.7206 12.5 21.1022 12.5 21.5C12.5 21.8978 12.658 22.2794 12.9393 22.5607C13.2206 22.842 13.6022 23 14 23H21C21.2652 23 21.5196 23.1054 21.7071 23.2929C21.8946 23.4804 22 23.7348 22 24C22 24.2652 21.8946 24.5196 21.7071 24.7071C21.5196 24.8946 21.2652 25 21 25H15V27H19C19.2652 27 19.5196 27.1054 19.7071 27.2929C19.8946 27.4804 20 27.7348 20 28C20 28.2652 19.8946 28.5196 19.7071 28.7071C19.5196 28.8946 19.2652 29 19 29H12C9.34784 29 6.8043 27.9464 4.92893 26.0711C3.05357 24.1957 2 21.6522 2 19C2 16.3478 3.05357 13.8043 4.92893 11.9289C6.8043 10.0536 9.34784 9 12 9H26.5C26.8978 9 27.2794 8.84196 27.5607 8.56066C27.842 8.27936 28 7.89782 28 7.5C28 7.10218 27.842 6.72064 27.5607 6.43934C27.2794 6.15804 26.8978 6 26.5 6H16C15.2044 6 14.4413 5.68393 13.8787 5.12132C13.3161 4.55871 13 3.79565 13 3C13 2.73478 13.1054 2.48043 13.2929 2.29289C13.4804 2.10536 13.7348 2 14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 15.1054 3.51957 15.2929 3.70711C15.4804 3.89464 15.7348 4 16 4H26.5C27.4283 4 28.3185 4.36875 28.9749 5.02513C29.6313 5.6815 30 6.57174 30 7.5ZM10.715 22.775C10.6387 22.6681 10.542 22.5774 10.4306 22.5078C10.3192 22.4383 10.1952 22.3914 10.0657 22.3698C9.93612 22.3482 9.80359 22.3524 9.67565 22.382C9.54771 22.4116 9.42686 22.4662 9.32 22.5425L7.4 23.9175C7.19748 24.0765 7.0641 24.3075 7.02763 24.5624C6.99116 24.8173 7.05443 25.0764 7.20424 25.2859C7.35406 25.4953 7.57888 25.6388 7.83189 25.6866C8.0849 25.7344 8.3466 25.6828 8.5625 25.5425L10.4825 24.1675C10.6976 24.0134 10.8429 23.7803 10.8864 23.5193C10.93 23.2583 10.8684 22.9906 10.715 22.775ZM10.5275 18.3225L5.69375 16.125C5.57368 16.0665 5.4431 16.0326 5.30973 16.0254C5.17636 16.0182 5.0429 16.0378 4.91722 16.083C4.79154 16.1282 4.67619 16.1981 4.57798 16.2887C4.47977 16.3792 4.40069 16.4885 4.3454 16.6101C4.29012 16.7317 4.25976 16.8631 4.2561 16.9966C4.25245 17.1301 4.27558 17.263 4.32413 17.3874C4.37267 17.5119 4.44566 17.6253 4.53877 17.7211C4.63188 17.8168 4.74323 17.893 4.86625 17.945L9.7 20.1437C9.81974 20.1979 9.94898 20.228 10.0803 20.2321C10.2117 20.2363 10.3426 20.2146 10.4655 20.1681C10.5885 20.1217 10.701 20.0515 10.7968 19.9615C10.8926 19.8715 10.9697 19.7635 11.0238 19.6437C11.1326 19.4027 11.1415 19.1283 11.0485 18.8806C10.9555 18.633 10.7681 18.4323 10.5275 18.3225ZM25.9375 11H15V18H18C19.9479 17.9976 21.8282 17.2857 23.2892 15.9973C24.7501 14.7089 25.6916 12.9323 25.9375 11Z"/>
      </svg>
      <h3>No icons found</h3>
      <p>Try adjusting your filters</p>
    </div>
  </div>

  <script>
    // Embed all icons data
    const allIcons = ${JSON.stringify(iconsData)};
    let currentFilter = 'all';
    let searchQuery = '';

    // Create icon card HTML
    function createIconCard(icon) {
      const tags = [];
      if (icon.isUnfilled) {
        tags.push('<span class="tag tag-outline"><span class="filter-dot dot-amber"></span> Outline Change</span>');
      }
      if (icon.hasMajorChange) {
        tags.push('<span class="tag tag-design"><span class="filter-dot dot-indigo"></span> Major Design Change</span>');
      }

      return \`
        <div class="card">
          <div class="card-header">
            <div class="tag-list">
              \${tags.join('')}
            </div>
          </div>
          <div class="comparison-area">
            <div class="vs-badge">VS</div>
            <div class="icon-column">
              <div class="icon-box">\${icon.oldIconSvg || ''}</div>
              <div class="label-group">
                <div class="version-label">Current</div>
                <div class="icon-name">\${icon.name}</div>
              </div>
            </div>
            <div class="icon-column">
              <div class="icon-box">\${icon.newIconSvg || ''}</div>
              <div class="label-group">
                <div class="version-label">New</div>
                <div class="icon-name">\${icon.name}</div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // Filter icons
    function filterIcons() {
      let filtered = allIcons;

      // Apply tag filter
      if (currentFilter === 'tagged') {
        filtered = filtered.filter(icon => icon.isUnfilled || icon.hasMajorChange);
      } else if (currentFilter === 'untagged') {
        filtered = filtered.filter(icon => !icon.isUnfilled && !icon.hasMajorChange);
      } else if (currentFilter === 'outline') {
        filtered = filtered.filter(icon => icon.isUnfilled);
      } else if (currentFilter === 'design') {
        filtered = filtered.filter(icon => icon.hasMajorChange);
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(icon =>
          icon.name.toLowerCase().includes(query) ||
          icon.displayName.toLowerCase().includes(query)
        );
      }

      return filtered;
    }

    // Render icons
    function renderIcons() {
      const filtered = filterIcons();
      const grid = document.getElementById('iconGrid');
      const noResults = document.getElementById('noResults');

      if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'flex';
      } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
        grid.innerHTML = filtered.map(createIconCard).join('');
      }
    }

    // Set filter
    function setFilter(filter) {
      currentFilter = filter;

      // Update active state
      document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('chip-all', 'chip-blue', 'chip-gray', 'chip-amber', 'chip-indigo');
      });

      const activeChip = document.querySelector(\`[data-filter="\${filter}"]\`);
      if (filter === 'all') {
        activeChip.classList.add('chip-all');
      } else if (filter === 'tagged') {
        activeChip.classList.add('chip-blue');
      } else if (filter === 'untagged') {
        activeChip.classList.add('chip-gray');
      } else if (filter === 'outline') {
        activeChip.classList.add('chip-amber');
      } else if (filter === 'design') {
        activeChip.classList.add('chip-indigo');
      }

      renderIcons();
    }

    // Handle search input
    function handleSearch() {
      searchQuery = document.getElementById('searchInput').value;
      renderIcons();
    }

    // Initial render
    renderIcons();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const exportFileDefaultName = `icon-comparison-${new Date().toISOString().split('T')[0]}.html`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();

  // Clean up the object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

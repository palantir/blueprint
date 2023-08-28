#!/bin/bash

function usage() {
    cat << EOF

Blueprint 2.0.0 Upgrade Script

Usage

    $0 [--path=path] [--include=glob] [--exclude=glob] [--prefix=regexp]

Description

    This script finds instances of various renamed methods and properties and
    replaces them in place. This includes renames for React props, css classes,
    and enum constants.

Options

    -h,--help

        Display this message and exit.

    --path=.

        The path where the recursive search begins, relative to the current
        working directory.

    --include=*.{ts,tsx,scss,less}

        A glob string to match specific file extensions in the search path.

    --exclude={dist,build,coverage,node_modules}

        A glob string to omit specific directories from the search path.

    --prefix=(?!(?<=public )|(?<=protected )|(?<=abstract )|(?<=private )|(?<=this\.))

        A regexp prefix for each find/replace prop string. The default includes
        groups of non-capturing negative lookbehinds. This helps limit the
        renames to props and not class methods. If you are applying this script
        to files other than typescript (e.g. markdown), you should probably set
        this to ''.

EOF
}

# Arguments
for i in "$@" ; do
    case $i in
        --path=*)
        SEARCH_PATH="${i#*=}"
        shift
        ;;
        --include=*)
        INCLUDE_GLOB="${i#*=}"
        shift
        ;;
        --exclude=*)
        EXCLUDE_GLOB="${i#*=}"
        shift
        ;;
        --prefix=*)
        PREFIX="${i#*=}"
        shift
        ;;
        -h|--help)
        usage
        exit 1
        ;;
        *)
        ;;
    esac
done

# Default argument values
SEARCH_PATH=${SEARCH_PATH:-'.'}
INCLUDE_GLOB=${INCLUDE_GLOB:-'*.{ts,tsx,scss,less}'}
EXCLUDE_GLOB=${EXCLUDE_GLOB:-'{dist,build,node_modules}'}
PREFIX=${PREFIX:-'(?!(?<=public )|(?<=protected )|(?<=abstract )|(?<=private )|(?<=this\.))'}

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RESET='\033[0m'

function matchingFiles() {
    # Find all files containing regexp. Use grep's glob syntax for
    # include/exclude paths. Use perl's regexp syntax.
    cmd="grep \
        --recursive \
        --files-with-matches \
        --include=$INCLUDE_GLOB \
        --exclude-dir=$EXCLUDE_GLOB \
        . \
        ${SEARCH_PATH} \
        | xargs perl -lne 'if (/$1/) { print \$ARGV; close ARGV }'
    "
    echo "$(eval $cmd)"
}

function rename() {
    # Name parameters
    fromString=$1
    toString=$2
    findRegexp=${3:-$fromString}
    files=$(matchingFiles "$findRegexp")

    if [[ -z ${files// } ]]; then
        echo -e "No files contain ${BLUE}${fromString}${RESET}"
    else
        count=$(echo "$files" | wc -l | awk '{print $1}')
        echo -e "Renaming ${BLUE}${fromString}${RESET} -> ${GREEN}${toString}${RESET} in ${BLUE}${count}${RESET} files"

        # Iterate and search&replace
        echo "$files" | while read -r file ; do
            echo -n "$file ... "

            # Search&replace in place with perl
            perl -p -i -e "s/$findRegexp/$toString/g" "$file"
            echo -e "${GREEN}done${RESET}"
        done
    fi
}

function warn() {
    # Name parameters
    fromString=$1
    toString=$2
    findRegexp=${3:-$fromString}
    files=$(matchingFiles "$findRegexp")

    if [[ -z ${files// } ]]; then
        echo -e "No files contain ${BLUE}${fromString}${RESET}"
    else
        count=$(echo "$files" | wc -l | awk '{print $1}')
        echo ""
        echo -e "${RED}WARNING: Skipping ${BLUE}${fromString}${RESET} -> ${GREEN}${toString}${RESET}"
        echo -e "${RED}Can't safely change ${BLUE}${fromString}${RED}, you'll need to manually rename/remove this string.${RESET}"
        echo -e "${RED}It was found in these files ${BLUE}${count}${RED} files:${RESET}"
        echo "$files"
    fi
}

function renameProp() {
    # Add prefix and word boundaries to search string
    rename $1 $2 "$PREFIX\\b$1\\b"
}

function warnProp() {
    warn $1 $2 "$PREFIX\\b$1\\b"
}

function renamePartialClass() {
    # Don't add word boundary so that partial css classnames rename
    rename $1 $2 "\\b$1"
}

function renameString() {
    # Add simple word boundaries
    rename $1 $2 "\\b$1\\b"
}

echo "

Renames for @blueprintjs/table"
renameProp allowMultipleSelection enableMultipleSelection
renameProp fillBodyWithGhostCells enableGhostCells
renameProp isColumnReorderable enableColumnReordering
renameProp isColumnResizable enableColumnResizing
renameProp isRowHeaderShown enableRowHeader
renameProp isRowReorderable enableRowReordering
renameProp isRowResizable enableRowResizing
renameProp renderBody bodyRenderer
renameProp renderBodyContextMenu bodyContextMenuRenderer
renameProp renderCell cellRenderer
renameProp renderColumnHeader columnHeaderCellRenderer
renameProp renderGhostCell ghostCellRenderer
renameProp renderHeaderCell headerCellRenderer
renameProp renderRowHeader rowHeaderCellRenderer
renameProp renderName nameRenderer
renameProp useInteractionBar enableColumnInteractionBar
renamePartialClass bp-table- pt-table-
renameProp "(?<!_)TABLE_STRIPED" HTML_TABLE_STRIPED
renameProp "(?<!_)TABLE_BORDERED" HTML_TABLE_BORDERED
renameString Classes.TABLE Classes.HTML_TABLE
renameString "pt-striped(?!-)" pt-html-table-striped
renameString "pt-bordered(?!-)" pt-html-table-bordered
renameString "pt-table(?!-)" pt-html-table
warnProp enableFocus enableFocusedCell
warnProp onFocus onFocusedCell
warnProp renderMenu menuRenderer

echo "

Renames for @blueprintjs/core"
renameProp renderVisibleItem visibleItemRenderer
renameProp renderLabel labelRenderer
renameProp isDisabled disabled
renameProp isModal hasBackdrop
renameProp leftIconName leftIcon
renameProp rightIconName rightIcon
renameProp iconName icon
renameString "icon=\{IconClasses" "icon={IconNames" # prop usage (previous line renames icon prop)
renameString "visual=\{IconClasses" "visual={IconNames" # NonIdealState prop usage (previous line renames icon prop)
warn IconClasses "Classes.iconClass(IconName.SOME_ICON)"  # assuming user wanted class name
renameString FileUpload FileInput
renameString fileUpload fileInput
renameString "pt-file-upload(?!-)" pt-file-input # only rename full classname, not partial classname like pt-file-upload-input
renameString FILE_UPLOAD FILE_INPUT
renameString pt-condensed pt-small
renameString TABLE_CONDENSED SMALL
renameString Popover Popover
renameString Tooltip2 Tooltip
renameString Tabs2 Tabs
renameString Omnibox Omnibar
warnProp inline usePortal

echo "

Removed props"
warnProp submenuViewportMargins REMOVED
warnProp useSmartPositioning REMOVED
warnProp popoverPosition REMOVED

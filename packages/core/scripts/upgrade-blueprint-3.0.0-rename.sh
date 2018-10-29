#!/bin/bash

DEFAULT_INCLUDE='*.{ts,tsx,scss,less}'
DEFAULT_EXCLUDE='{dist,build,node_modules}'
DEFAULT_PREFIX='(?!(?<=public )|(?<=protected )|(?<=abstract )|(?<=private )|(?<=this\.)|(?<=-))'

function usage() {
    cat << EOF

Blueprint 3.0.0 Upgrade Script

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

    --include=$DEFAULT_INCLUDE

        A glob string to match specific file extensions in the search path.

    --exclude=$DEFAULT_EXCLUDE

        A glob string to omit specific directories from the search path.

    --prefix=$DEFAULT_PREFIX

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
INCLUDE_GLOB=${INCLUDE_GLOB:-$DEFAULT_INCLUDE}
EXCLUDE_GLOB=${EXCLUDE_GLOB:-$DEFAULT_EXCLUDE}
PREFIX=${PREFIX:-$DEFAULT_PREFIX}

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
    rename "$1" "$2" "$PREFIX\\b$1\\b"
}

function warnProp() {
    warn "$1" "$2" "$PREFIX\\b$1\\b"
}

function renamePartialClass() {
    # Don't add word boundary so that partial css classnames rename
    rename "$1" "$2" "\\b$1"
}

function renameString() {
    # Add simple word boundaries
    rename "$1" "$2" "\\b$1\\b"
}

echo "
Blueprint 3.0.0 Upgrade Script
"

renameProp visual icon
renameProp didClose onClosed
renameProp didOpen onOpened
renameProp popoverDidClose onClosed
renameProp popoverDidOpen onOpened
renameProp popoverWillClose onClosing
renameProp popoverWillOpen onOpening
rename 'requiredLabel={true}' "labelInfo=\"(required)\""
renameProp requiredLabel labelInfo
renameProp rootElementTag wrapperTagName
renameProp targetElementTag targetTagName
renameProp tooltipClassName popoverClassName

# Classes constants
renameString "Classes\.CALLOUT_TITLE" "Classes.HEADING"
renameString "Classes\.DIALOG_TITLE" "Classes.HEADING"
renameString "Classes\.HOTKEY_GROUP" "Classes.HEADING"
renameString "Classes\.NON_IDEAL_STATE_TITLE" "Classes.HEADING"
renameString "Classes\.UI_TEXT_LARGE" "Classes.UI_TEXT, Classes.TEXT_LARGE"
renameString "Classes\.RUNNING_TEXT" "Classes.RUNNING_TEXT, Classes.TEXT_LARGE"
renameString "Classes\.RUNNING_TEXT_SMALL" "Classes.RUNNING_TEXT"

# Deleted things
renameString "Classes\.TAG_REMOVABLE,?" ''
renameString "Classes\.NON_IDEAL_STATE_(ACTION|DESCRIPTION|ICON),?" ''
renameString "Classes\.SPINNER_SVG_CONTAINER,?" ''
renameString "Classes\.SVG_SPINNER,?" ''
warn SVGSpinner 'DELETED. Spinner now supports usage in an SVG.'
warn SVGPopover 'DELETED. Set *TagName props to SVG elements.'
warn SVGTooltip 'DELETED. Set *TagName props to SVG elements.'
warn "\\bTable\\b" '@blueprintjs/core Table component renamed to HTMLTable (@blueprintjs/table package unchanged).'

# String enums
renameProp CollapseFrom Boundary
renameProp DateRangeBoundary Boundary
renameProp TimePickerPrecision TimePrecision

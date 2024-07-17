/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Button, InputGroup, type InputGroupProps } from "@blueprintjs/core";
import { Cross, Search } from "@blueprintjs/icons";

interface ISelectInputProps {
    placeholder: string | undefined;
    resetQuery: () => void;
    query: string;
    inputProps: InputGroupProps;
    handleInputRef: React.Ref<HTMLInputElement>;
    handleQueryChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const SelectInput: React.FC<ISelectInputProps> = ({
    placeholder,
    resetQuery,
    query,
    inputProps,
    handleInputRef,
    handleQueryChange,
}) => (
    <InputGroup
        aria-autocomplete="list"
        leftIcon={<Search />}
        placeholder={placeholder}
        rightElement={
            query.length > 0 ? (
                <Button
                    aria-label="Clear filter query"
                    icon={<Cross />}
                    minimal={true}
                    onClick={resetQuery}
                    title="Clear filter query"
                />
            ) : undefined
        }
        {...inputProps}
        inputRef={handleInputRef}
        onChange={handleQueryChange}
        value={query}
    />
);

import * as React from "react";

import { ILoadingProps } from "@blueprintjs/select";
import { filterFilm, IFilm, TOP_100_FILMS } from "../films";
import { IExampleProps } from "@blueprintjs/docs-theme";

const MOCK_ASYNC_OPS_DURATION = 500;

export type IAsyncExampleState = ILoadingProps & { items: IFilm[] };

abstract class AsyncExampleReactComponent<S extends IAsyncExampleState> extends React.PureComponent<IExampleProps, S> {
    private mockAsyncOperationTimeout: number = -1;

    public mockAsyncOperation = (query: string) => {
        window.clearTimeout(this.mockAsyncOperationTimeout);

        if (!this.state.loading) {
            this.setState({ loading: true });
        }

        this.mockAsyncOperationTimeout = window.setTimeout(() => {
            this.setState({
                items: TOP_100_FILMS.filter(film => {
                    return filterFilm(query, film, 0, false);
                }),
                loading: false,
            });
        }, MOCK_ASYNC_OPS_DURATION);
    };
}

export { AsyncExampleReactComponent };

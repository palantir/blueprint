/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Locale } from "date-fns";

import { AbstractPureComponent } from "@blueprintjs/core";

import type { DateFnsLocaleProps } from "../common/dateFnsLocaleProps";
import { loadDateFnsLocale } from "../common/dateFnsLocaleUtils";

interface DateFnsLocaleState {
    locale?: Locale | undefined;
}

/**
 * Abstract component which accepts a date-fns locale prop and loads the corresponding `Locale` object as necessary.
 *
 * Currently used by DatePicker3, DateRangePicker3, and DateRangeInput3, but we would ideally migrate to the
 * `useDateFnsLocale()` hook once those components are refactored into functional components.
 */
export abstract class DateFnsLocalizedComponent<
    P extends DateFnsLocaleProps,
    S extends DateFnsLocaleState,
> extends AbstractPureComponent<P, S> {
    // keeping track of `isMounted` state is generally considered an anti-pattern, but since there is no way to
    // cancel/abort dyanmic ES module `import()` calls to load the date-fns locale, this is the best way to avoid
    // setting state on an unmounted component, which creates noise in the console (especially while running tests).
    private isMounted = false;

    // HACKHACK: type fix for setState which does not accept partial state objects in our version of
    // @types/react (v16.14.x)
    public setState<K extends keyof S>(
        nextStateOrAction: ((prevState: S, prevProps: P) => Pick<S, K> | null) | Pick<S, K> | Partial<S> | null,
        callback?: () => void,
    ) {
        if (typeof nextStateOrAction === "function") {
            super.setState(nextStateOrAction, callback);
        } else {
            super.setState(nextStateOrAction as S);
        }
    }

    public async componentDidMount() {
        this.isMounted = true;
        await this.loadLocale(this.props.locale);
    }

    public async componentDidUpdate(prevProps: DateFnsLocaleProps) {
        if (this.props.locale !== prevProps.locale) {
            await this.loadLocale(this.props.locale);
        }
    }

    public componentWillUnmount(): void {
        this.isMounted = false;
    }

    private async loadLocale(localeOrCode: string | Locale | undefined) {
        if (localeOrCode === undefined) {
            return;
        } else if (this.state.locale?.code === localeOrCode) {
            return;
        }

        if (typeof localeOrCode === "string") {
            const loader = this.props.dateFnsLocaleLoader ?? loadDateFnsLocale;
            const locale = await loader(localeOrCode);
            if (this.isMounted) {
                this.setState({ locale });
            }
        } else {
            this.setState({ locale: localeOrCode });
        }
    }
}

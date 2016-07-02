// Type definitions for Angular TableSort
// Project: https://github.com/mattiash/angular-tablesort
// Definitions by: AppRiver, LLC

declare namespace angular.tablesort {
    interface ITableSortConfigProvider {
        /**
         * @description Provide the default function for filtering down items when models change
         * @default A lowercase string match for values defined by the ts-criteria attributes with ts-filter also on them
         */
        filterFunction: (item: any) => boolean;

        /**
         * @description Provide the default template for the filter input.
         * @default ""
         */
        filterTemplate: string;

        /**
         * @description Provide the default template for the pagination elements.
         * @default ""
         */
        paginationTemplate: string;

        /**
         * @description Provide the default options for the number of items to be displayed at a time
         * @default [10, 25, 50, 100]
         */
        perPageOptions: number[];

        /**
         * @description Provide the default number of items per-page to be displayed
         * @default the first item from {{perPageOptions}}
         */
        perPageDefault: number;

        /**
         * @description Provide the default name that describes the things in the table in a singular form
         * @default "item"
         */
        itemNameSingular: string;

        /**
         * @description Provide the default name that describes the things in the table in a plural form
         * @default {{itemNameSingular}} + "s"
         */
        itemNamePlural: string;

        /**
         * @description Provide the default text to show when there is no data to be displayed in the table
         * @default "No {{itemNamePlural}}"
         */
        noDataText: string;

    }
}

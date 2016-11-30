// Type definitions for Angular TableSort
// Project: https://github.com/mattiash/angular-tablesort
// Definitions by: AppRiver, LLC

declare module 'angular-tablesort' {
    export type ITableSortConfigProvider = angular.tablesort.ITableSortConfigProvider;
    export type ITableSortGetDataFunc<T> = angular.tablesort.ITableSortGetDataFunc<T>;
}

declare namespace angular.tablesort {
    export interface ITableSortConfigProvider {
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

        /**
         * @description Provide the default CSS class to be applied to an element that will wrap the `<table>` element only. If left blank, no element will wrap the table.
         * @default ""
         */
        wrappingElementClass: string;

    }

    /**
     * @description Return an array of items currently displayed in the table. Pass in parameters to sort and filter the returned data as needed.
     * @param {boolean} shouldApplySorting - When  true the data will come back in the same sort order as the table is currently displaying.  When false the data will come back in the original sort order (pre-tablesort) 
     * @param {boolean} shouldApplyFiltering - When true the data will only include items that match the current filters, which will match the current table display.  When false all items in the table are included regarless of what is currently being filtered.
     * @param {boolean} limitToCurrentPageOnly - When true and pagination is enabled, the data will only return the currently viewed page of data. When false data from all pages will be returned.
     * @returns {any[]} an array of items that are currently displayed in the table
     */
    export type ITableSortGetDataFunc<T> = (shouldApplySorting?: boolean, shouldApplyFiltering?: boolean, limitToCurrentPageOnly?: boolean) => T[];
}

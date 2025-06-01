import { Cell, Column, ColumnDef, Row, RowData, Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { Input } from "@/components/ui/input";

export type EditedRows = Record<string, EditedCellValue>;

export type EditedCellValue = Record<string, unknown>;  // { [columnId]: value }

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "text" | "range" | "select";
        isDisplay?: boolean

        type?: "text" | "number" | "select"
        isEditable?: boolean
        editModeButton?: ({ cell, value, setValue }: { cell: Cell<TData, TValue>, value: TValue, setValue: (value: TValue) => void }) => React.ReactNode
    }
    interface TableMeta<TData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
        // addEditedValue: (value: EditedCellValue) => void;
        // editedRows?: Record<string, EditedCellValue>

        editMode: boolean
        changedRows?: EditedRows
        setChangedRows?: (changedRows: EditedRows) => void
    }
}

export function useSkipper() {
    const shouldSkipRef = useRef(true);
    const shouldSkip = shouldSkipRef.current;

    const skip = useCallback(() => {
        shouldSkipRef.current = false;
    }, []);

    useEffect(() => {
        shouldSkipRef.current = true;
    });

    return [shouldSkip, skip] as const;
}
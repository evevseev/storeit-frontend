import { ColumnDef, RowData } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import { Input } from "@/components/ui/input";

export type EditedRows = Record<string, EditedCellValue>;

export type EditedCellValue = Record<string, unknown>;

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "text" | "range" | "select";
        isDisplay?: boolean

        type?: "text" | "number" | "select"
        isEditable?: boolean
    }
    interface TableMeta<TData> {
        updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
        addEditedValue: (value: EditedCellValue) => void;
        editedRows: Record<string, EditedCellValue>

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

export const EditableCell = React.memo(function EditableCell(props: any) {
    const { getValue, row: { index }, column: { id }, table } = props;
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
        if (value !== initialValue) {
            table.options.meta?.addEditedValue({
                rowIndex: index,
                columnId: id,
                value,
            });
        }
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return React.createElement(Input, {
        value: value as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
        onBlur: onBlur,
        className: "h-8 px-2 py-1 text-sm",
        type: typeof initialValue === 'number' ? 'number' : 'text'
    });
});

export const defaultColumn: Partial<ColumnDef<any>> = {
    cell: (props) => React.createElement(EditableCell, props),
};

// import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
// import { useEffect, useState, ChangeEvent } from "react";
// import { Input } from "../ui/input";

// interface Option {
//   value: string;
//   label: string;
// }

// export default function TableCell<TData>({
//   getValue,
//   row,
//   column,
//   table,
// }: CellContext<TData, any>) {
//   const initialValue = getValue() as string;
//   const columnMeta = column.columnDef.meta as any;
//   const tableMeta = table.options.meta as any;
//   const [value, setValue] = useState<unknown>(initialValue);

//   useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   const onBlur = () => {
//     tableMeta?.updateData?.(row.index, column.id, value);
//   };

//   const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setValue(e.target.value);
//     tableMeta?.updateData?.(row.index, column.id, e.target.value);
//   };

//   if (tableMeta?.editedRows?.[row.id]) {
//     return columnMeta?.type === "select" ? (
//       <select onChange={onSelectChange} value={initialValue}>
//         {columnMeta?.options?.map((option: Option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     ) : (
//       <Input
//         value={value as string}
//         onChange={(e) => {
//           alert(columnMeta?.type);
//           if (columnMeta?.type === "number") {
//             setValue(Number(e.target.value));
//           } else {
//             setValue(e.target.value);
//           }
//         }}
//         onBlur={onBlur}
//         type={columnMeta?.type || "text"}
//       />
//     );
//   }
//   return <span>{value as string}</span>;
// }

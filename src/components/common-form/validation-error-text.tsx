interface FieldError {
  message: string;
}

interface ValidationErrorTextProps {
  errors: FieldError[];
  position?: "top" | "bottom";
}

export function ValidationErrorText({
  errors,
  position = "bottom",
}: ValidationErrorTextProps) {
  if (errors.length === 0) return null;

  const errorMessage = errors[0].message;
  const isTop = position === "top";

  return (
    <div
      className={`z-10 absolute ${
        isTop ? "-top-2" : "top-11"
      } left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out`}
    >
      <div className="bg-red-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
        {errorMessage}
      </div>
      {isTop && (
        <div className="w-2 h-2 bg-red-500 rotate-45 translate-x-2 -translate-y-1"></div>
      )}
    </div>
  );
}

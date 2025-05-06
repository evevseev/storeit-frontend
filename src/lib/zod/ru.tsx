import z from "zod";

function getRussianPlural(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return many;
  }

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  return many;
}

interface RussianSizable {
  unit: {
    one: string;
    few: string;
    many: string;
  };
  verb: string;
}

const Sizable: Record<string, RussianSizable> = {
  string: {
    unit: {
      one: "символ",
      few: "символа",
      many: "символов",
    },
    verb: "иметь",
  },
  file: {
    unit: {
      one: "байт",
      few: "байта",
      many: "байт",
    },
    verb: "иметь",
  },
  array: {
    unit: {
      one: "элемент",
      few: "элемента",
      many: "элементов",
    },
    verb: "иметь",
  },
  set: {
    unit: {
      one: "элемент",
      few: "элемента",
      many: "элементов",
    },
    verb: "иметь",
  },
};

function getSizing(origin: string): RussianSizable | null {
  return Sizable[origin] ?? null;
}

export const parsedType = (data: any): string => {
  const t = typeof data;

  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "число";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "массив";
      }
      if (data === null) {
        return "null";
      }

      if (
        Object.getPrototypeOf(data) !== Object.prototype &&
        data.constructor
      ) {
        return data.constructor.name;
      }
    }
  }
  return t;
};

const Nouns: {
  [k in z.core.$ZodStringFormats | (string & {})]?: string;
} = {
  regex: "ввод",
  email: "email адрес",
  url: "URL",
  emoji: "эмодзи",
  uuid: "UUID",
  uuidv4: "UUIDv4",
  uuidv6: "UUIDv6",
  nanoid: "nanoid",
  guid: "GUID",
  cuid: "cuid",
  cuid2: "cuid2",
  ulid: "ULID",
  xid: "XID",
  ksuid: "KSUID",
  datetime: "ISO дата и время",
  date: "ISO дата",
  time: "ISO время",
  duration: "ISO длительность",
  ipv4: "IPv4 адрес",
  ipv6: "IPv6 адрес",
  cidrv4: "IPv4 диапазон",
  cidrv6: "IPv6 диапазон",
  base64: "строка в формате base64",
  base64url: "строка в формате base64url",
  json_string: "JSON строка",
  e164: "номер E.164",
  jwt: "JWT",
  template_literal: "ввод",
};

const error: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case "invalid_type":
      return `Ожидается тип ${issue.expected}, не ${parsedType(issue.input)}`;
    case "invalid_value":
      if (issue.values.length === 1)
        return `Должно содержать ${z.core.util.stringifyPrimitive(
          issue.values[0]
        )}`;
      return `Должно содержать одно из значений: ${z.core.util.joinValues(
        issue.values,
        "|"
      )}`;
    case "too_big": {
      const adj = issue.inclusive ? "меньше или равно" : "меньше";
      const sizing = getSizing(issue.origin);
      if (sizing) {
        const maxValue = Number(issue.maximum);
        const unit = getRussianPlural(
          maxValue,
          sizing.unit.one,
          sizing.unit.few,
          sizing.unit.many
        );
        return `Значение должно быть ${adj} ${issue.maximum.toString()} ${unit}`;
      }
      return `Значение должно быть ${adj} ${issue.maximum.toString()}`;
    }
    case "too_small": {
      const adj = issue.inclusive ? "больше или равно" : "больше";
      const sizing = getSizing(issue.origin);
      if (sizing) {
        const minValue = Number(issue.minimum);
        const unit = getRussianPlural(
          minValue,
          sizing.unit.one,
          sizing.unit.few,
          sizing.unit.many
        );
        return `Значение должно быть ${adj} ${issue.minimum.toString()} ${unit}`;
      }
      return `Значение должно быть ${adj} ${issue.minimum.toString()}`;
    }
    case "invalid_format": {
      const _issue = issue as z.core.$ZodStringFormatIssues;
      if (_issue.format === "starts_with")
        return `Значение должно начинаться с "${_issue.prefix}"`;
      if (_issue.format === "ends_with")
        return `Значение должно заканчиваться на "${_issue.suffix}"`;
      if (_issue.format === "includes")
        return `Значение должно содержать "${_issue.includes}"`;
      if (_issue.format === "regex")
        return `Значение должно соответствовать шаблону ${_issue.pattern}`;
      return `Неверный ${Nouns[_issue.format] ?? issue.format}`;
    }
    case "not_multiple_of":
      return `Число должно быть кратным ${issue.divisor}`;
    case "unrecognized_keys":
      return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${
        issue.keys.length > 1 ? "и" : ""
      }: ${z.core.util.joinValues(issue.keys, ", ")}`;
    case "invalid_key":
      return `Неверный ключ в ${issue.origin}`;
    case "invalid_union":
      return "Неверные входные данные";
    case "invalid_element":
      return `Неверное значение в ${issue.origin}`;
    default:
      return `Неверные входные данные`;
  }
};

export { error };

export default function (): { localeError: z.core.$ZodErrorMap } {
  return {
    localeError: error,
  };
}

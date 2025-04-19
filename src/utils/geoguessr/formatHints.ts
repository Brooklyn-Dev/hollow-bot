export const formatHint1 = (text: string): string =>
  text
    .split("")
    .map((char) => (char === " " || char === "'" ? char : "_"))
    .join("");

export const formatHint2 = (text: string): string => {
  let lastChar = " ";
  return text
    .split("")
    .map((char) => {
      if (lastChar === " " || char === " " || char === "'") {
        lastChar = char;
        return char;
      }
      lastChar = char;
      return "_";
    })
    .join("");
};

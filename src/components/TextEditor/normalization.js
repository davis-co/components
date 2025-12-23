export const normalizeWordPlainText = (input = "") => {
  let text = input;

  text = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2028/g, "\n")
    .replace(/\u2029/g, "\n")
    .replace(/\u000b/g, "\n")
    .replace(/\u000c/g, "\n");

  text = text.replace(/\u00ad/g, "").replace(/\u200b/g, "");

  text = text.replace(/^\s*Normal\s+\d+\s*$/gim, "");
  text = text.replace(/^\s*(true|false)(\s+(true|false)){2,}\s*$/gim, "");
  text = text.replace(/^\s*[A-Z]{2}-[A-Z]{2}\s+[A-Z-]+\s+[A-Z-]+\s*$/gim, "");
  text = text.replace(
    /\/\*\s*Style Definitions\s*\*\/[\s\S]*?table\.MsoNormalTable[\s\S]*?\}\s*/gi,
    ""
  );

  text = text.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

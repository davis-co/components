import { FONT_FAMILIES, TOOLBAR_COLORS } from "./constants";
import { normalizeWordPlainText } from "./normalization";

export const mapInlineStyles = (_nodeName, node, currentStyle) => {
  if (!node?.style) return currentStyle;

  let nextStyle = currentStyle;

  const size = node.style.fontSize;
  if (size) {
    const sizeValue = size.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(sizeValue);
    if (!Number.isNaN(parsed)) {
      const pxValue = size.includes("pt")
        ? Math.round(parsed * 1.333)
        : Math.round(parsed);
      nextStyle = nextStyle.add(`fontsize-${pxValue}`);
    }
  }

  const family = node.style.fontFamily;
  if (family) {
    const cleanFamily = family
      .split(",")[0]
      .replace(/['"]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    nextStyle = nextStyle.add(`fontfamily-${cleanFamily}`);
  }

  if (node.style.fontStyle?.toLowerCase() === "italic") {
    nextStyle = nextStyle.add("ITALIC");
  }

  const weight = node.style.fontWeight;
  if (weight && (weight === "bold" || parseInt(weight, 10) >= 600)) {
    nextStyle = nextStyle.add("BOLD");
  }

  const color = node.style.color;
  if (color) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      nextStyle = nextStyle.add(`color-${color}`);
    }
  }

  return nextStyle;
};

export const createEditorStateFromValue = (value, editorUtils) => {
  if (!editorUtils) return null;
  const { EditorState, ContentState, convertFromRaw, htmlToDraft } =
    editorUtils;

  if (!EditorState || !ContentState) return null;

  if (!value) return EditorState.createEmpty();

  try {
    const parsed = JSON.parse(value);
    if (parsed.blocks) {
      return EditorState.createWithContent(convertFromRaw(parsed));
    }
  } catch {}

  try {
    const customBlockFn = (element) => {
      const textAlign = element.style?.textAlign;
      if (textAlign) {
        return {
          data: {
            "text-align": textAlign,
          },
        };
      }
      return null;
    };

    const blocksFromHTML = htmlToDraft(
      value,
      customBlockFn,
      null,
      mapInlineStyles
    );

    if (blocksFromHTML) {
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState);
    }
  } catch (err) {
    console.warn("Failed to parse HTML:", err);
  }

  return EditorState.createEmpty();
};

export const convertEditorStateToHTML = (state, editorUtils) => {
  if (!editorUtils?.stateToHTML) return null;
  return editorUtils.stateToHTML(state.getCurrentContent(), {
    inlineStyleFn: (styles) => {
      const styleArray = styles.toArray();
      const styleObject = {};

      styleArray.forEach((style) => {
        if (style.startsWith("color-")) {
          styleObject.color = style.replace("color-", "");
        } else if (style.startsWith("fontsize-")) {
          styleObject.fontSize = style.replace("fontsize-", "") + "px";
        } else if (style.startsWith("fontfamily-")) {
          const family = style.replace("fontfamily-", "").replace(/-/g, " ");
          styleObject.fontFamily = family;
        }
      });

      return Object.keys(styleObject).length ? { style: styleObject } : null;
    },
    blockStyleFn: (block) => {
      const alignment = block.getData()?.get("text-align");
      return alignment ? { style: { textAlign: alignment } } : null;
    },
  });
};

export const createStyleMap = () => {
  const styleMap = {};

  TOOLBAR_COLORS.forEach((color) => {
    styleMap[`color-${color}`] = { color };
  });

  FONT_FAMILIES.forEach((family) => {
    const displayName = family.replace(/-/g, " ");
    styleMap[`fontfamily-${family}`] = { fontFamily: displayName };
  });

  styleMap["fontfamily-times-new-roman"] = {
    fontFamily: "Times New Roman, serif",
  };
  styleMap["fontfamily-arial"] = { fontFamily: "Arial, sans-serif" };
  styleMap["fontfamily-calibri"] = { fontFamily: "Calibri, sans-serif" };
  styleMap["fontfamily-tahoma"] = { fontFamily: "Tahoma, sans-serif" };
  styleMap["fontfamily-verdana"] = { fontFamily: "Verdana, sans-serif" };
  styleMap["fontfamily-courier-new"] = {
    fontFamily: "Courier New, monospace",
  };

  for (let size = 8; size <= 72; size += 1) {
    styleMap[`fontsize-${size}`] = { fontSize: `${size}px` };
  }

  return styleMap;
};

export const createHandlePastedText = ({ editorUtils, handleEditorChange }) => {
  return (text, _html, currentEditorState) => {
    const { EditorState, Modifier, ContentState } = editorUtils;
    if (!EditorState || !Modifier || !ContentState) return "not-handled";

    const cleaned = normalizeWordPlainText(text || "");
    const contentFromText = ContentState.createFromText(cleaned);
    const blockMap = contentFromText.getBlockMap();

    const selection = currentEditorState.getSelection();
    const content = currentEditorState.getCurrentContent();

    const nextContent = Modifier.replaceWithFragment(
      content,
      selection,
      blockMap
    );

    const nextState = EditorState.push(
      currentEditorState,
      nextContent,
      "insert-fragment"
    );

    handleEditorChange(nextState);
    return "handled";
  };
};

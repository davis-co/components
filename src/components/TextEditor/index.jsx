import classNames from "classnames";
import { BiError, BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { HiOutlinePrinter } from "react-icons/hi";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import styles from "./styles.module.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { LABEL_DIRECTION_MAP } from "./constants";
import {
  createEditorStateFromValue,
  convertEditorStateToHTML,
  createStyleMap,
  createHandlePastedText,
} from "./editorHelpers";
import { Divider } from "../Divider";
import { Label } from "../Label";
import { printThis } from "../../utils/printThis";

export const TextEditor = forwardRef((props, ref) => {
  const {
    questionKey,
    useFormContext,
    validation,
    label,
    disabled,
    labelClassName,
    divider,
    userGuide,
    educationalContent,
    archive,
    labelMore,
    dividerClassName,
    containerClassName,
    wrapperClassName,
    editorClassName,
    toolbarClassName,
  } = props;

  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const [editorState, setEditorState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const EditorRef = useRef(null);
  const containerRef = useRef(null);
  const editorUtils = useRef({});
  const isInternalChange = useRef(false);

  const formValue = watch(questionKey);
  const error = errors?.[questionKey]?.message || null;

  // ==================== HELPER REFERENCES ====================

  const getEditorStateFromValue = (value) => {
    const nextState = createEditorStateFromValue(value, editorUtils.current);

    if (nextState) return nextState;

    return editorUtils.current.EditorState
      ? editorUtils.current.EditorState.createEmpty()
      : null;
  };

  // ==================== HANDLERS ====================

  const handleEditorChange = (newState) => {
    isInternalChange.current = true;
    setEditorState(newState);

    const htmlValue = convertEditorStateToHTML(newState, editorUtils.current);

    if (htmlValue !== null) {
      setValue(questionKey, htmlValue, {
        shouldValidate: true,
      });
    }

    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  };

  const handlePastedText = (text, _html, currentEditorState) => {
    return createHandlePastedText({
      editorUtils: editorUtils.current,
      handleEditorChange,
    })(text, _html, currentEditorState);
  };

  const handleAppendText = (value) => {
    if (!editorState || !editorUtils.current.Modifier) return;

    isInternalChange.current = true;

    const { Modifier, EditorState } = editorUtils.current;
    const contentState = editorState.getCurrentContent();
    const lastBlock = contentState.getLastBlock();

    const newSelection = editorState.getSelection().merge({
      anchorKey: lastBlock.getKey(),
      anchorOffset: lastBlock.getLength(),
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getLength(),
      isBackward: false,
    });

    const newContentState = Modifier.insertText(
      contentState,
      newSelection,
      value
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    setEditorState(newEditorState);
    const htmlValue = convertEditorStateToHTML(
      newEditorState,
      editorUtils.current
    );
    setValue(questionKey, htmlValue ?? "", {
      shouldValidate: true,
    });

    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  };

  const clear = () => {
    if (!editorUtils.current.EditorState) return;

    isInternalChange.current = true;
    setEditorState(editorUtils.current.EditorState.createEmpty());
    setValue(questionKey, "", { shouldValidate: true });

    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  };

  const handlePrint = () => {
    const content = watch(questionKey);
    if (content) printThis("", content);
  };

  const enterFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      await containerRef.current.requestFullscreen({ navigationUI: "hide" });
    } catch (e) {
      console.warn("Fullscreen failed:", e);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (e) {
      console.warn("Exit fullscreen failed:", e);
    }
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    register(questionKey, validation);

    const loadEditor = async () => {
      try {
        const [
          { Editor },
          { EditorState, convertToRaw, Modifier, ContentState, convertFromRaw },
          htmlToDraftModule,
          { stateToHTML },
        ] = await Promise.all([
          import("react-draft-wysiwyg"),
          import("draft-js"),
          import("html-to-draftjs"),
          import("draft-js-export-html"),
        ]);

        EditorRef.current = Editor;
        editorUtils.current = {
          stateToHTML,
          convertToRaw,
          Modifier,
          EditorState,
          ContentState,
          convertFromRaw,
          htmlToDraft: htmlToDraftModule.default,
        };

        const initialState = getEditorStateFromValue(watch(questionKey));
        if (initialState) {
          setEditorState(initialState);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load editor:", err);
      }
    };

    loadEditor();
  }, [register, questionKey, validation, watch]);

  // Sync form value to editor
  useEffect(() => {
    if (
      isLoading ||
      !editorState ||
      !editorUtils.current.EditorState ||
      isInternalChange.current
    ) {
      return;
    }

    const currentHtml = convertEditorStateToHTML(
      editorState,
      editorUtils.current
    );
    if (formValue !== currentHtml && formValue !== undefined) {
      const nextState = getEditorStateFromValue(formValue);
      if (nextState) {
        setEditorState(nextState);
      }
    }
  }, [formValue, isLoading, editorState]);

  // Fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === containerRef.current;
      setIsFullscreen(active);
      document.body.style.overflow = active ? "hidden" : "";
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useImperativeHandle(ref, () => ({ appendText: handleAppendText, clear }));

  // ==================== TOOLBAR BUTTONS ====================

  const PrintButton = () => (
    <div
      className="rdw-link-wrapper"
      aria-label="rdw-link-control"
      onClick={handlePrint}
    >
      <div className="rdw-option-wrapper" title="print">
        <HiOutlinePrinter className="xs:text-sm lg:text-xl" />
      </div>
    </div>
  );

  const FullscreenButton = () => (
    <div
      className="rdw-link-wrapper"
      aria-label="rdw-link-control"
      onClick={isFullscreen ? exitFullscreen : enterFullscreen}
    >
      <div
        className="rdw-option-wrapper"
        title={isFullscreen ? "minimize" : "fullsize"}
      >
        {isFullscreen ? (
          <BiExitFullscreen className="xs:text-sm lg:text-xl" />
        ) : (
          <BiFullscreen className="xs:text-sm lg:text-xl" />
        )}
      </div>
    </div>
  );

  // ==================== RENDER ====================

  if (isLoading) {
    return <div className="text-center py-4">Loading editor...</div>;
  }

  const Editor = EditorRef.current;

  return (
    <div
      ref={containerRef}
      className={classNames(
        "w-full flex flex-col relative bg-formItem p-2 rounded",
        containerClassName,
        error && "field-error",
        isFullscreen && styles.fullscreen
      )}
      style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)" }}
    >
      {label && (
        <Label
          className={classNames(labelClassName, LABEL_DIRECTION_MAP[divider])}
          userGuide={userGuide}
          educationalContent={educationalContent}
          archive={archive ? { ...archive, questionKey } : false}
          label={label}
          required={validation?.required || null}
          more={labelMore}
          disabled={disabled}
        />
      )}

      {divider && <Divider className={dividerClassName} position={divider} />}

      <Editor
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          textAlign: {
            inDropdown: false,
            options: ["left", "center", "right", "justify"],
          },
          fontFamily: {
            options: [
              "Arial",
              "Times New Roman",
              "Tahoma",
              "Verdana",
              "Courier New",
            ],
          },
        }}
        editorState={editorState}
        toolbarClassName={classNames(styles.toolbar, toolbarClassName)}
        wrapperClassName={classNames(
          styles.wrapper,
          wrapperClassName,
          isFullscreen && styles.wrapperFull
        )}
        editorClassName={classNames(
          styles.editor,
          editorClassName,
          "min-w-full",
          isFullscreen && "h-full"
        )}
        onEditorStateChange={handleEditorChange}
        readOnly={disabled}
        toolbarCustomButtons={[
          <PrintButton key="print" />,
          <FullscreenButton key="fullscreen" />,
        ]}
        customStyleMap={createStyleMap()}
        handlePastedText={handlePastedText}
        stripPastedStyles={true}
      />

      {error && (
        <span className="error">
          <BiError className="text-xs lg:text-base" />
          {error}
        </span>
      )}
    </div>
  );
});

TextEditor.displayName = "TextEditor";

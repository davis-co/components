/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { FaFileCircleXmark } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { BiError } from "react-icons/bi";
import styles from "./styles.module.css";
import { Label } from "../Label";
import { Divider } from "../Divider";
import { Button } from "../Button";

// --- START: Simple Modal Component (Replace with davis-components Modal if available) ---
const Modal = ({ isOpen, onClose, children, title = "" }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Very high z-index to ensure it's on top
        padding: "20px",
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        // Close modal when clicking on overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          height: "100%",
          maxWidth: "95vw",
          maxHeight: "95vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            flexShrink: 0,
          }}
        >
          {title && <h3 style={{ margin: 0 }}>{title}</h3>}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
              color: "#333",
            }}
          >
            &times;
          </button>
        </div>
        <div
          style={{
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            minHeight: 0,
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal directly in body, avoiding any parent overflow/positioning issues
  return createPortal(modalContent, document.body);
};
// --- END: Simple Modal Component ---

export const FileField = ({
  value,
  setValue,
  onChange,
  watch,
  label,
  validation,
  questionKey,
  errors,
  divider = "center",
  dividerClassName,
  buttonClassName,
  containerClassName,
  archive,
  labelClassName,
  className,
  baseURL = "https://salamatehr.ir/",
  userGuide,
  educationalContent,
  disabled,
  accept,
  labelMore,
  register,
  en,
}) => {
  const error = errors?.[questionKey] ? errors?.[questionKey]?.message : null;

  const [openModal, setOpenModal] = useState(false); // For delete confirmation
  const [showFileViewerModal, setShowFileViewerModal] = useState(false); // For file display modal
  const [fileUrlForModal, setFileUrlForModal] = useState(null); // Stores URL for the viewer modal
  const [fileObjectForModal, setFileObjectForModal] = useState(null); // Stores file object for type detection

  const inputRef = useRef(null);
  const _value = watch ? watch(questionKey) : value;

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (setValue) {
      setValue(questionKey, file);
    } else {
      onChange(file);
    }
    // If a new file is selected, ensure the viewer modal is closed
    setShowFileViewerModal(false);
    if (fileUrlForModal?.startsWith("blob:")) {
      URL.revokeObjectURL(fileUrlForModal);
    }
    setFileUrlForModal(null);
    setFileObjectForModal(null);
  };

  // Helper function to check if file is an image
  const isImageFile = (fileUrl, fileObject = null) => {
    // First check if it's a File object with type
    if (fileObject instanceof File) {
      return fileObject.type.startsWith("image/");
    }

    // Then check URL extension
    if (!fileUrl) return false;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    const lowerUrl = fileUrl.toLowerCase();
    return (
      imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
      lowerUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?|$)/i)
    );
  };

  // Modified to open the file in our new modal
  const handleDisplayFile = () => {
    const fileLink = _value;
    let urlToDisplay = null;

    if (typeof fileLink === "string") {
      // If _value is already a string (likely a path from the server)
      urlToDisplay = `${baseURL}/${fileLink}`;
    } else if (fileLink instanceof File || fileLink instanceof Blob) {
      // If _value is a File object (e.g., before upload)
      urlToDisplay = URL.createObjectURL(fileLink);
    }

    if (urlToDisplay) {
      setFileUrlForModal(urlToDisplay);
      setFileObjectForModal(fileLink instanceof File ? fileLink : null);
      setShowFileViewerModal(true);
    } else {
      console.warn("No file or valid file path found to display.");
      // Optionally show an error message to the user
    }
  };

  const deleteFile = () => {
    setOpenModal(true); // Open the delete confirmation modal
  };

  const handleRadioChange = (val) => {
    if (val === "10361") {
      // "Yes" to delete
      const resetFile = "";
      if (setValue) {
        setValue(questionKey, resetFile);
      } else {
        onChange(resetFile);
      }
      setOpenModal(false); // Close delete confirmation modal
      setShowFileViewerModal(false); // Also close the viewer if open
      setFileUrlForModal(null); // Clear the file URL
    } else if (val === "10362") {
      // "No" to delete
      setOpenModal(false); // Close delete confirmation modal
    }
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length <= maxLength
      ? text
      : `${text.slice(0, maxLength / 2)}...${text.slice(-maxLength / 2)}`;
  };

  const filename = useCallback(
    (file) =>
      typeof file === "string" ? truncateText(file) : truncateText(file.name),
    []
  );

  const renderFileInfo = () => {
    const fileToDisplay = _value;
    return fileToDisplay
      ? filename(fileToDisplay)
      : en
      ? "Choose a file"
      : "انتخاب فایل";
  };

  const labelDirectionStyle = {
    center: "label-center",
    right: "label-right",
    left: "label-left",
  };

  useEffect(() => {
    if (register && validation) {
      register(questionKey, validation);
    }
  }, [register, validation, questionKey]); // Added dependencies

  const handleFileView = (link) => {
    const url = `${baseURL}/${link}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={classNames(
        "w-full flex flex-col p-2 bg-formItem rounded relative",
        containerClassName,
        {
          "field-error": error,
        }
      )}
      style={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
      }}
      dir={en ? "ltr" : ""}
    >
      {label && (
        <Label
          className={classNames(labelClassName, labelDirectionStyle[divider])}
          more={labelMore}
          userGuide={userGuide}
          educationalContent={educationalContent}
          archive={
            archive
              ? {
                  ...archive,
                  questionKey,
                  // Modified renderCell to use handleDisplayFile for direct file view
                  renderCell:
                    archive.renderCell ||
                    ((val) => (
                      <span
                        className="text-success cursor-pointer" // Added cursor-pointer
                        onClick={() => handleFileView(val)} // Pass URL to open in modal
                      >
                        {"نمایش فایل"}
                      </span>
                    )),
                }
              : false
          }
          label={label}
          required={validation ? validation.required : null}
          disabled={disabled}
          en={en}
        />
      )}
      {divider && (
        <Divider className={classNames(dividerClassName)} position={divider} />
      )}
      <div className={"flex w-full items-center justify-between gap-4"}>
        <Button
          variant={"outlined"}
          className={classNames(
            buttonClassName,
            "h-[22px] lg:h-[26px] w-[81px] lg:!text-xs text-nowrap border-black !bg-background hover:!bg-white px-2 !border-[0.5px] opacity-90 hover:opacity-100"
          )}
          title={
            _value
              ? en
                ? "Display file"
                : "نمایش فایل"
              : en
              ? "Upload"
              : "انتخاب فایل"
          }
          onClick={() =>
            _value ? handleDisplayFile() : inputRef.current.click()
          }
          disabled={disabled} // Disable button if FileField is disabled
        />

        <div
          className={classNames(
            "border-[0.5px] w-full cursor-pointer flex items-center justify-between px-2 border-black rounded hover:!bg-white",
            {
              "!bg-white": _value,
              "!bg-white-f5": !_value,
            },
            "group"
          )}
        >
          <label
            className={classNames(
              "relative w-full justify-between flex items-center cursor-pointer overflow-hidden text-ellipsis",
              className
            )}
          >
            <span className="z-[1] font-600 text-2xs lg:text-[11px] xl:text-xs">
              {renderFileInfo()}
            </span>
            <input
              type="file"
              ref={inputRef}
              className={classNames(
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                "z-10 w-full h-full absolute left-0 top-0 opacity-0"
              )}
              onChange={handleFileChange}
              disabled={disabled}
              accept={accept}
            />
            <Button
              variant="text"
              onClick={_value && !disabled ? deleteFile : null}
              icon={
                _value ? (
                  <FaFileCircleXmark
                    color={openModal ? "#960018" : "#04900a"} // Consider removing openModal dependency for color
                    className="w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]"
                  />
                ) : (
                  <MdOutlineFileUpload
                    className={classNames(
                      "w-[16px] h-[16px] lg:w-[20px] lg:h-[20px]  group-hover:!text-success",
                      _value ? "text-success" : "text-[#7B7B7B]"
                    )}
                  />
                )
              }
              className={_value ? "z-20" : ""}
              disabled={disabled} // Disable delete button if FileField is disabled
            />
          </label>
        </div>
      </div>

      {openModal && (
        <div
          className={
            styles.confirmBox +
            " " +
            "z-20 bg-white bg-opacity-40 backdrop-blur-md absolute left-0 top-0 w-full flex flex-col justify-between min-h-full px-2 py-2"
          }
        >
          <Label
            className="self-center"
            label={"آیا مایل به حذف فایل انتخاب شده هستید؟"}
          />
          <Divider position={"center"} />
          <div className="flex justify-between w-full">
            {[
              { label: "بله", value: "10361" },
              { label: "خیر", value: "10362" },
            ].map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                id={option.value}
                name="booleanOption"
                value={option.value}
                checked={false} // This should be handled by an internal state for radio group if actual selection is needed
                onClick={() => handleRadioChange(option.value)}
                onChange={(e) => e.preventDefault()} // Prevent default onChange
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <span className="error">
          <BiError className="text-2xs lg:text-xs" />
          {error}
        </span>
      )}

      {/* --- File Viewer Modal --- */}
      <Modal
        isOpen={showFileViewerModal}
        onClose={() => {
          setShowFileViewerModal(false);
          // Clean up object URL if it was created
          if (fileUrlForModal?.startsWith("blob:")) {
            URL.revokeObjectURL(fileUrlForModal);
          }
          setFileUrlForModal(null);
          setFileObjectForModal(null);
        }}
        title="مشاهده فایل"
      >
        {fileUrlForModal ? (
          isImageFile(fileUrlForModal, fileObjectForModal) ? (
            <img
              src={fileUrlForModal}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <iframe
              src={fileUrlForModal}
              style={{
                border: "none",
                width: "100%",
                height: "100%",
                flex: "1 1 0",
                minHeight: 0,
                display: "block",
              }}
              title="PDF Viewer"
            >
              این مرورگر از نمایش فایل‌های PDF پشتیبانی نمی‌کند. می‌توانید فایل
              را دانلود کنید:{" "}
              <a href={fileUrlForModal} download>
                دانلود PDF
              </a>
            </iframe>
          )
        ) : (
          <p>فایلی برای نمایش وجود ندارد.</p>
        )}
      </Modal>
    </div>
  );
};

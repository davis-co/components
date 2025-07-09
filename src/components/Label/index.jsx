/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import { ArchiveTable } from "../../layouts/ArchiveTable";
import styles from "./styles.module.css";
import GuideIcon from "../../assets/icons/guide.svg";
import ArchiveIcon from "../../assets/icons/archive.svg";
import LockIcon from "../../assets/icons/lock.svg";
import DangerIcon from "../../assets/icons/danger.svg";
import MoreIcon from "../../assets/icons/more.svg";
import CloseIcon from "../../assets/icons/close.svg"; // ← آیکون بستن سفارشی (دلخواه)

import classNames from "classnames";

export const Label = ({
  label,
  required,
  className,
  userGuide,
  archive,
  educationalContent,
  en,
  more,
  disabled,
}) => {
  const labelRef = useRef(null);
  const spanRef = useRef(null);
  const [truncatedText, setTruncatedText] = useState(label);
  const [openModal, setOpenModal] = useState({
    userGuide: false,
    archive: false,
  });
  const [showMore, setShowMore] = useState(
    window.innerWidth > 671 ? more : false
  );
  const [openMoreBox, setOpenMoreBox] = useState(false);

  const handleModalToggle = (type) => {
    setOpenModal((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const measureWidth = () => {
    const iconSizes =
      (required ? -22 : 0) +
      (disabled ? -21 : 0) +
      (userGuide ? -34 : 0) +
      (archive ? -24 : 0) +
      (educationalContent?.show ? -19 : 0);

    if (labelRef.current && spanRef.current) {
      const labelWidth = labelRef.current.offsetWidth + iconSizes - 34;
      const textWidth = spanRef.current.offsetWidth;
      if (textWidth > labelWidth) {
        let newText = label;
        let chars = newText.split("");
        let truncated = "";
        for (let char of chars) {
          spanRef.current.innerText = truncated + char;
          if (spanRef.current.offsetWidth > labelWidth) {
            break;
          }
          truncated += char;
        }
        setTruncatedText(truncated.trim() + "");
        setShowMore(true);
      } else {
        setTruncatedText(label);
        setShowMore(false);
      }
    }
  };

  useEffect(() => {
    if (label) measureWidth();
  }, []);

  useEffect(() => {
    if (label) measureWidth();
  }, [label]);

  return (
    <Fragment>
      <label
        className={classNames(
          className,
          styles.label,
          educationalContent?.show ? "pl-[20px]" : "",
          // تغییر اصلی: استفاده از items-start به جای items-center
          "flex items-start text-right font-700 text-black text-[11px] lg:text-xs xl:text-sm overflow-hidden",
          en
            ? styles.enLabel +
                " " +
                "relative flex items-start text-black text-2xs lg:text-xs xl:text-sm"
            : styles.label,
          "select-none w-full"
        )}
        dir={en ? "ltr" : ""}
        ref={labelRef}
      >
        {showMore && !openMoreBox ? (
          <Fragment>
            <span
              ref={spanRef}
              className={
                en
                  ? styles.truncatedTextEn +
                    " " +
                    "text-black text-2xs lg:text-xs xl:text-sm"
                  : "font-700 text-black text-2xs lg:text-xs xl:text-sm"
              }
              style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {truncatedText}
            </span>
            <img
              src={MoreIcon}
              alt="بیشتر"
              className="w-[12px] md:w-[18px] ml-1 mt-1 cursor-pointer flex-shrink-0"
              onClick={() => setOpenMoreBox(true)}
            />
          </Fragment>
        ) : (
          <Fragment>
            <span
              className={
                en
                  ? styles.truncatedTextEn +
                    " " +
                    "text-black text-2xs lg:text-xs xl:text-sm"
                  : "font-700 text-black text-2xs lg:text-xs xl:text-sm"
              }
            >
              {label}
              {required && (
                <span
                  className={
                    styles.required +
                    " " +
                    (en
                      ? "ml-1 md:text-sm lg:text-lg !leading-none flex-shrink-0 self-center inline-block"
                      : "mr-1 md:text-sm lg:text-lg flex-shrink-0 self-center inline-block")
                  }
                >
                  *
                </span>
              )}
            </span>
            {showMore && (
              <img
                src={CloseIcon}
                alt="بستن"
                className="w-[10px] md:w-[16px] ml-1 mt-1 cursor-pointer leading-none flex-shrink-0"
                onClick={() => setOpenMoreBox(false)}
              />
            )}
          </Fragment>
        )}
        <div className="flex items-start">
          {disabled && (
            <img
              src={LockIcon}
              alt="قفل"
              className="w-[12px] md:w-[14px] flex-shrink-0 self-center"
            />
          )}

          {userGuide && (
            <img
              src={GuideIcon}
              alt="راهنما"
              onClick={() => handleModalToggle("userGuide")}
              className="w-[20px] md:w-[30px] cursor-pointer flex-shrink-0 self-center"
            />
          )}

          {archive && (
            <img
              src={ArchiveIcon}
              alt="آرشیو"
              onClick={() => handleModalToggle("archive")}
              className="w-[15px] md:w-[17px] cursor-pointer flex-shrink-0 self-center"
            />
          )}

          {educationalContent?.show && (
            <img
              src={
                educationalContent?.type == "danger"
                  ? DangerIcon
                  : "https://salamatehr.ir/resource/files/1736921541621.png"
              }
              loading="lazy"
              alt="محتوای آموزشی"
              onClick={() => educationalContent.action()}
              className={classNames(
                styles.eduIcon,
                "absolute w-[15px] md:w-[17px] cursor-pointer",
                educationalContent.className,
                showMore ? "!left-1 top-1" : "top-1/2 -translate-y-1/2"
              )}
            />
          )}
        </div>
      </label>

      <Modal
        isOpen={openModal.userGuide || openModal.archive}
        onClose={() => setOpenModal({ userGuide: false, archive: false })}
        containerClassName={styles.modalContainer}
      >
        {openModal.userGuide ? userGuide : null}
        {openModal.archive ? <ArchiveTable options={archive} /> : null}
      </Modal>
    </Fragment>
  );
};

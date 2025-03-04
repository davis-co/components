/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from "react"
import { Modal } from "../Modal"
import { ArchiveTable } from "../../layouts/ArchiveTable"
import styles from "./styles.module.css" // Import your CSS module
import GuideIcon from "../../assets/icons/guide.svg"
import ArchiveIcon from "../../assets/icons/archive.svg"
import LockIcon from "../../assets/icons/lock.svg"
import DangerIcon from "../../assets/icons/danger.svg"
import { MdOutlineMoreHoriz } from "react-icons/md"
import classNames from "classnames"
import { MdChevronLeft } from "react-icons/md"

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
    const labelRef = useRef(null)
    const spanRef = useRef(null)
    const [truncatedText, setTruncatedText] = useState(label)
    const [openModal, setOpenModal] = useState({
        userGuide: false,
        archive: false,
    })
    const [openMoreBox, setOpenMoreBox] = useState(false)
    const [showMore, setShowMore] = useState(
        window.innerWidth > 671 ? more : false
    )

    const handleModalToggle = (type) => {
        setOpenModal((prev) => ({ ...prev, [type]: !prev[type] }))
    }

    const measureWidth = () => {
        const iconSizes =
            (required ? -22 : 0) +
            (disabled ? -21 : 0) +
            (userGuide ? -34 : 0) +
            (archive ? -24 : 0) +
            (educationalContent?.show ? -19 : 0)

        if (labelRef.current && spanRef.current) {
            const labelWidth = labelRef.current.offsetWidth + iconSizes - 34
            const textWidth = spanRef.current.offsetWidth
            if (textWidth > labelWidth) {
                let newText = label
                let chars = newText.split("")
                let truncated = ""
                for (let char of chars) {
                    spanRef.current.innerText = truncated + char
                    if (spanRef.current.offsetWidth > labelWidth) {
                        break
                    }
                    truncated += char
                }
                setTruncatedText(truncated.trim() + "")
                setShowMore(true)
            } else {
                setTruncatedText(label)
                setShowMore(false)
            }
        }
    }

    useEffect(() => {
        if (label) {
            measureWidth()
        }
    }, [])

    useEffect(() => {
        if (label) {
            measureWidth()
        }
    }, [label])

    return (
        <Fragment>
            {openMoreBox ? (
                <div
                    onClick={() => setOpenMoreBox(false)}
                    className="fixed top-0 left-0 h-full w-full z-[999]"
                ></div>
            ) : null}
            <label
                className={classNames(
                    className,
                    styles.label,
                    educationalContent?.show ? "pl-[20px]" : "",
                    "flex items-center text-center font-700 text-black text-2xs lg:text-xs xl:text-sm overflow-hidden",
                    en
                        ? styles.enLabel +
                              " " +
                              "relative flex items-center text-black text-2xs lg:text-xs xl:text-sm"
                        : styles.label,
                    showMore ? "w-full z-[1000] " : "relative",
                    "select-none"
                )}
                dir={en ? "ltr" : ""}
                ref={labelRef}
            >
                {showMore ? (
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
                        <MdOutlineMoreHoriz
                            onClick={() => {
                                setOpenMoreBox(true)
                            }}
                            className="text-lg lg:text-xl hover:cursor-pointer ml-auto"
                            style={{
                                width: `${34}px`,
                                marginRight: `${4}px`,
                                cursor: "pointer",
                            }}
                        />
                    </Fragment>
                ) : (
                    label
                )}
                {required && (
                    <span
                        className={
                            styles.required +
                            " " +
                            (en
                                ? "ml-1 md:text-sm lg:text-lg !leading-none"
                                : "mr-1 md:text-sm lg:text-lg")
                        }
                    >
                        *
                    </span>
                )}
                {disabled && (
                    <img
                        src={LockIcon}
                        alt="قفل"
                        className={`w-[12px] md:w-[14px]`}
                    />
                )}
                {userGuide && (
                    <img
                        src={GuideIcon}
                        alt="راهنما"
                        onClick={() => handleModalToggle("userGuide")}
                        className={`w-[20px] md:w-[30px] cursor-pointer`}
                    />
                )}
                {archive && (
                    <img
                        src={ArchiveIcon}
                        alt="آرشیو"
                        onClick={() => handleModalToggle("archive")}
                        className={`w-[15px] md:w-[17px] cursor-pointer`}
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
                        className={`${
                            styles.eduIcon
                        } absolute  w-[15px] md:w-[17px] cursor-pointer ${
                            educationalContent.className
                        } ${showMore ? "!left-1" : "top-1/2 -translate-y-1/2"}`}
                    />
                )}

                <Modal
                    isOpen={openModal.userGuide || openModal.archive}
                    onClose={() =>
                        setOpenModal({ userGuide: false, archive: false })
                    }
                    containerClassName={styles.modalContainer}
                >
                    {openModal.userGuide ? userGuide : null}
                    {openModal.archive ? (
                        <ArchiveTable options={archive} />
                    ) : null}
                </Modal>
                {openMoreBox ? (
                    <div
                        className={classNames(
                            "animate-flipBottom border-x-[12px] border-y-4 border-opacity-40 backdrop-blur-md border-formItem2 rounded-md bg-white flex flex-col gap-0.5 absolute left-0 top-0 w-full min-h-full max-h-full overflow-y-auto xs:!leading-4 lg:!leading-5 lg:!text-[11px] xl:!text-sm text-justify p-1",
                            en
                                ? styles.truncatedTextEn +
                                      " " +
                                      "text-black md:text-2xs lg:text-xs xl:text-sm"
                                : '"font-700 text-black text-2xs lg:text-xs xl:text-sm"'
                        )}
                    >
                        {label}
                        <div
                            className={
                                "mr-auto flex items-center text-2xs xl:text-xs cursor-pointer mt-auto"
                            }
                            onClick={() => setOpenMoreBox(false)}
                        >
                            بازگشت{" "}
                            <MdChevronLeft className="text-2xs lg:text-sm xl:text-lg" />
                        </div>
                    </div>
                ) : null}
            </label>
        </Fragment>
    )
}

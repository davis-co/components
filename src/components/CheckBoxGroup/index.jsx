/* eslint-disable react/prop-types */
import classNames from "classnames";
import { BiError } from "react-icons/bi";
import { CheckBox } from "../CheckBox";
import { Divider } from "../Divider";
import { Label } from "../Label";
import styles from "./styles.module.css";
import { useEffect } from "react";

export const CheckBoxGroup = ({
  containerClassName,
  optionsContainer,
  checkBoxClassName,
  options = [],
  label,
  divider = false,
  labelClassName,
  educationalContent,
  userGuide,
  errors,
  questionKey,
  validation,
  setValue,
  watch,
  register,
  archive,
  dividerClassName,
  labelMore,
  disabled,
  en,
}) => {
  const error = errors?.[questionKey] ? errors?.[questionKey]?.message : null;

  const selectedValues = (watch?.(questionKey) || []).map((o) => String(o));

  // مقدار گزینه "Nothing" (هیچکدام) را تعریف کنید
  const NOTHING_OPTION_VALUE = "10653";

  const handleCheckboxChange = (value) => {
    let updatedValues;

    if (value === NOTHING_OPTION_VALUE) {
      // اگر "Nothing" انتخاب شد:
      // تمام گزینه‌های دیگر را حذف کن و فقط "Nothing" را نگه دار
      updatedValues = selectedValues.includes(NOTHING_OPTION_VALUE)
        ? [] // اگر از قبل انتخاب شده بود، خالی کن (یعنی از حالت انتخاب خارج شد)
        : [NOTHING_OPTION_VALUE]; // اگر انتخاب نشده بود، فقط "Nothing" را انتخاب کن
    } else {
      // اگر گزینه دیگری انتخاب شد:
      if (selectedValues.includes(NOTHING_OPTION_VALUE)) {
        // اگر "Nothing" قبلا انتخاب شده بود، ابتدا "Nothing" را حذف کن
        updatedValues = selectedValues.filter(
          (v) => v !== NOTHING_OPTION_VALUE
        );
      } else {
        // اگر "Nothing" انتخاب نشده بود، به صورت عادی اضافه/حذف کن
        updatedValues = selectedValues.includes(String(value))
          ? selectedValues.filter((v) => v !== String(value))
          : [...selectedValues, String(value)];
      }
    }
    setValue?.(questionKey, updatedValues, { shouldValidate: true });
  };

  const renderCheckBox = (option) => {
    // اگر "Nothing" انتخاب شده باشد و این گزینه، "Nothing" نباشد، disabled شود
    const isDisabled =
      disabled ||
      (selectedValues.includes(NOTHING_OPTION_VALUE) &&
        option.value !== NOTHING_OPTION_VALUE);

    return (
      <CheckBox
        key={option.value}
        name={questionKey}
        value={option.value}
        label={option.label}
        checked={selectedValues.includes(option.value)}
        onChange={() => handleCheckboxChange(option.value)}
        className={classNames(checkBoxClassName)}
        disabled={isDisabled} // استفاده از isDisabled جدید
        en={en}
      />
    );
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
  }, []);

  return (
    <div
      className={classNames(
        "w-full flex flex-col p-2 bg-formItem rounded relative",
        containerClassName,
        error ? "field-error" : ""
      )}
      style={{
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
      }}
    >
      {label && (
        <div className="grid grid-cols-3 md:grid-cols-2 md:gap-1 first:w-fit first:ml-auto md:first:*:col-span-1 first:*:col-span-2 ">
          <Label
            className={classNames(labelClassName, labelDirectionStyle[divider])}
            userGuide={userGuide}
            educationalContent={educationalContent}
            archive={archive ? { ...archive, questionKey } : false}
            label={label}
            required={validation ? validation.required : null}
            en={en}
            more={labelMore}
            disabled={disabled}
          />
          <span className="text-[10px] text-nowrap md:text-xs text-gray-400">
            (امکان انتخاب چند گزینه)
          </span>
        </div>
      )}
      {divider && (
        <Divider className={classNames(dividerClassName)} position={divider} />
      )}
      <div
        className={classNames(
          optionsContainer,
          styles.options,
          "flex w-full flex-wrap gap-1.5"
        )}
        dir={en ? "ltr" : "rtl"}
      >
        {options.map(renderCheckBox)}
      </div>
      {error && (
        <span className="error">
          {<BiError className="text-xs lg:text-base" />}
          {error}
        </span>
      )}
    </div>
  );
};
/* eslint-disable react/prop-types */
import classNames from "classnames";
import { useEffect } from "react";
import { BiError } from "react-icons/bi";
import { CheckBox } from "../CheckBox";
import { Divider } from "../Divider";
import { Label } from "../Label";
import styles from "./styles.module.css";

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
  const nothingValue = "10653";

  const handleCheckboxChange = (value) => {
    const clickedValue = String(value);
    const isNothingClicked = clickedValue === nothingValue;
    const isNothingSelected = selectedValues.includes(nothingValue);

    let newValues;

    if (isNothingClicked) {
      // اگر کاربر روی گزینه "Nothing" کلیک کرد
      // اگر از قبل انتخاب شده بود، آن را حذف کن، در غیر این صورت فقط آن را انتخاب کن
      newValues = isNothingSelected ? [] : [nothingValue];
    } else {
      // اگر کاربر روی گزینه‌ی دیگری کلیک کرد
      if (isNothingSelected) {
        // اگر "Nothing" انتخاب شده بود، آن را حذف و گزینه جدید را جایگزین کن
        newValues = [clickedValue];
      } else {
        // در غیر این صورت، گزینه کلیک شده را به لیست اضافه یا از آن کم کن
        const isClickedValueSelected = selectedValues.includes(clickedValue);
        if (isClickedValueSelected) {
          newValues = selectedValues.filter((v) => v !== clickedValue);
        } else {
          newValues = [...selectedValues, clickedValue];
        }
      }
    }
    setValue?.(questionKey, newValues, { shouldValidate: true });
  };

  const isNothingSelected = selectedValues.includes(nothingValue);

  const renderCheckBox = (option) => (
    <CheckBox
      key={option.value}
      name={questionKey}
      value={option.value}
      label={option.label}
      checked={selectedValues.includes(String(option.value))}
      onChange={() => handleCheckboxChange(option.value)}
      className={classNames(checkBoxClassName)}
      // اگر گزینه "Nothing" انتخاب شده، بقیه گزینه‌ها را غیرفعال کن
      disabled={
        disabled || (isNothingSelected && String(option.value) !== nothingValue)
      }
      en={en}
    />
  );

  const labelDirectionStyle = {
    center: "label-center",
    right: "label-right",
    left: "label-left",
  };

  useEffect(() => {
    if (register && validation) {
      register(questionKey, validation);
    }
  }, [register, validation, questionKey]);

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
        <div
          className={classNames(
            "grid gap-1 first:w-fit first:*:col-span-2",
            en
              ? "!flex justify-strat items-center gap-0 first:w-full"
              : "grid-cols-2 first:*:col-span-1"
          )}
          dir={en ? "ltr" : "rtl"}
        >
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
          <span className={classNames("text-[10px] text-nowrap md:text-xs text-gray-400",
            en ? "absolute left-16" :""
          )}>
            {en ? "(Select multiple options)" : "(امکان انتخاب چند گزینه)"}
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
          <BiError className="text-xs lg:text-base" />
          {error}
        </span>
      )}
    </div>
  );
};

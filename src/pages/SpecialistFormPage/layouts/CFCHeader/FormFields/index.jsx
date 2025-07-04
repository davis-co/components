/* eslint-disable react/prop-types */
import { CheckBoxGroup } from "../../../../../components/CheckBoxGroup";
import { DateInput } from "../../../../../components/DateInput";
import { FileField } from "../../../../../components/FileField";
import { ProgressChart } from "../../../../../components/Charts/Progress";
import { RadioOptions } from "../../../../../components/RadioOptions";
import { Select } from "../../../../../components/Select";
import { TextEditor } from "../../../../../components/TextEditor";
import { TextField } from "../../../../../components/TextField";
import { useEffect } from "react";
import HeaderRadioOption from "../HeaderRadioOption";
import SwitchButton from "../../../../../components/SwitchButton";
import { safeWatch } from "../../../../../utils/safeWatch";

export const FormFields = ({
  BC,
  useFormContext,
  unmount,
  request,
  ...props
}) => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    return () => {
      if (unmount) setValue(props.questionKey, null);
    };
  }, []);

  const commonProps = {
    containerClassName: `${props.containerClassName} max-h-fit`,
    label: props.label,
    questionKey: props.questionKey,
    userGuide: props.userGuide,
    disabled: props.disabled,
    archive: props.archive
      ? {
          userID: watch("6483"),
          BC,
          jobID: 164,
          request,
          renderCell: props.renderCell,
        }
      : null,
    en: props.en,
  };

  const componentMap = {
    RadioOptions: (
      <RadioOptions
        {...commonProps}
        register={register}
        divider={props.divider}
        optionsContainer={props.optionsContainer}
        radioClassName={props.radioClassName}
        labelClassName="!text-center"
        active={safeWatch(watch, props.questionKey)}
        errors={errors}
        options={props.options}
        labelMore={props.labelMore}
        validation={props.validation}
         onChange={(value) => {
    setValue(props.questionKey, value);  // مقدار رو ست کن
    props.onChange?.(value);             // اگر تابع خارجی وجود داره، صداش کن
  }}
        // onChange={(value)=>props.onChange?.(value)}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
                renderCell: (val) =>
                  props.options.find((o) => o.value == val)?.label,
              }
            : null
        }
      />
    ),
    TextEditor: (
      <TextEditor
        {...commonProps}
        useFormContext={useFormContext}
        validation={props.validation}
        divider={props.divider}
        labelMore={props.labelMore}
        onChange={(e)=>props.onChange?.(e.target.value)}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
              }
            : null
        }
      />
    ),
    TextField: (
      <TextField
        {...commonProps}
        labelClassName={props.labelClassName}
        divider={props.rows ? "" : ""}
        errors={errors}
        watch={watch}
        register={register}
        rows={props.rows}
        placeholder={props.placeholder}
        educationalContent={props.educationalContent}
        labelMore={props.labelMore}
        validation={props.validation}
        onChange={props.onChange}
        // onChange={(e)=>props.onChange?.(e.target.value)}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
                renderCell: (val) => val,
              }
            : null
        }
      />
    ),
    "progress-chart": (
      <ProgressChart
        {...commonProps}
        divider={props.rows ? "" : ""}
        value={watch(props.questionKey)}
        ranges={props.ranges}
        educationalContent={props.educationalContent}
        required={props.validation}
        onChange={props.onChange}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
              }
            : null
        }
      />
    ),
    Select: (
      <Select
        {...commonProps}
        options={props.options}
        control={control}
        errors={errors}
        search={props.search}
        divider={props.divider}
        educationalContent={props.educationalContent}
        labelMore={props.labelMore}
        value={props.value}
        onChange={(value)=>props.onChange?.(value)}
        validation={props.validation}
        register={register}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
                renderCell: (val) =>
                  props.options.find((o) => o.value == val)?.label,
              }
            : null
        }
      />
    ),
    CheckBoxGroup: (
      <CheckBoxGroup
        {...commonProps}
        watch={watch}
        options={props.options}
        setValue={setValue}
        register={register}
        errors={errors}
        divider={props.divider}
        educationalContent={props.educationalContent}
        labelMore={props.labelMore}
        checkBoxClassName={props.checkBoxClassName}
        optionsContainer={props.optionsContainer}
        validation={props.validation}
        onChange={(values)=>props.onChange?.(values)}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
                renderCell: (values) =>
                  values
                    .map(
                      (value) =>
                        props.options.find((o) => o.value == value)?.label
                    )
                    .join(" , "),
              }
            : null
        }
      />
    ),
    DateInput: (
      <DateInput
        {...commonProps}
        control={control}
        watch={watch}
        errors={errors}
        validation={props.validation}
        id={props.id}
        divider={props.divider}
        educationalContent={props.educationalContent}
        labelMore={props.labelMore}
        onChange={(date)=>props.onChange?.(date)}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
                renderCell: (val) => val,
              }
            : null
        }
      />
    ),
    FileField: (
      <FileField
        {...commonProps}
        value={props.value}
        watch={watch}
        setValue={setValue}
        errors={errors}
        labelClassName={props.labelClassName}
        accept={props.accept}
        baseURL={props.baseURL}
        divider={props.divider}
        educationalContent={props.educationalContent}
        labelMore={props.labelMore}
        validation={props.validation}
        register={register}
        onChange={props.onChange}
        archive={
          props.archive
            ? {
                userID: watch("6483"),
                BC,
                jobID: 164,
                request,
              }
            : null
        }
      />
    ),
    HeaderRadioOption: (
      <HeaderRadioOption
        {...commonProps}
        options={props.options}
        formData={props.formData}
         onChange={(value) => {
    setValue(props.questionKey, value);  // مقدار رو ست کن
    props.onChange?.(value);             // اگر تابع خارجی وجود داره، صداش کن
  }}
        // onChange={(val)=>props.onChange?.(val)}
      />
    ),
    HeaderSwitchButton: (
      <SwitchButton options={props.options} 
      onChange={(val)=>props.onChange?.(val)} />
    ),
  };

  return componentMap[props.component] || null;
};

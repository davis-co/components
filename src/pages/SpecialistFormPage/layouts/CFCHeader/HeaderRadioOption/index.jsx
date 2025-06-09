import classNames from "classnames";
import { Label } from "../../../../../components/Label";
import { Radio } from "../../../../../components/Radio";
import styles from "./styles.module.css";
const HeaderRadioOption = ({ options, formData, onChange,questionKey }) => {

  return (
    <div
      className={
        "flex flex-col mx-2"
        // "flex flex-col gap-0.5 flex-1 min-w-[46%] md:!min-w-[135px]  md:max-w-[160px] lg:max-w-[215px] xl:max-w-[239px] md:ml-auto"
      }
    >
      <Label label={"وضعیت QC"} className={"!text-[9px] lg:!text-xs"} />
      <div
        className={classNames(
          "flex justify-between gap-1.5 md:gap-2 px-1 lg:px-2 xs:py-[3px] border-[0.25px] border-solid bg-[#f7f7f7] hover:bg-white xs:!rounded-[4px] md:!rounded border-black"
          // formData[1586688732636] ? "bg-white" : ""
        )}
      >
        {options.map((o) => (
          <Radio
            key={o.value}
            
            label={o.label}
            className={classNames(
              styles.radio,
              "!bg-transparent !border-none !gap-0 md:!gap-[1px] lg:!gap-5 !py-0 !px-0"
            )}
            name={questionKey}
            value={o.value}
             checked={o.value == formData}
            // onClick={() => handleOnChange(o.value, 1586688732636)}
            onChange={(e)=>onChange(e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};
export default HeaderRadioOption;

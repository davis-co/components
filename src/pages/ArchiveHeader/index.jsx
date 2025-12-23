/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { FieldSet } from "../../components/FieldSet";
import classNames from "classnames";
import { GrRefresh } from "react-icons/gr";
import styles from "./styles.module.css";

export const ArchiveHeader = ({
  title = "مشخصات فردی",
  request = () => {},
  user,
  setUser,
  resetFlag,
  toast = () => {},
  qbc,
}) => {
  const [formData, setFormData] = useState({
    6620: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ 6620: "" });
    setUser?.(null);
  }, [resetFlag]);

  const handleOnChange = (value) => {
    setFormData((p) => ({ ...p, 6620: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const nationalCode = (formData[6620] || "").trim();

    if (!nationalCode) {
      toast?.error?.("کد ملی را وارد کنید.");
      return;
    }

    setLoading(true);
    const options = {
      jobId: 166,
      dataInfo: {
        6620: nationalCode,
        qbc,
      },
    };

    try {
      const res = await request(options);

      if (res?.error) {
        toast?.error?.(
          "خطای دریافت اطلاعات" +
            (res?.error_code ? ` - ${res.error_code}` : "")
        );
        setUser?.(null);
        return;
      }
      const person = Array.isArray(res?.data) ? res?.data?.[0] : res?.data;

      if (!person) {
        toast?.error?.("اطلاعاتی یافت نشد.");
        setUser?.(null);
        return;
      }
      setUser?.(person);
    } catch (err) {
      toast?.error?.(err?.message || "خطای نامشخص");
      setUser?.(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshActive = Boolean((formData[6620] || "").trim() || user);

  return (
    <Fragment>
      <section
        className={classNames(
          "rounded-md bg-white px-1.5 pb-3 md:pb-4 md:pt-1 shadow-md md:px-4",
          styles?.normalContainer
        )}
      >
        <FieldSet
          title={title}
          className={classNames(
            styles.fieldset,
            "!px-2 md:px-4 !pt-4 !pb-2 md:!pb-5 relative !border-none "
          )}
          gradientBorder={false}
          titleClassName={
            "!bg-transparent !translate-y-[35%] lg:!translate-y-[30%]"
          }
        >
          <form
            className={"flex w-full justify-center items-end bg-background"}
            onSubmit={onSubmit}
          >
            <div className="flex w-full items-end gap-4">
              <TextField
                containerClassName={
                  "flex flex-1 md:ml-auto !p-0 !bg-transparent !gap-0.5 !shadow-none"
                }
                className={
                  "!border-[0.25px] !rounded-[3px] lg:!rounded w-full bg-[#f7f7f7]"
                }
                name={"6620"}
                placeholder={"کد ملی را وارد کنید"}
                label={"کد ملی"}
                showLockIcon={false}
                value={formData[6620]}
                onChange={(e) => handleOnChange(e.target.value)}
                labelClassName={"!text-[9px] lg:!text-xs"}
              />

              <div
                className={
                  "flex border-success w-[96px]"
                }
              >
                {refreshActive ? (
                  <Button
                    variant="icon"
                    icon={
                      <GrRefresh
                        color="black"
                        className="xs:text-xs md:text-sm lg:text-xl"
                      />
                    }
                    className={
                      "xs:!rounded-l-none xs:!rounded-r-[2px] md:!rounded-r xs:h-[22px] md:h-[21.6px] lg:h-[25.6px] w-[28px]  !bg-transparent !border-[0.5px] border-success"
                    }
                    onClick={() => {
                      setFormData({ 6620: "" });
                      setUser?.(null);
                    }}
                    type="button"
                  />
                ) : null}

                <Button
                  variant="outlined"
                  title={"جستجو"}
                  type="submit"
                  loading={loading}
                  className={classNames(
                    refreshActive
                      ? "!bg-success xs:!rounded-r-none xs:!rounded-l-[2px] md:!rounded-l !text-white"
                      : "!bg-transparent xs:!rounded-[2px] md:!rounded",
                    "xs:h-[22px] md:h-[21.6px] lg:h-[25.6px] w-full  !border-success  !text-[9px] lg:!text-xs hover:!bg-success hover:text-white"
                  )}
                />
              </div>
            </div>
          </form>
        </FieldSet>
      </section>
    </Fragment>
  );
};

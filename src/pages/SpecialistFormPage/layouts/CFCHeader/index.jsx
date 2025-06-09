/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState, useMemo } from "react";
import { tableSizeList } from "./data";
import classNames from "classnames";
import { GrRefresh } from "react-icons/gr";
import { Button } from "../../../../components/Button";
import { FieldSet } from "../../../../components/FieldSet";
import { Table } from "../../../../components/Table";

import { Label } from "../../../../components/Label";
import { TextField } from "../../../../components/TextField";
import { Select } from "../../../../components/Select";
import { DateInput } from "../../../../components/DateInput";

import HeaderRadioOption from "./HeaderRadioOption";
import SwitchButton from "../../../../components/SwitchButton";

export const CFCHeader = ({
  title = "جست و جو",
  headerItems,

  paziresh_id,
  specialKey,
  useFormContext,
  selectable = true,
  tableColumns,
  request = () => {},
  user,
  setUser,
  users = [],
  setTableInfo,
  setUsers,
  JID,
  toast = () => {},
  colFilter = 6,
  ...props
}) => {
  const getInitialFormData = (items) => {
    return items.reduce((acc, item) => {
      if (item.id) acc[item.id] = null;
      if (item.questionKey) acc[item.questionKey] = null;
      return acc;
    }, {});
  };
  const {
    watch,
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const tableCols = useMemo(() => {
    return ["ردیف", ...tableColumns.map((col) => col.label)];
  }, []);
  const [formData, setFormData] = useState(getInitialFormData(headerItems));
  const [currentPage, setCurrentPage] = useState(1);
  const [tableSize, setTableSize] = useState(tableSizeList[0].value);
  const [initialRequestControl, setIRC] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [activeFilterOption, setAFO] = useState(null);

  const offset = useMemo(() => {
    return tableSize * (currentPage - 1);
  }, [tableSize, currentPage]);

  const rows = useMemo(() => {
    return users.map((user, i) => {
      const rowIndex = (currentPage - 1) * tableSize + i + 1;
      const values = tableColumns.map((field) => {
        const value = user[field.key];
        return field.format ? field.format(value) : value;
      });
      return [rowIndex, ...values];
    });
  }, [users, currentPage, tableSize]);

  const _filteredRows = useMemo(() => {
    return activeFilterOption
      ? users
          .map((user, i) => {
            const rowIndex = (currentPage - 1) * tableSize + i + 1;
            const values = tableColumns.map((field) => {
              const value = user[field.key];
              return field.format ? field.format(value) : value;
            });
            return [rowIndex, ...values];
          })
          .filter((row) => row[colFilter] == activeFilterOption)
      : [[]];
  }, [
    users,
    tableColumns,
    currentPage,
    tableSize,
    activeFilterOption,
    colFilter,
  ]);

  useEffect(() => {
    if (initialRequestControl) {
      _getUsers();
    }
  }, [tableSize, currentPage]);

  const handleOnChange = (value, qKey) => {
  
    if (!(qKey in formData)) return;
    setFormData((prevData) => ({
      ...prevData,
      [qKey]: value ? value : null,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setIRC(initialRequestControl + 1);
    _getUsers();
  };

  // const handleOnChange = (value, qKey) => {
  //   if (qKey == "5143") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 5143: value ? value : null }
  //     })
  //     return
  //   }  else if (qKey == "5144") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 5144: value ? value : null }
  //     })
  //     return
  //   }
  //   else if (qKey == "6620") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 6620: value ? value : null }
  //     })
  //     return
  //   } else if (qKey == "1578727281983") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 1578727281983: value ? value : null }
  //     })
  //   } else if (qKey == "1584351069008") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 1584351069008: value ? value : null }
  //     })
  //   }
  //   else if (qKey == "1584359105492") {
  //     setFormData((prevData) => {
  //       return { ...prevData, 1584359105492: value ? value : null }
  //     })
  //   }
  //   // else {
  //   //   setFormData((prevData) => {
  //   //     if (prevData[1585472454126] == value) {
  //   //       return { ...prevData, 1585472454126: null }
  //   //     } else {
  //   //       return { ...prevData, 1585472454126: value }
  //   //     }
  //   //   })
  //   // }
  // }

  const _getUsers = async () => {
    const options = {
      dataInfo: formData,
    };

    // if (options.dataInfo["6365"]) {
    //   options.dataInfo["1558737412305"] = options.dataInfo["6365"]
    //   options.jobId = JID.RFID
    // } else {
    options.jobId = JID.NID;
    // }
    options.dataInfo.offset = offset;
    options.dataInfo.limit = tableSize;
    setSearchLoading(true);
    await request(options)
      .then((res) => {
        if (res.error) {
          toast.error("خطای دریافت اطلاعات" + "-" + res.error_code);
        } else {
          if (res.data.length == 0) {
            toast.error("هیچ کاربری یافت نشد.");

            setUser(null);
          } else {
            setUsers(res.data);
          }
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setSearchLoading(false));
  };
  const fillFormWithUserData = (userData) => {
    const updatedData = { ...formData };

    headerItems.forEach((item) => {
      const key = item.questionKey;
      if (key && key in userData) {
        updatedData[key] = userData[key];
      }
    });

    setFormData(updatedData);
  };

  const _getUser = async (i) => {
    handleOnChange(users[i][specialKey], specialKey);

    const user = users[i];
    let formData;
    fillFormWithUserData(user);

    if (paziresh_id) {
      formData = {
        1545718677214: users[i]["1545718677214"],
      };
    } else {
      formData = {
        [specialKey]: users[i][specialKey],
      };
    }

    setUserInfoLoading(true);

    try {
      const requests = [
        request({
          jobId: JID.ID,
          dataInfo: formData,
        }),
      ];

      if (JID.ID2) {
        requests.push(
          request({
            jobId: JID.ID2,
            dataInfo: {
              ...formData,
              offset: offset,
              limit: tableSize,
            },
          })
        );
      }

      const responses = await Promise.all(requests);
      const res1 = responses[0];
      const res2 = responses[1];

      if (!res1.error) {
        const userInfo = res1.data || {};
        const extraInfo = !res2?.error ? res2?.data || {} : {};

        setTableInfo(extraInfo);
        setUser({
          ...userInfo,
          1545718677214: users[i]["1545718677214"], // afzoodane id user user info
          // tarikh_paziresh: users[i].date, // afzoodane tarikhe paziresh be user info
        });
        if (userInfo) {
          fillFormWithUserData({ ...userInfo, ...extraInfo });
          handleOnChange(userInfo?.["4942"] || "", "4942");
        } else {
          toast.error("خطای دریافت اطلاعات  " + res1.error_code);
        }
      }

      if (res2?.error) {
        toast.error("خطای دریافت اطلاعات  " + res2.error_code);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUserInfoLoading(false);
    }
  };

  const refreshActive =
    Object.keys(formData).some((key) => formData[key]) && user;

  // const refreshActive =
  //   (formData[5143] ||
  //     formData[5144] ||
  //     formData[6620] ||
  //     formData[1578727281983] ||
  //     formData[1584351069008] ||
  //     formData[1584359105492]) &&
  //   user

  // const filterOptions = rows?.length
  //   ? [...new Set(rows?.map((row) => row[colFilter]))]
  //   : []


  return (
    <Fragment>
      <section className={classNames("rounded-md bg-transparent")}>
        <FieldSet
          title={title}
          className={classNames(
            "relative !border-none !bg-[#EEFEFF] !px-[8px] !shadow-md lg:!mb-8 !mb-4"
          )}
          titleClassName={
            "!bg-transparent !text-black !px-[8px] !text-[14px] !font-700 !translate-y-[35%] lg:!translate-y-[30%] !mr-0"
          }
          gradientBorder={false}
        >
          <form className={"flex flex-col gap-4 lg:gap-8"} onSubmit={onSubmit}>
            {/* Parent جدید برای چهار آیتم اول */}
            <div
              className={classNames(
                headerItems?.length == "8"
                  ? "grid md:grid-cols-4 grid-cols-2 lg:gap-8 gap-4  justify-center items-center"
                  : headerItems?.length == "6"
                  ? "grid md:grid-cols-3 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "3"
                  ? "grid md:grid-cols-3 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "4"
                  ? "grid md:grid-cols-4 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "2"
                  ? "grid md:grid-cols-3 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "7"
                  ? "grid md:grid-cols-3 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "10"
                  ? "grid md:grid-cols-4 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : headerItems?.length == "5"
                  ? "grid md:grid-cols-3 grid-cols-2 lg:gap-8 gap-4 justify-center items-center"
                  : ""
              )}
            >
              {headerItems?.map((item) =>
                item.component == "TextField" ? (
                  <TextField
                    key={item.label}
                    name={item.questionKey}
                    label={item.label}
                    value={formData[item.questionKey]}
                    onChange={(e) =>
                      handleOnChange(e.target.value, item.questionKey)
                    }
                    containerClassName={item.containerClassName}
                    labelClassName={item.labelClassName}
                    className={item.className}
                    {...item.props}
                  />
                ) : item.component == "Select" ? (
                  <Select
                    onChange={(value) =>
                      handleOnChange(value, item.questionKey)
                    }
                    label={item.label}
                    options={item.options}
                    questionKey={item.questionKey}
                    containerClassName={item.containerClassName}
                    control={control}
                    register={register}
                    errors={errors}
                    search={item.search?item.search:false}
                    {...item.props}
                  />
                ) : item.component == "DateInput" ? (
                  <DateInput
                    {...item.props}
                    id={item.id}
                    label={item.label}
                    watch={watch}
                    control={control}
                    errors={errors}
                    containerClassName={item.containerClassName}
                    validation={item.validation}
                    onChange={(date) => {
                      handleOnChange(date.toString(), item.id);
                    }}
                  />
                ) : item.component == "HeaderRadioOption" ? (
                  <HeaderRadioOption
                    {...item.props}
                    options={item.options}
                    formData={formData[item.questionKey]}
                    questionKey={item.questionKey}
                    onChange={(value) => {
                      // setValue(item.questionKey, value); // مقدار رو ست کن
                      handleOnChange(value, item.questionKey); // اگر تابع خارجی وجود داره، صداش کن
                    }}
                    // onChange={(val)=>props.onChange?.(val)}
                  />
                ) : item.component == "HeaderSwitchButton" ? (
                  <SwitchButton
                    options={item.options}
                    onChange={(value) =>
                      handleOnChange(value, item.questionKey)
                    }
                  />
                ) : null
              )}

              {headerItems?.length == "2" ? (
                refreshActive ? (
                  <div>
                    <Label label="button" className="text-transparent" />
                    <Button
                      variant="icon"
                      icon={
                        <GrRefresh
                          color="black"
                          className="xs:text-xs md:text-sm lg:text-xl"
                        />
                      }
                      className={
                        " xs:!rounded-l-none xs:!rounded-r-[2px] md:!rounded-r xs:h-[22px] md:h-[21.6px] lg:h-[25.6px] !bg-transparent !border-[0.5px] border-success  "
                      }
                      onClick={() =>
                        setFormData(getInitialFormData(headerItems))
                      }
                    />
                  </div>
                ) : null
              ) : null}
              {headerItems?.length == "2" ? (
                <div>
                  <Label label="button" className="text-transparent" />
                  <Button
                    variant="outlined"
                    title={
                      props.SubmitTitle ? props.SubmitTitle : "نمایش اطلاعات"
                    }
                    type="submit"
                    loading={searchLoading}
                    className={classNames(
                      refreshActive
                        ? "!bg-success xs:!rounded-r-none xs:!rounded-l-[2px] md:!rounded-l !text-white "
                        : "!bg-transparent xs:!rounded-[2px] md:!rounded",
                      "xs:h-[22px] md:h-[21.6px] lg:h-[25px] !border-success  !font-700 lg:!text-xs !text-[11px] hover:!bg-success hover:text-white w-full !py-[14px]"
                    )}
                  />
                </div>
              ) : null}
            </div>
            {headerItems?.length > "2" ? (
              <div
                className={
                  "border-success  ml-auto md:ml-0 mt-2 md:mt-0 mr-auto md:mr-0 !rounded-[2px] mx-auto w-1/3 self-center flex"
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
                      " xs:!rounded-l-none xs:!rounded-r-[2px] md:!rounded-r xs:h-[22px] md:h-[21.6px] lg:h-[25.6px] !bg-transparent !border-[0.5px] border-success  "
                    }
                    onClick={() => setFormData(getInitialFormData(headerItems))}
                  />
                ) : null}
                <Button
                  variant="outlined"
                  title={
                    props.SubmitTitle ? props.SubmitTitle : "نمایش اطلاعات"
                  }
                  type="submit"
                  loading={searchLoading}
                  className={classNames(
                    refreshActive
                      ? "!bg-success xs:!rounded-r-none xs:!rounded-l-[2px] md:!rounded-l !text-white "
                      : "!bg-transparent xs:!rounded-[2px] md:!rounded",
                    "xs:h-[22px] md:h-[21.6px] lg:h-[25.6px] !border-success  !text-[9px] lg:!text-xs hover:!bg-success hover:text-white w-full"
                  )}
                />
              </div>
            ) : null}
          </form>
        </FieldSet>
        {users?.length ? (
          <Table
            columns={tableCols}
            rows={activeFilterOption ? _filteredRows : rows}
            // colors={[
            //   {
            //     color: "#f7f7f7",
            //     value: "انجام نشده",
            //   },
            //   {
            //     color: "#fff",
            //     value: "انجام شده",
            //   },
            // ]}
            colFilter={colFilter}
            page={currentPage}
            setPage={setCurrentPage}
            setTableSize={setTableSize}
            tableSize={tableSize}
            onSelect={(i) => _getUser(i)}
            pagination
            selectable={selectable ? true : false}
            containerClassName={searchLoading ? "blur-sm" : ""}
            // className={styles.table}
          >
            {/* {filterOptions?.length > 1 ? (
            <div className="flex items-center h-full pr-2 gap-4">
            <span className="text-2xs lg:text-xs font-700">
            نمایش بر اساس :
            </span>
            <div className="flex items-center gap-4">
            {filterOptions.map((o) => (
              <Radio
              key={o}
              label={o}
              className={
                "!bg-transparent !border-none !gap-[1px] lg:!gap-1 !py-0 !px-0"
                }
                name={"filter"}
                value={o}
                checked={o == activeFilterOption}
                onClick={() => {
                  if (activeFilterOption == o) {
                    setAFO(null);
                    } else {
                      setAFO(o);
                  }
                  }}
                  onChange={(e) => e}
                  />
                  ))}
                  </div>
                  </div>
                  ) : null} */}
          </Table>
        ) : (
          <Table
            columns={tableCols}
            rows={[[]]}
            colFilter={colFilter}
            page={currentPage}
            setPage={setCurrentPage}
            setTableSize={setTableSize}
            tableSize={tableSize}
            onSelect={(i) => _getUser(i)}
            pagination
            selectable
            containerClassName={searchLoading ? "blur-sm" : ""}
          ></Table>
        )}
      </section>
    </Fragment>
  );
};

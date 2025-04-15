/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState, useMemo } from "react"
import { tableSizeList } from "./data"
import classNames from "classnames"
import { GrRefresh } from "react-icons/gr"
import { Button } from "../../../../components/Button"
import { FieldSet } from "../../../../components/FieldSet"
import { Table } from "../../../../components/Table"
import { FormFields } from "./FormFields"

export const CFCHeader = ({
  title = "جست و جو",
  headerItems,
  useFormContext,
  tableColumns,
  request = () => {},
  user,
  setUser,
  users = [],
  setUsers,
  JID,
  toast = () => {},
  colFilter = 6,
}) => {
  //create object of questionkey from headerItems
  // const initialFilterValues = headerItems.reduce((acc, item) => {
  //   if (item.id) acc[item.id] = null
  //   if (item.questionKey) acc[item.questionKey] = null
  //   return acc
  // }, {})
  const getInitialFormData = (items) => {
    return items.reduce((acc, item) => {
      if (item.id) acc[item.id] = null
      if (item.questionKey) acc[item.questionKey] = null
      return acc
    }, {})
  }

  //destructured tabel headers from tableColumns array of object
  const tableCols = useMemo(() => {
    return ["ردیف", ...tableColumns.map((col) => col.label)]
  }, [])
  const [formData, setFormData] = useState(getInitialFormData(headerItems))
  const [currentPage, setCurrentPage] = useState(1)
  const [tableSize, setTableSize] = useState(tableSizeList[0].value)
  const [initialRequestControl, setIRC] = useState(0)
  const [searchLoading, setSearchLoading] = useState(false)
  const [userInfoLoading, setUserInfoLoading] = useState(false)
  const [activeFilterOption, setAFO] = useState(null)

  const offset = useMemo(() => {
    return tableSize * (currentPage - 1)
  }, [tableSize, currentPage])

  const rows = useMemo(() => {
    return users.map((user, i) => {
      const rowIndex = (currentPage - 1) * tableSize + i + 1
      const values = tableColumns.map((field) => {
        const value = user[field.key]
        return field.format ? field.format(value) : value
      })
      return [rowIndex, ...values]
    })
  }, [users, currentPage, tableSize])

  const _filteredRows = useMemo(() => {
    return activeFilterOption
      ? users
          .map((user, i) => {
            const rowIndex = (currentPage - 1) * tableSize + i + 1
            const values = tableColumns.map((field) => {
              const value = user[field.key]
              return field.format ? field.format(value) : value
            })
            return [rowIndex, ...values]
          })
          .filter((row) => row[colFilter] == activeFilterOption)
      : [[]]
  }, [
    users,
    tableColumns,
    currentPage,
    tableSize,
    activeFilterOption,
    colFilter,
  ])

  useEffect(() => {
    if (initialRequestControl) {
      _getUsers()
    }
  }, [tableSize, currentPage])

  const onSubmit = (e) => {
    e.preventDefault()
    setIRC(initialRequestControl + 1)
    _getUsers()
  }
  const handleOnChange = (value, qKey) => {
    if (!(qKey in formData)) return // اگر کلید معتبر نیست، هیچ کاری نکن
    setFormData((prevData) => ({
      ...prevData,
      [qKey]: value || null,
    }))
  }

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
    }
    // if (options.dataInfo["6365"]) {
    //   options.dataInfo["1558737412305"] = options.dataInfo["6365"]
    //   options.jobId = JID.RFID
    // } else {
    options.jobId = JID.NID
    // }
    options.dataInfo.offset = offset
    options.dataInfo.limit = tableSize
    setSearchLoading(true)
    await request(options)
      .then((res) => {
        if (res.error) {
          toast.error("خطای دریافت اطلاعات" + "-" + res.error_code)
        } else {
          if (res.data.length == 0) {
            toast.error("هیچ کاربری یافت نشد.")

            setUser(null)
          } else {
            setUsers(res.data)
          }
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setSearchLoading(false))
  }
  const fillFormWithUserData = (userData) => {
    const updatedData = { ...formData }

    headerItems.forEach((item) => {
      const key = item.questionKey
      if (key && key in userData) {
        updatedData[key] = userData[key]
      }
    })

    setFormData(updatedData)
  }
  const _getUser = async (i) => {
    handleOnChange(users[i]["6620"], "6620")

    const user = users[i]

    fillFormWithUserData(user)
    const formData = {
      1545718677214: users[i]["1545718677214"],
    }
    setUserInfoLoading(true)
    await request({
      jobId: JID.ID,
      dataInfo: formData,
    })
      .then((res) => {
        if (!res.error) {
          const userInfo = res?.data

          setUser({
            ...userInfo,
            1545718677214: users[i]["1545718677214"], // afzoodane id user user info
            // tarikh_paziresh: users[i].date, // afzoodane tarikhe paziresh be user info
          })
          if (userInfo) {
            fillFormWithUserData(userInfo || {})
            handleOnChange(userInfo?.["4942"] || "", "4942") // set kardan input code meli dar header
          } else {
            handleOnChange("", "4942")
          }
        } else {
          toast.error("خطای دریافت اطلاعات" + "-" + res.error_code)
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setUserInfoLoading(false))
  }

  const refreshActive =
    Object.keys(formData).some((key) => formData[key]) && user

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
                  : ""
              )}
              // className="flex w-full flex-wrap items-end gap-x-2 md:gap-x-[1vw] lg:gap-x-2 xs:gap-x-[1.3vw] gap-y-3 md:gap-y-4 lg:flex"
            >
              {headerItems?.map((q) => (
                <FormFields
                  component={q.component}
                  options={q.options}
                  key={q.questionKey}
                  label={q.label}
                  id={q.id}
                  questionKey={q.questionKey}
                  BC={""}
                  request={request}
                  useFormContext={useFormContext}
                  containerClassName={q.containerClassName}
                  className={q.className}
                  value={formData[q.questionKey]}
                  onChange={(e) =>
                    handleOnChange(e.target.value, q.questionKey)
                  }
                  labelClassName={q.labelClassName}
                  {...q.props}
                />
              ))}
            </div>
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
                  // onClick={() =>
                  //   setFormData({
                  //     5143: null,
                  //     5144: null,
                  //     6018: null,
                  //     1578727281983: null,
                  //     1584351069008:null,
                  //     1584359105492:null
                  //   })
                  // }
                  onClick={() => setFormData(getInitialFormData(headerItems))}
                />
              ) : null}
              <Button
                variant="outlined"
                title={"نمایش اطلاعات"}
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
            selectable
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
  )
}

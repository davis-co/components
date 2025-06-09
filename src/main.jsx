// import "./index.css";
// export { Button } from "./components/Button/index.jsx";
// export { Divider } from "./components/Divider/index.jsx";
// export { Dropdown } from "./components/Dropdown/index.jsx";
// export { HTML } from "./components/HTML/index.jsx";
// export { Label } from "./components/Label/index.jsx";
// export { Modal } from "./components/Modal/index.jsx";
// export { Page } from "./components/Page/index";
// export { PageCard } from "./components/PageCard/index.jsx";
// export { ProjectName } from "./components/ProjectName/index.jsx";
// export { Table } from "./components/Table/index.jsx";
// export { TextField } from "./components/TextField/index.jsx";
// export { Radio } from "./components/Radio/index.jsx";
// export { RadioOptions } from "./components/RadioOptions/index.jsx";
// export { DateInput } from "./components/DateInput/index.jsx";
// export { CheckBox } from "./components/CheckBox/index.jsx";
// export { CheckBoxGroup } from "./components/CheckBoxGroup/index.jsx";
// export { Select } from "./components/Select/index.jsx";
// export { FieldSet } from "./components/FieldSet/index.jsx";
// export { FileField } from "./components/FileField/index.jsx";
// export { ProgressChart } from "./components/Charts/Progress.jsx";
// export { TextEditor } from "./components/TextEditor/index.jsx";
// export { Tab } from "./components/Tab/index.jsx";
// // layouts
// export { ArchiveTable } from "./layouts/ArchiveTable/index.jsx";
// export { EmptyForm } from "./layouts/EmptyForm/index.jsx";
// export { FormFields } from "./layouts/FormFields/index.jsx";
// export { Header as SpecialistFormPageHeader } from "./pages/SpecialistFormPage/layouts/Header/index.jsx";
// export { CFCHeader } from "./pages/SpecialistFormPage/layouts/CFCHeader/index.jsx";
// // page
// export { SpecialistDashboardPage } from "./pages/SpecialistDashboardPage/index.jsx";
// export { SpecialistPrintPage } from "./pages/SpecialistPrintPage/index.jsx";
// // sections
// export { Prescription } from "./sections/Prescription/index.jsx";

import ReactDOM from "react-dom/client";
import "./index.css";
import { Page } from "./components/Page/index.jsx";
import { Button } from "./components/Button/index.jsx";
import { TextEditor } from "./components/TextEditor/index.jsx";
import { FormFields } from "./layouts/FormFields/index.jsx";
import { Tab } from "./components/Tab/index.jsx";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { SpecialistDashboardPage } from "./pages/SpecialistDashboardPage/index.jsx";
import { SpecialistPrintPage } from "./pages/SpecialistPrintPage/index.jsx";
import { TextField } from "./components/TextField/index.jsx";
import { RadioOptions } from "./components/RadioOptions/index.jsx";
import { Select } from "./components/Select/index.jsx";
import { CheckBoxGroup } from "./components/CheckBoxGroup/index.jsx";
import { CFCHeader } from "./pages/SpecialistFormPage/layouts/CFCHeader/index.jsx";
import SwitchButton from "./components/SwitchButton/index.jsx";
import { Header as SpecialistFormPageHeader } from "./pages/SpecialistDashboardPage/layouts/Header/index.jsx";
import { Prescription } from "./sections/Prescription/index.jsx";
import { DateInput } from "./components/DateInput/index.jsx";
import moment from "jalali-moment";
import { Label } from "./components/Label/index.jsx";

export const getTabs = (watch) => {
  return [
    // isServiceAvailable(watch, ["1509263811768"]) &&

    // isServiceAvailable(watch, ["1578402098317"]) &&

    {
      title: "معاینات چشم پزشک",
      form: <></>,
      tabs: [
        // isServiceAvailable(watch, ["1509264231113"]) &&
        {
          title: "بینایی سنج",
          form: <></>,
        },
        {
          title: "متخصص",
          form: <></>,
        },
        {
          title: "QC چشم",
          form: <></>,
        },
        {
          title: "QCdddd چشم",
          form: <></>,
        },
        {
          title: "QCdddd چشم QCdddd مقدار",
          form: <></>,
        },
        {
          title: "QCdddd چشم",
          form: <></>,
        },
        {
          title: "QCdddd چشم",
          form: <></>,
        },
        {
          title: "QCdddd چشم",
          form: <></>,
        },
      ].filter((item) => item != false && item != null),
    },
    {
      title: "معاینات گوش و حلق و بینی",
      form: <></>,
      tabs: [
        // isServiceAvailable(watch, ["1509264231113"]) &&
        {
          title: "بینایی سنجی",
          form: <></>,
        },
        {
          title: " متخصص گوش و حلق و بینی",
          form: <></>,
        },
        {
          title: "QC گوش",
          form: <></>,
        },
      ].filter((item) => item != false && item != null),
    },
    {
      title: "تخصصی دندان",
      form: <></>,
    },
    {
      title: "اسپیرومتری",
      form: <></>,
      tabs: [
        { title: "اسپیرومتری", form: <></> },
        { title: "QC اسپیرومتری", form: <></> },
      ].filter((item) => item != false && item != null),
    },
    {
      title: "معاینات تخصصی قلب",
      form: <></>,
      tabs: [
        { title: "قلب", form: <></> },
        { title: "QC قلب", form: <></> },
      ].filter((item) => item != false && item != null),
    },
    {
      title: "روانشناسی",
      form: <></>,
      tabs: [
        { title: "روان شناسی", form: <></> },
        { title: "QC روان", form: <></> },
      ].filter((item) => item != false && item != null),
    },
  ].filter((item) => item != false && item != null);
};
const MyFunction = () => {
  const editorRef = useRef(null);

  const methods = useForm({
    mode: "all",
  });
  const [tab, setActiveTab] = useState({});
  const tabRef = useRef(null);
  const handleAppendFromParent = () => {
    if (editorRef.current) {
      editorRef.current.appendText("ّبا سلام واحترام" + "\n"); // Calls the function inside the child component
    }
  };

  //   useEffect(() => {
  //     setTimeout(() => {
  //       editorRef.current.clear();
  //     }, 5000);
  //   }, []);
  const SwitchOptions = [
    { label: "غیرفعال", value: "2" },
    { label: "فعال", value: "6" },
  ];

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const headerItems = [
    {
      component: "DateInput",
      id: "5143",
      label: "از تاریخ (پذیرش)",
      containerClassName: "!shadow-none",
      className: "!bg-white",
    },
    {
      component: "DateInput",
      id: "5144",
      label: "تا تاریخ (پذیرش)",
      containerClassName: "!shadow-none",
      className: "!bg-white",
    },
    // {
    //   component: "Select",
    //   options: [{ label: "dddd", value: "556" }],
    //   questionKey: "1578727281983",
    //   label: "نام قرارداد",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "TextField",
    //   questionKey: "6018",
    //   label: "کد ملی",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   className: "bg-white",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "TextField",
    //   questionKey: "1584351069004",
    //   label: "نام خانوادگی",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   className: "bg-white",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "TextField",
    //   questionKey: "1584351069005",
    //   label: "نام خانوادگی",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   className: "bg-white",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "TextField",
    //   questionKey: "1584351069006",
    //   label: "نام خانوادگی",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   className: "bg-white",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "TextField",
    //   questionKey: "1584351069008",
    //   label: "نام خانوادگی",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   className: "bg-white",
    //   containerClassName: "!shadow-none",
    // },
    // {
    //   component: "HeaderRadioOption",
    //   label: "وضعیت QC",
    //   questionKey: "1586688732636",
    //   options: SwitchOptions,
    // },
    {
      component: "Select",
      options: [{ label: "dddd", value: "556" }],
      questionKey: "1605005480295",
      label: "انتخاب تیم پزشکی",
      labelClassName: "!text-[9px] lg:!text-xs",
      containerClassName: "!shadow-none",
      //   search:true
    },
    // {
    //   component: "Select",
    //   options: [{ label: "dddd", value: "556" }],
    //   questionKey: "1605005461061",
    //   label: "انتخاب پزشک",
    //   labelClassName: "!text-[9px] lg:!text-xs",
    //   containerClassName: "!shadow-none",
    // },
    // { component: "HeaderSwitchButton", label: "سوئیچ", options: SwitchOptions },
  ];
  const HeaderTableColumns = [
    { key: "4941", label: "نام" },
    { key: "4942", label: "نام خانوادگی" },
    { key: "6620", label: "کدملی" },
    { key: "4950", label: "موبایل" },
    // { key: "date", label: "تاریخ اخرین پایش", format: (val) => val ? moment(val).locale("fa").format("YYYY/MM/DD") : "" },
    { key: "1579603635713", label: "نام قرارداد" },
    { key: "1544943430625", label: "نام پکیچ" },
  ];

  return (
    <Page back={true}>
      <FormProvider {...methods}>
        {/* <CFCHeader
          title={"مشخصات کاربر"}
          tableColumns={HeaderTableColumns}
          user={user}
          users={users}
          setUsers={setUsers}
          setUser={setUser}
          request={() => {}}
          //   toast={toast}
          useFormContext={useFormContext}
          headerItems={headerItems}
          SubmitTitle="تست باتن"
          JID={{
            // RFID: JID.RFID,
            NID: 1,
            ID: 2,
          }}
        /> */}
        <Select
          questionKey={"555"}
          options={HeaderTableColumns}
          // search={true}
          // onChange={() =>watch("555")}
          useFormContext={useFormContext}
          control={methods.control}
          register={methods.register}
        />
        {/* <CFCHeader  useFormContext={useFormContext}/> */}
        {/* <TextEditor
          ref={editorRef}
          useFormContext={useFormContext}
          questionKey="123"
          label="سوال"
        /> */}
        <Tab
          tabs={getTabs(methods.watch)}
          active={tab}
          onChange={setActiveTab}
          ref={tabRef}
        />
        {/* <Header
          title={"مشخصات کاربر"}
          user={user}
          users={users}
          setUsers={setUsers}
          setUser={setUser}
          request={()=>{}}
          // toast={toast}
          JID={{
            RFID: "1",
            NID: "2",
            ID: "3",
          }}
        /> */}
        {/* <SwitchButton SwitchOptions={SwitchOptions}/> */}
        {/* <Select options={[{label:"dddf",value:"555"}]}/>
        <TextField useFormContext={useFormContext} questionKey={"6555"} value={"نوشته"}/>
        <Prescription  drugsList={methods.watch("1730017486062")}
        onChange={(val) => methods.setValue("1730017486062", val)}/>
        <DateInput
        divider={"center"}
        watch={methods.watch}
        errors={""}
        id="1556915100056"
        label={"تاریخ تماس"}
        containerClassName="!shadow-none"
        className="!bg-white"/> */}
        <RadioOptions options={[{label:"fdfgdfgfd",value:"4522"}]} label="بررسی زیر با رعایت اصول اخلاق پزشکی و رازداری و مراعات حریم خصوصی و حقوق فرد، فقط درجهت اهداف پزشکی برای ارتقای سلامت و استفاده تیم پزشکی از مراجعه کننده پرسیده شود:"
        labelMore={true}/>
      </FormProvider>
    </Page>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <StrictMode>
  <MyFunction />
);

import "./index.css";
export { Button } from "./components/Button/index.jsx";
export { Divider } from "./components/Divider/index.jsx";
export { Dropdown } from "./components/Dropdown/index.jsx";
export { HTML } from "./components/HTML/index.jsx";
export { Label } from "./components/Label/index.jsx";
export { Modal } from "./components/Modal/index.jsx";
export { Page } from "./components/Page/index";
export { PageCard } from "./components/PageCard/index.jsx";
export { ProjectName } from "./components/ProjectName/index.jsx";
export { Table } from "./components/Table/index.jsx";
export { TextField } from "./components/TextField/index.jsx";
export { Radio } from "./components/Radio/index.jsx";
export { RadioOptions } from "./components/RadioOptions/index.jsx";
export { DateInput } from "./components/DateInput/index.jsx";
export { CheckBox } from "./components/CheckBox/index.jsx";
export { CheckBoxGroup } from "./components/CheckBoxGroup/index.jsx";
export { Select } from "./components/Select/index.jsx";
export { FieldSet } from "./components/FieldSet/index.jsx";
export { FileField } from "./components/FileField/index.jsx";
export { ProgressChart } from "./components/Charts/Progress.jsx";
export { TextEditor } from "./components/TextEditor/index.jsx";
export { Tab } from "./components/Tab/index.jsx";
// layouts
export { ArchiveTable } from "./layouts/ArchiveTable/index.jsx";
export { EmptyForm } from "./layouts/EmptyForm/index.jsx";
export { FormFields } from "./layouts/FormFields/index.jsx";
export { Header as SpecialistFormPageHeader } from "./pages/SpecialistFormPage/layouts/Header/index.jsx";
// page
export { SpecialistDashboardPage } from "./pages/SpecialistDashboardPage/index.jsx";
export { SpecialistPrintPage } from "./pages/SpecialistPrintPage/index.jsx";
// sections
export { Prescription } from "./sections/Prescription/index.jsx";


// import ReactDOM from "react-dom/client";
// import "./index.css";
// import { Page } from "./components/Page/index.jsx";
// import { Button } from "./components/Button/index.jsx";
// import { TextEditor } from "./components/TextEditor/index.jsx";
// import { FormFields } from "./layouts/FormFields/index.jsx";
// import { Tab } from "./components/Tab/index.jsx";
// import { FormProvider, useForm, useFormContext } from "react-hook-form";
// import { useEffect, useRef, useState } from "react";
// import { SpecialistDashboardPage } from "./pages/SpecialistDashboardPage/index.jsx";
// import { SpecialistPrintPage } from "./pages/SpecialistPrintPage/index.jsx";
// import { TextField } from "./components/TextField/index.jsx";
// import { RadioOptions } from "./components/RadioOptions/index.jsx";
// import { Select } from "./components/Select/index.jsx";
// import { CheckBoxGroup } from "./components/CheckBoxGroup/index.jsx";


// const MyFunction = () => {
//   const editorRef = useRef(null);

//   const methods = useForm({
//     mode: "all",
//   });
//   const [tab, setActiveTab] = useState({});
//   const tabRef = useRef(null);
//   const handleAppendFromParent = () => {
//     if (editorRef.current) {
//       editorRef.current.appendText("ّبا سلام واحترام" + "\n"); // Calls the function inside the child component
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       editorRef.current.clear();
//     }, 5000);
//   }, []);

//   return (
//     <Page back={true}>
//       <FormProvider {...methods}>
//         {/* <TextEditor
//           ref={editorRef}
//           useFormContext={useFormContext}
//           questionKey="123"
//           label="سوال"
//         /> */}
//         <TextField label={"title"}
//         divider={"center"}/>
//         <RadioOptions label="ddddfgfgdfgf" options={[{label:"fdfdf",value:"5454"}]}/>
//         <Select label="select" options={[{label:"fdfdf",value:"5454"}]}/>
//         <CheckBoxGroup label="check" options={[{label:"fdfdf",value:"5454"}]}/>
//       </FormProvider>
//     </Page>
//   );
// };

// ReactDOM.createRoot(document.getElementById("root")).render(
//   //   <StrictMode>
//   <MyFunction />
// );

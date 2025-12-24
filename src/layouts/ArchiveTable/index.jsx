/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Archvie_Table_Columns } from "./data";
import { VscLoading } from "react-icons/vsc";
import moment from "jalali-moment";
import { Table } from "../../components/Table";


export function ArchiveTable({ options }) {
  const {
    jobID,
    BC,
    userID,
    questionKey,
    request,
    renderCell = (val) => Number(val)?.toFixed(2),
  } = options;
  const [currentPage, setPage] = useState(1);
  const [tableSize, setTableSize] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArchive = useCallback(async () => {
    // Extract numeric part from questionKey if it starts with "file_"
    // Remove "file_" prefix if present, otherwise use questionKey as is
    let oi = questionKey;
    if (
      questionKey &&
      typeof questionKey === "string" &&
      questionKey.startsWith("file_")
    ) {
      oi = questionKey.replace(/^file_/, ""); // Remove "file_" prefix
    }

    console.log("ArchiveTable - questionKey:", questionKey);
    console.log("ArchiveTable - oi (after processing):", oi);

    const formData = {
      jobId: jobID,
      dataInfo: {
        qbc: BC,
        oi: oi,
        6483: userID,
        limit: tableSize,
        offset: 0,
      },
    };

    console.log("ArchiveTable - formData.dataInfo:", formData.dataInfo);

    setLoading(true);

    await request(formData)
      .then((res) => setTableData(res.data))
      .finally(() => setLoading(false));
  }, [jobID, BC, userID, questionKey, request, tableSize]);

  useEffect(() => {
    getArchive();
  }, [getArchive]);

  const renderTable = () => (
    <Table
      containerClassName={"w-[270px] md:w-[450px] lg:w-[500px]"}
      rows={tableData.map((item, i) => [
        currentPage * (i + 1),
        moment(item.time).locale("fa").format("YYYY/MM/DD"),
        renderCell(item.score),
      ])}
      stripe
      columns={Archvie_Table_Columns}
      pagination={false}
      page={currentPage}
      setPage={setPage}
      tableSize={tableSize}
      setTableSize={setTableSize}
    />
  );

  const renderLoadingState = () => (
    <div className={"w-[350px] h-[100px] flex justify-center items-center"}>
      <VscLoading className={"text-2xl text-success animate-spin"} />
    </div>
  );

  const renderEmptyState = () => (
    <div
      className={
        "w-[80vw] md:w-[350px] h-[100px] flex justify-center items-center"
      }
    >
      <p>آرشیو خالی است.</p>
    </div>
  );

  return (
    <div>
      {loading
        ? renderLoadingState()
        : tableData?.length
        ? renderTable()
        : renderEmptyState()}
    </div>
  );
}

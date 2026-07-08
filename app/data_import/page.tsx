"use client";

import { useRef, useState } from "react";

export default function DataImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<string[]>([]);

  const openFile = () => {
    inputRef.current?.click();
  };

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const list = text.split(/\r?\n/);

      setRows(list);
    };

    reader.readAsText(file, "utf-8");
  };
const saveData = () => {
  localStorage.setItem("sukys-data", JSON.stringify(rows));
  alert(`${rows.length}건 저장 완료`);
};
  return (
    <main style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>📂 기존 데이터 가져오기</h1>

      <button
        onClick={openFile}
        style={{
          padding: "15px 25px",
          fontSize: 18,
          borderRadius: 10,
          border: "none",
          background: "#5B5CEB",
          color: "white",
          cursor: "pointer",
        }}
      >
        TSV 선택
      </button>
<button
  onClick={saveData}
  style={{
    padding: "15px 25px",
    marginLeft: 10,
    border: "none",
    borderRadius: 10,
    background: "green",
    color: "white",
    cursor: "pointer",
  }}
>
  💾 SUKY'S RM에 등록
</button>
      <input
        type="file"
        ref={inputRef}
        accept=".tsv,.csv"
        hidden
        onChange={readFile}
      />

      <h2 style={{ marginTop: 30 }}>
        읽은 줄 수 : {rows.length}
      </h2>

      <div style={{ marginTop: 20 }}>
     <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr style={{ background: "#5B5CEB", color: "white" }}>
      <th style={{ padding: 8 }}>날짜</th>
      <th style={{ padding: 8 }}>담당자</th>
      <th style={{ padding: 8 }}>물품</th>
      <th style={{ padding: 8 }}>가격</th>
      <th style={{ padding: 8 }}>결제</th>
      <th style={{ padding: 8 }}>상환</th>
    </tr>
  </thead>

  <tbody>
    {rows
      .slice(1)
      .filter((row) => row.trim() !== "")
      .slice(0, 20)
      .map((row, index) => {
        const col = row.split("\t");
const saveData = () => {
  localStorage.setItem("sukys-data", JSON.stringify(rows));
  alert(`${rows.length}건 저장 완료`);
};
        return (
          <tr key={index}>
            <td style={{ padding: 8 }}>{col[0]}</td>
            <td style={{ padding: 8 }}>{col[1]}</td>
            <td style={{ padding: 8 }}>{col[2]}</td>
            <td style={{ padding: 8, textAlign: "right" }}>{col[3]}</td>
            <td style={{ padding: 8 }}>{col[5]}</td>
            <td style={{ padding: 8 }}>{col[6]}</td>
          </tr>
        );
      })}
  </tbody>
</table>
      </div>
    </main>
  );
}
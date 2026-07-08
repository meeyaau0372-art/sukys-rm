"use client";

import { useEffect, useState } from "react";
const navBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 12,
  background: "linear-gradient(135deg,#ffb6d9,#ff8fbc)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(255,105,180,.3)",
};

const topRightBar = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};
export default function ReviewPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sukys-data");

    if (saved) {
      setRows(JSON.parse(saved));
    }
  }, []);

  return (
    <main
  style={{
    padding: 30,
    fontFamily: "sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
  }}
>
    <div
  style={{
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 100,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <h2
    style={{
      margin: 0,
      fontSize: 38,
      fontWeight: "800",
      color: "#ff5fa2",
      letterSpacing: "1px",
    }}
  >
    🌸 리뷰관리
  </h2>

  <div style={topRightBar}>
    <button style={navBtn} onClick={() => location.href = "/"}>
      🏠 홈
    </button>

    <button style={navBtn} onClick={() => location.href = "/purchase-list"}>
      📋 구매내역
    </button>
  </div>
</div>

      <h3
  style={{
    color: "#666",
    marginTop: 15,
    marginBottom: 20,
  }}
>
  📝 리뷰 미작성 :
  {rows.filter((row) => !row.writeDate).length}건
</h3>
      <table
        style={{
          width: "900px",
margin: "20px auto",
          borderCollapse: "collapse",
          marginTop: 20,
        }}
      >
        <thead>
          <tr
  style={{
    background: "#ff82c3",
    color: "#fff",
  }}
>
            <th
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  날짜
</th>
<th
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  담당자
</th>
           <th
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  물품
</th>
         <th
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  작성일자
</th>
         
          </tr>
        </thead>
<tbody>

{rows
  .filter((row) => !row.writeDate)
  .sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  .map((row, index) => (
    <tr key={index}>
      <td
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  {row.date}
</td>
<td
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  {row.manager}
</td>
<td
  style={{
    padding: 8,
    border: "1px solid #ddd",
  }}
>
  {row.item}
</td>
<td
  onClick={() => {
    const today = new Date().toISOString().slice(0, 10);

    const list = [...rows];
    list[index].writeDate = today;

    setRows(list);
    localStorage.setItem("sukys-data", JSON.stringify(list));
  }}
  style={{
    padding: 8,
    border: "1px solid #ddd",
    cursor: "pointer",
    textAlign: "center",
  }}
>
  {row.writeDate || ""}
</td>

    </tr>
  ))}
</tbody>
        
      </table>
    </main>
  );
  
}
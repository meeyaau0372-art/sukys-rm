"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type Row = {
  id: number;
  date: string;
  manager: string;
  item: string;
  bangje: string;
  price: string;
  payback: string;
  method: string;
  repay: string;
  writeDate: string;
  reviewFee: string;
cardRepay: string;

};

/* 결제방법 8개 (그대로 사용) */
const paymentMethods = [
  "김토끼",
  "신한",
  "카카오",
  "우리",
  "롯데",
  "삼성",
  "하나",
  "현금",
];

export default function PurchaseListPage() {
 
  const router = useRouter();

  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [methodFilter, setMethodFilter] = useState("전체");

  useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .order("date", { ascending: false });

if (!error && data) {
  console.log("loadData", data.length, data[0]);
  setRows(data as Row[]);
}
};


const save = (data: Row[]) => {
  setRows(data);
};

  const toggleSelect = (i: number) => {
  setSelected((p) =>
    p.includes(i) ? p.filter((x) => x !== i) : [...p, i]
  );
};

const toggleAll = () => {
  const allIndexes = filteredRows.map(({ index }) => index);

  const isAllSelected = allIndexes.every((i) =>
    selected.includes(i)
  );

  if (isAllSelected) {
    setSelected([]);
  } else {
    setSelected(allIndexes);
  }
};

  const edit = (i: number, key: keyof Row, value: string) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [key]: value };
    save(copy);
  };

 const toggleBool = async (i: number, key: "payback" | "repay") => {
  const row = rows[i];

  const newValue = row[key] === "TRUE" ? "FALSE" : "TRUE";

  const { error } = await supabase
    .from("purchases")
    .update({
      [key]: newValue,
    })
    .eq("id", row.id);

  if (error) {
    alert("저장 실패 : " + error.message);
    return;
  }

  loadData();
};

  const deleteRows = () => {
    const filtered = rows.filter((_, i) => !selected.includes(i));
    setSelected([]);
    save(filtered);
  };

  const moveRows = () => {
    // 선택한 행
    const selectedRows = rows.filter((_, i) => selected.includes(i));

    // 기존 완료 목록 불러오기
    const doneRows = JSON.parse(
      localStorage.getItem("done-data") || "[]"
    );

    // 기존 + 새 데이터 합치기
    const newDoneRows = [...doneRows, ...selectedRows];
    localStorage.setItem("done-data", JSON.stringify(newDoneRows));

    // 구매목록에서는 제거
    const remaining = rows.filter((_, i) => !selected.includes(i));
    setSelected([]);
    save(remaining);

    router.push("/done");
  };
 const cardRepay = async () => {
  const ids = selected.map((i) => rows[i].id);

  const { error } = await supabase
    .from("purchases")
    .update({
      cardRepay: "TRUE",
      repay: "TRUE",
    })
    .in("id", ids);

  if (error) {
    alert(error.message);
    return;
  }

  setSelected([]);
  loadData();
};

const dot = (v: string) => (v === "TRUE" ? "🟢" : "🔴");

const selectedTotal = selected.reduce((sum, i) => {
  const row = rows[i];
  if (!row) return sum;

  return sum + Number(String(row.price).replace(/,/g, ""));
}, 0);

console.log("rows =", rows.length);

const filteredRows = rows
  
    .map((row, index) => ({ row, index }))
    .filter(({ row }) =>
        row.payback === "TRUE" &&
    row.repay !== "TRUE" &&
row.cardRepay !== "TRUE" &&
        (methodFilter === "전체" || row.method === methodFilter)
         )
    .sort((a, b) => {
      const [am, ad] = a.row.date.split("/").map(Number);
      const [bm, bd] = b.row.date.split("/").map(Number);

      return bm * 100 + bd - (am * 100 + ad);
    });
  const unpaidByMethod = filteredRows.reduce((acc, { row: r }) => {
    const price = Number(String(r.price || "0").replace(/,/g, ""));
    if (r.payback !== "TRUE") {
      acc[r.method] = (acc[r.method] || 0) + price;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalUnpaid = Object.values(unpaidByMethod).reduce((a, b) => a + b, 0);


  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={content}>

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
            💳 카드상환
          </h2>

          <div style={topRightBar}>
            <button style={navBtn} onClick={() => router.push("/")}>
              🏠 홈
            </button>

            <button style={navBtn} onClick={() => router.push("/purchase")}>
              🛍 구매등록
            </button>
<button
  style={navBtn}
  onClick={() => router.push("/purchase-list")}
>
  📋 구매내역
</button>

            <button
  style={navBtn}
  onClick={() => router.push("/deposit-check")}


>
  💰 입금확인
</button>
          </div>
        </div>

        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
            <div
  style={{
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 15,
  }}
><button
  onClick={() => setMethodFilter("전체")}
  style={{
    ...activeBtn,
    background:
      methodFilter === "전체" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "전체" ? "#fff" : "#555",
  }}
>
  전체
</button>

 <button
  onClick={() => setMethodFilter("신한")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "신한" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "신한" ? "#fff" : "#555",
  }}
>
  신한
</button>
  <button
  onClick={() => setMethodFilter("카카오")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "카카오" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "카카오" ? "#fff" : "#555",
  }}
>
  카카오
</button>
 <button
  onClick={() => setMethodFilter("삼성")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "삼성" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "삼성" ? "#fff" : "#555",
  }}
>
  삼성
</button>
  <button
  onClick={() => setMethodFilter("김토끼")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "김토끼" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "김토끼" ? "#fff" : "#555",
  }}
>
  김토끼
</button>
  <button
  onClick={() => setMethodFilter("롯데")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "롯데" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "롯데" ? "#fff" : "#555",
  }}
>
  롯데
</button>
  <button
  onClick={() => setMethodFilter("하나")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "하나" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "하나" ? "#fff" : "#555",
  }}
>
  하나
</button>
 <button
  onClick={() => setMethodFilter("우리")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "우리" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "우리" ? "#fff" : "#555",
  }}
>
  우리
</button>
 <button
  onClick={() => setMethodFilter("현금")}
  style={{
    ...cardBtn,
    background:
      methodFilter === "현금" ? "#ff82c3" : "#eee",
    color:
      methodFilter === "현금" ? "#fff" : "#555",
  }}
>
  현금
</button>
<button
  onClick={cardRepay}
  style={{
    padding: "8px 20px",
    border: "none",
    borderRadius: 10,
    background: "#ff82c3",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  상환완료
</button>
</div>
        </div>

        <div
          style={{
            height: "calc(100vh - 280px)",
            overflowY: "auto",
            border: "1px solid #ddd",
          }}
        >
          <table style={table}>
            <thead>
              <tr>
                <th style={{ ...w40, ...stickyHeader }}>
  <input
    type="checkbox"
    checked={
      filteredRows.length > 0 &&
      filteredRows.every(({ index }) => selected.includes(index))
    }
    onChange={toggleAll}
  />
</th>
                <th style={{ ...w90, ...stickyHeader }}>월일</th>
                <th style={{ ...w90, ...stickyHeader }}>담당자</th>
                <th style={{ ...w140, ...stickyHeader }}>구매물품</th>
                <th style={{ ...w140, ...stickyHeader }}>방제</th>
                <th style={{ ...w110, ...stickyHeader }}>가격</th>
                <th style={{ ...w30, ...stickyHeader }}>입금</th>
                <th style={{ ...w70, ...stickyHeader }}>결제방법</th>
                <th style={{ ...w30, ...stickyHeader }}>상환</th>
                <th style={{ ...w90, ...stickyHeader }}>작성일자</th>
                <th style={{ ...w80, ...stickyHeader }}>리뷰비</th>
              </tr>
            </thead>


            <tbody>
              {filteredRows.map(({ row: r, index }) => (
                <tr
  key={index}
  onClick={() => toggleSelect(index)}
  style={{
    height: 48,
    cursor: "pointer",
    background: selected.includes(index)
      ? "#fff7cc"
      : "#fff",
  }}
>

                  <td style={cellCenter}>
  <input
  type="checkbox"
  checked={selected.includes(index)}
  onClick={(e) => e.stopPropagation()}
  onChange={() => toggleSelect(index)}
/>
</td>

<td style={cellCenter}>{r.date}</td>
<td style={cellCenter}>{r.manager}</td>
<td style={cellCenter}>{r.item}</td>
<td style={cellCenter}>{r.bangje}</td>
<td style={cellRight}>
  {Number(String(r.price).replace(/,/g, "")).toLocaleString()}
</td>

                                    <td style={cellCenter} onClick={() => toggleBool(index, "payback")}>{dot(r.payback)}</td>

                  <td style={cellCenter}>
                    <select
                      value={r.method}
                      onChange={(e) => edit(index, "method", e.target.value)}
                      style={{ width: "100%" }}
                    >
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </td>

                  <td style={cellCenter}>
  {dot(r.repay)}
</td>
                  <td style={cellCenter}>
                    <input
                      style={input}
                      value={r.writeDate}
                      onClick={() => {
                        if (!r.writeDate) {
                          const today = new Date();
                          const mm = today.getMonth() + 1;
                          const dd = today.getDate();

                          edit(index, "writeDate", `${mm}/${dd}`);
                        }
                      }}
                      onChange={(e) => edit(index, "writeDate", e.target.value)}
                    />
                  </td>
                  <td style={cellCenter}><input style={input} value={r.reviewFee} onChange={(e) => edit(index, "reviewFee", e.target.value)} /></td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div
  style={{
    marginTop: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    background: "#fff4fa",
    borderRadius: 12,
    border: "2px solid #ffb6d9",
  }}
>
  <span style={{ fontSize: 20, fontWeight: "bold" }}>
    선택건수 : {selected.length}건
  </span>

  <span
    style={{
      fontSize: 28,
      fontWeight: "800",
      color: "#ff5fa2",
    }}
  >
    {selectedTotal.toLocaleString()}원
  </span>
</div>
      </div>
 </div>
      );
}

      /* styles 동일 유지 */
      const nav = {
        position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 55,
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "0 15px",
      background: "#5B5CEB",
      color: "#fff",
      zIndex: 9999,
};

      const content = {
        maxWidth: 1200,
      margin: "0 auto",
      paddingTop: 20,
      height: "100vh",
      display: "flex",
      flexDirection: "column" as const,
};

      const table = {
        width: "100%",
      borderCollapse: "collapse" as const,
      tableLayout: "fixed" as const,
};

      const w30 = {width: 30, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const w40 = {width: 40, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const w70 = {width: 70, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const w80 = {width: 80, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const w90 = {width: 90, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const w110Right = {width: 110, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "right" as const };
      const w110 = {
        width: 110,
      border: "1px solid #aaa",
      background: "#5B5CEB",
      color: "#fff",
      textAlign: "center" as const,
};
      const w140 = {width: 140, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
      const stickyHeader = {
        position: "sticky" as const,
      top: 0,
      zIndex: 10,
};
      const cellCenter = {
        border: "1px solid #ddd",
      textAlign: "center" as const,
      padding: "16px 6px",
};

      const cellRight = {
        border: "1px solid #ddd",
      textAlign: "right" as const,
      padding: "16px 6px",
};

      const input = {
        width: "100%",
      border: "none",
      outline: "none",
      boxSizing: "border-box" as const,
};

      const btn = {
        padding: "6px 12px",
      border: "1px solid #aaa",
      background: "#fff",
      cursor: "pointer",
};

      const navBtn = {
        padding: "8px 18px",
      border: "none",
      borderRadius: 12,
      background: "linear-gradient(135deg, #ffb6d9, #ff8fbc)",
      color: "#fff",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(255,105,180,0.3)",
      transition: "0.2s",
};

      const topRightBar = {
        display: "flex",
      justifyContent: "flex-end",
      gap: 6,
      marginBottom: 10,
};

      const searchWrap = {
        marginTop: 10,
      display: "flex",
      justifyContent: "flex-end",
};

      const searchInput = {
        width: 260,
      padding: "6px 10px",
      border: "1px solid #aaa",
      borderRadius: 6,
};

      const summaryBox = {
        display: "flex",
      gap: 12,
      flexWrap: "wrap" as const,
      marginBottom: 10,
};

      const summaryItem = {
        padding: "6px 10px",
      border: "1px solid #ddd",
      borderRadius: 6,
      background: "#f5f5f5",
};
const activeBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 20,
  background: "#ff82c3",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 20,
  background: "#eee",
  color: "#555",
  cursor: "pointer",
  fontWeight: "bold",
};
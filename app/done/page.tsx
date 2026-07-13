"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";


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
  reviewPaid: string;
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
  const [search, setSearch] = useState("");

const loadData = async () => {
  const { data, error } = await supabase
    .from("done")
    .select("*")
    .order("date", { ascending: false });

    console.log(data, error);

  if (!error && data) {
    setRows(data as Row[]);
  }
};

useEffect(() => {
  loadData();
}, []);

const save = (data: Row[]) => {
  setRows(data);
};

  const edit = (i: number, key: keyof Row, value: string) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [key]: value };
    save(copy);
  };

  const toggleBool = (i: number, key: "payback" | "repay") => {
    const copy = [...rows];
    copy[i][key] = copy[i][key] === "TRUE" ? "FALSE" : "TRUE";
    save(copy);
  };

  const deleteRows = () => {
    const filtered = rows.filter((_, i) => !selected.includes(i));
    setSelected([]);
    save(filtered);
  };
const toggleSelect = (id: number) => {
  setSelected((p) =>
    p.includes(id)
      ? p.filter((x) => x !== id)
      : [...p, id]
  );
};

const restoreRows = async () => {
  // 완료방 데이터
  const doneRows = [...rows];

  // 선택한 행
  const restoreData = rows.filter((r) =>
  selected.includes(r.id)
);

 // purchases 테이블에 다시 저장
const { error: insertError } = await supabase
  .from("purchases")
.insert(
  restoreData.map(({ id, ...rest }) => rest)
);



if (insertError) {
  return;
}

// done 테이블에서 삭제
const ids = restoreData.map((r) => r.id);

const { error: deleteError } = await supabase
  .from("done")
  .delete()
  .in("id", ids);

if (deleteError) {
  alert(deleteError.message);
  return;
}

setSelected([]);
loadData();
router.push("/purchase-list"); 
};

  const dot = (v: string) => (v === "TRUE" ? "🟢" : "🔴");

  const filteredRows = rows
  .map((row, index) => ({ row, index }))
  .filter(({ row }) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

    return (
    <div style={{ fontFamily: "sans-serif" }}>

      

      <div style={content}>

        <div style={topRightBar}>
  <button style={navBtn} onClick={() => router.push("/")}>🏠 홈</button>
<button style={navBtn} onClick={() => router.push("/purchase")}>🛍️ 구매등록</button>
<button style={navBtn} onClick={() => router.push("/deposit")}>💳 입금</button>
<button style={navBtn} onClick={() => router.push("/purchase-list")}>✅ 구매내역조회 </button>

</div>

 
     

        
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  }}
><h2
  style={{
    margin: "0 0 20px 0",
    fontSize: 38,
    fontWeight: 800,
    color: "#ff5fa2",
    letterSpacing: "1px",
  }}
>
  🌸 완료목록조회
</h2>
  <div style={{ display: "flex", gap: 10 }}>
    <button style={btn} onClick={deleteRows}>삭제</button>
    <button style={btn} onClick={restoreRows}>복원</button>
  </div>

  <input
    style={searchInput}
    placeholder="전체 검색"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

        <table style={table}>
          <thead>
            <tr>
              <th style={w40}>선택</th>
              <th style={w90}>월일</th>
              <th style={w90}>담당자</th>
              <th style={w140}>구매물품</th>
              <th style={w140}>방제</th>
              <th style={w110Right}>가격</th>
              <th style={w30}>입금</th>
              <th style={w70}>결제방법</th>
              <th style={w30}>상환</th>
              <th style={w90}>작성일자</th>
              <th style={w80}>리뷰비</th>
            </tr>
          </thead>

          <tbody>
         {filteredRows.map(({ row: r, index }) => (
              <tr key={index} style={{ height: 48 }}>

                <td style={cellCenter}>
                  <input
                    type="checkbox"
                    checked={selected.includes(r.id)}
onChange={() => toggleSelect(r.id)}
                  />
                </td>

                <td style={cellCenter}><input style={input} value={r.date} onChange={(e)=>edit(index,"date",e.target.value)} /></td>
                <td style={cellCenter}><input style={input} value={r.manager} onChange={(e)=>edit(index,"manager",e.target.value)} /></td>
                <td style={cellCenter}><input style={input} value={r.item} onChange={(e)=>edit(index,"item",e.target.value)} /></td>
                <td style={cellCenter}><input style={input} value={r.bangje} onChange={(e)=>edit(index,"bangje",e.target.value)} /></td>

                <td style={{ ...cellRight }}>
                  <input style={{ ...input, textAlign: "right" }} value={r.price} onChange={(e)=>edit(index,"price",e.target.value)} />
                </td>

                <td style={cellCenter} onClick={() => toggleBool(index,"payback")}>{dot(r.payback)}</td>

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

                <td style={cellCenter} onClick={() => toggleBool(index,"repay")}>{dot(r.repay)}</td>
                <td style={cellCenter}><input style={input} value={r.writeDate} onChange={(e)=>edit(index,"writeDate",e.target.value)} /></td>
                <td style={cellCenter}><input style={input} value={r.reviewFee} onChange={(e)=>edit(index,"reviewFee",e.target.value)} /></td>

              </tr>
            ))}
          </tbody>
        </table>

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
  paddingTop: 80,
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  tableLayout: "fixed" as const,
};

const w30 = { width: 30, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
const w40 = { width: 40, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
const w70 = { width: 70, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
const w80 = { width: 80, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
const w90 = { width: 90, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };
const w110Right = { width: 110, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "right" as const };
const w140 = { width: 140, border: "1px solid #aaa", background: "#5B5CEB", color: "#fff", textAlign: "center" as const };

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
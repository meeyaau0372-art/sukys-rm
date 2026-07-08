"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
const [rows, setRows] = useState<any[]>([]);
 const headerColor = "#ff82c3";

 useEffect(() => {
  const saved = localStorage.getItem("sukys-data");

  if (saved) {
    setRows(JSON.parse(saved));
  }
}, []);
 const cardBtn = {

background: "linear-gradient(135deg,#ff9ed0,#ff82c3)",
  color: "#fff",
 border: "1px solid rgba(255,255,255,.45)",
  borderRadius: 28,
  height: 105,
  width: "100%",
  cursor: "pointer",
fontSize: 22,
  fontWeight: 800,
 boxShadow:
  "0 8px 20px rgba(255,130,195,.22), inset 0 2px 0 rgba(255,255,255,.45)",
  transition: "all .25s",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  position: "relative" as const,
overflow: "hidden" as const,
}; 

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff8fc",
        fontFamily: "sans-serif",
      }}
    >
      <div
  style={{
    width: 620,
    background:"#fff5fa",
    border:"2px solid #ffd8ea",
    borderRadius: 28,
    padding: 40,
    boxShadow: "0 12px 28px rgba(255,150,190,.18)",
    transform: "translateY(-65px)",
  }}
>

        {/* 타이틀 */}
       <div
  style={{
    textAlign: "center",
    marginBottom: 35,
  }}
>
  <div
  style={{
    fontSize: 42,
    marginBottom: 8,
  }}
>
  🌸
</div>

<h1
  style={{
    margin: 0,
    fontSize: 50,
    color: "#ff6fb5",
    fontWeight: 700,
    letterSpacing: "-1px",
    fontFamily: "var(--font-geist-sans)",
  }}
>
  Suky's RM
</h1>

  <div
  style={{
    marginTop: 12,
    fontSize: 18,
    color: "#8b8b8b",
    letterSpacing: 2,
    fontWeight: 500,
  }}
>
  My Purchase Manager
<div
  style={{
    width: 55,
    height: 3,
    background: "#ff82c3",
    margin: "18px auto",
    borderRadius: 20,
  }}
/>

  </div>
</div>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 22,
  }}
>
  <Link href="/purchase" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>구매등록</button>
  </Link>

  <Link href="/ocr" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>OCR등록</button>
  </Link>

  <Link href="/purchase-list" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>구매내역</button>
  </Link>

  <Link href="/review" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>리뷰관리</button>
  </Link>

  <Link href="/deposit-check" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>입금관리</button>
  </Link>

  <Link href="/card-repay" style={{ textDecoration: "none" }}>
    <button style={cardBtn}>카드상환</button>
  </Link>

  <div
  style={{
    gridColumn: "1 / -1",
    marginTop: 35,
   background:"#fff5fa",
    borderRadius: 24,
    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "22px 10px",
    border: "1px solid #ffe1ef",
  }}
>
  <div style={{ textAlign: "center", flex: 1 }}>
    <div style={{ fontSize: 24 }}>📅</div>
    <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
      오늘 날짜
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
      {new Date().toISOString().slice(0, 10).replace(/-/g, ".")}
    </div>
  </div>

  <div
    style={{
      width: 1,
      height: 70,
      background: "#eee",
    }}
  />

  <div style={{ textAlign: "center", flex: 1 }}>
    <div style={{ fontSize: 24 }}>📄</div>
    <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
      전체 구매
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
      {rows.length}건
    </div>
  </div>

  <div
    style={{
      width: 1,
      height: 70,
      background: "#eee",
    }}
  />

  <div style={{ textAlign: "center", flex: 1 }}>
    <div style={{ fontSize: 24 }}>📝</div>
    <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
      {rows.filter((row) => !row.writeDate).length}건
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
     {rows.filter((row) => !row.writeDate).length}건
    </div>
  </div>
</div>
</div>   
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PurchasePage() {
  const router = useRouter();

 const today = new Date().toISOString().split("T")[0];

 const paymentMethods = [
    "신한",
  "카카오",
  "김토끼",
  "하나",
  "우리",
  "롯데",
  "삼성",
  "현금",
];
const [form, setForm] = useState({
  date: today,
  manager: "",
  bangje: "",
  item: "",
  price: "",
  method: "",
});

const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = () => {
    const saved = localStorage.getItem("sukys-data");
    const list = saved ? JSON.parse(saved) : [];

 list.push({
  ...form,
  payback: "FALSE",
  repay: "FALSE",
  reviewPaid: "FALSE",
  cardRepay: "FALSE",
});
   localStorage.setItem("sukys-data", JSON.stringify(list));

alert("저장 완료");

setForm({
  date: today,
  manager: "",
  bangje: "",
  item: "",
  price: "",
  method: "",
});
  };


 return (
  <main
    style={{
      padding: 30,
      paddingTop: 60,
      fontFamily: "sans-serif",
    }}
  >

  <div

  style={{
  width: 520,          // maxWidth 말고 width 사용
  margin: "0 auto 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}}
>
  <h1
    style={{
      margin: 0,
      color: "#ff6fb5",
      fontSize: 34,
      fontWeight: 800,
    }}
  >
    🌸 구매등록
  </h1>

  <div
    style={{
      display: "flex",
gap: 8,

    }}
  >
    <button
      onClick={() => router.push("/")}
      style={{
        background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
        color: "#fff",
        border: "none",
        borderRadius: 18,
        padding: "10px 18px",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(255,120,180,.3)",
      }}
    >
      홈
    </button>

    <button
      onClick={() => router.push("/purchase-list")}
      style={{
        background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
        color: "#fff",
        border: "none",
        borderRadius: 18,
        padding: "10px 18px",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(255,120,180,.3)",
      }}
    >
      구매내역
    </button>

    <button
      onClick={() => router.push("/ocr")}
      style={{
        background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
        color: "#fff",
        border: "none",
        borderRadius: 18,
        padding: "10px 18px",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(255,120,180,.3)",
      }}
    >
      OCR등록
    </button>
  </div>
</div>

{/* 입력 */}
<div
  style={{
    display: "grid",
    gap: 10,
    maxWidth: 620,
    width: "100%",
    margin: "0 auto",
  }}
>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>날짜</label>

  <input
    type="date"
    name="date"
    value={form.date}
    onChange={onChange}
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 18,
      border: "1px solid #ffb6d9",
     fontSize: 20,
fontWeight: 700,
    }}
  />
</div>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>
    담당자</label>

  <input
    name="manager"
    value={form.manager}
    onChange={onChange}
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 18,
      border: "1px solid #ffb6d9",
      fontSize: 20,
fontWeight: 700,
    }}
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>방제</label>

  <input
    name="bangje"
    value={form.bangje}
    onChange={onChange}
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 18,
      border: "1px solid #ffb6d9",
      fontSize: 20,
fontWeight: 700,
    }}
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>물품</label>

  <input
    name="item"
    value={form.item}
    onChange={onChange}
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 18,
      border: "1px solid #ffb6d9",
      fontSize: 20,
fontWeight: 700,
    }}
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>가격</label>

  <input
    name="price"
    value={form.price}
    onChange={onChange}
    style={{
      flex: 1,
      padding: "14px 16px",
      borderRadius: 18,
      border: "1px solid #ffb6d9",
      fontSize: 20,
fontWeight: 700,
    }}
  />
</div>

<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <label
  style={{
    width: 85,
    fontWeight: 700,
    fontSize: 20,
    color: "#333",
  }}
>결제방법</label>

  <select
  name="method"
  value={form.method}
  onChange={onChange}
  style={{
    flex: 1,
    padding: "14px 16px",
    borderRadius: 18,
    border: "1px solid #ffb6d9",
    fontSize: 20,
fontWeight: 700,
  }}
>
  <option value="">선택</option>

  {paymentMethods.map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ))}
</select>
</div>
        
        
      </div>

      <div
  style={{
    maxWidth: 620,
    margin: "30px auto 0",
  }}
>
  <button
    onClick={save}
    style={{
      width: "100%",
      padding: "18px",
      background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
      color: "#fff",
      border: "none",
      borderRadius: 14,
      fontSize: 18,
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 6px 15px rgba(255,120,180,.3)",
    }}
  >
    저장하기
  </button>
</div>

    </main>
  );
}
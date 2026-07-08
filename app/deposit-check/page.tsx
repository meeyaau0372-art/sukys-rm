"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type Row = {
  date: string;
  manager: string;
  item: string;
  bangje: string;
  price: string;
  payback: string;
  method: string;
  repay: string;
   reviewPaid: string;
  writeDate: string;
  reviewFee: string;
};
export default function DepositCheck() {
  const router = useRouter();
const [amount, setAmount] = useState("");
const [candidates, setCandidates] = useState<Row[]>([]);
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [productChecked, setProductChecked] = useState(false);
const [reviewChecked, setReviewChecked] = useState(false);
const [reviewAmount, setReviewAmount] = useState("");
const [isSilbae, setIsSilbae] = useState(false);
const findCandidates = () => {
  const saved = localStorage.getItem("sukys-data");

  if (!saved) {
    setCandidates([]);
    return;
  }

 
  const list: Row[] = JSON.parse(saved);

list.forEach((r) => {
  if (!r.reviewPaid) {
    r.reviewPaid = r.reviewFee ? "TRUE" : "FALSE";
  }
});

localStorage.setItem("sukys-data", JSON.stringify(list));

const keyword = amount.trim().toLowerCase();

  const inputAmount = Number(amount.replace(/,/g, ""));

  const isNumber = amount.trim() !== "" && !isNaN(inputAmount);

  let result: Row[] = [];
if (true) {
  result = list.filter((r) => {
   if (r.payback === "TRUE" && r.reviewPaid === "TRUE") return false;

    if (isNumber) {
      const price = Number(String(r.price).replace(/,/g, ""));

      return (
  price >= inputAmount - 5000 &&
  price <= inputAmount
);
    }

    return (
      r.manager.toLowerCase().includes(keyword) ||
      r.item.toLowerCase().includes(keyword) ||
      r.bangje.toLowerCase().includes(keyword)
    );
  });

 if (isNumber) {
  result.sort((a, b) => {
    const diffA = Math.abs(
      inputAmount - Number(String(a.price).replace(/,/g, ""))
    );

    const diffB = Math.abs(
      inputAmount - Number(String(b.price).replace(/,/g, ""))
    );

    return diffA - diffB;
  });
}
}
  
   

  setCandidates(result);
};
  return (
   
  <div
    style={{
      fontFamily: "sans-serif",
      height: "100vh",
      background: "#fff8fc",
    }}
  >
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
      }}
    >
      {/* 상단 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: "800",
            color: "#ff5fa2",
          }}
        >
          🌸 입금확인
        </h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push("/")}
            style={navBtn}
          >
            🏠 홈
          </button>

          <button
            onClick={() => router.push("/purchase")}
            style={navBtn}
          >
            📦 구매등록
          </button>

          <button
            onClick={() => router.push("/purchase-list")}
            style={navBtn}
          >
            📋 구매내역
          </button>
          <button style={navBtn} onClick={() => router.push("/card-repay")}>
  💰 카드상환
</button>
        </div>
      </div>

   

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  }}
>
  <input
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    onKeyDown={(e) => {
  if (e.key === "Enter") {
    findCandidates();
  }
}}
   placeholder="금액 / 담당자 / 품명 / 방제"
    style={{
      width: 180,
      padding: "10px 12px",
      fontSize: 15,
      borderRadius: 10,
      border: "1px solid #ccc",
    }}
  />

  <button
    onClick={findCandidates}
    style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      border: "none",
      background: "#ff82c3",
      color: "#fff",
      cursor: "pointer",
      fontSize: 16,
    }}
  >
    🔍
  </button>

  <div
  style={{
    display: "flex",
    gap: 8,
    marginLeft: 20,
  }}
>
 <h3
  style={{
    margin: "0 0 15px 0",
    color: "#ff5fa2",
  }}
>
  입금내역 매칭
</h3>
</div>
</div>



    <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  }}
>
  <thead>
    <tr>
      <th style={thStyle}>선택</th>
      <th style={thStyle}>구매일</th>
      <th style={thStyle}>담당자</th>
      <th style={thStyle}>품명</th>
      <th style={thStyle}>방제</th>
      <th style={thStyle}>물품금액</th>
<th style={thStyle}>리뷰비</th>

      <th style={thStyle}>차이</th>
    </tr>
  </thead>

<tbody>
  {candidates.length === 0 ? (
    <tr>
      <td
       colSpan={8}
        style={{
          textAlign: "center",
          padding: 40,
          border: "1px solid #ddd",
          color: "#999",
        }}
      >
        후보가 없습니다.
      </td>
    </tr>
  ) : (
    candidates.map((r, index) => (
      <tr
  key={index}
  onClick={() => setSelectedIndex(index)}
  style={{
    cursor: "pointer",
    background:
      selectedIndex === index ? "#fff7cc" : "#fff",
  }}
>
        <td
          style={{
            border: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <input
  type="radio"
  checked={selectedIndex === index}
  onChange={() => setSelectedIndex(index)}
/>
        </td>

        <td style={tdStyle}>{r.date}</td>
        <td style={tdStyle}>{r.manager}</td>
        <td style={tdStyle}>{r.item}</td>
        <td style={tdStyle}>{r.bangje}</td>

    <td
  style={{
    ...tdRight,
    background: r.payback === "TRUE" ? "#fff7b2" : "#fff",
  }}
>
  {r.price}
</td>

<td
  style={{
    ...tdRight,
    background: r.reviewPaid === "TRUE" ? "#fff7b2" : "#fff",
  }}
>
  {r.reviewFee || "-"}
</td>

<td style={tdRight}>
  {(
    Number(String(r.price).replace(/,/g, "")) -
    Number(amount.replace(/,/g, ""))
  ).toLocaleString()}
</td>    
      </tr>
    ))
  )}
</tbody>
</table>

{selectedIndex !== null && (
  <div
    style={{
      marginTop: 20,
      padding: 20,
      border: "2px solid #ffb6d9",
      borderRadius: 12,
      background: "#fff7fb",
    }}
  >
    <h3 style={{ marginTop: 0 }}>입금 처리</h3>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 25,
    marginBottom: 15,
  }}
>
<label
  style={{
    display: "block",
    marginBottom: 10,
    fontSize: 16,
  }}
>
  <input
  type="checkbox"
  checked={productChecked}
  onChange={(e) => setProductChecked(e.target.checked)}
/>
  {" "}물품비 ({candidates[selectedIndex].price}원)
</label>

<label
  style={{
    display: "block",
    marginBottom: 15,
    fontSize: 16,
  }}
>
  <input
  type="checkbox"
  checked={reviewChecked}
  onChange={(e) => {
    setReviewChecked(e.target.checked);

    if (e.target.checked) {
      setReviewAmount("1000");
    } else {
      setReviewAmount("");
    }
  }}
/>

  {" "}리뷰비

  <input
    type="number"
    value={reviewAmount}
    disabled={!reviewChecked}
    step={500}
    onChange={(e) => setReviewAmount(e.target.value)}
    placeholder="금액"
    style={{
      width: 90,
      marginLeft: 10,
      marginRight: 5,
      padding: "4px 6px",
    }}
  />

  원
 <button
  type="button"
 onClick={() => {
  if (isSilbae) {
    setIsSilbae(false);
  } else {
    setIsSilbae(true);
    setReviewChecked(true);
    setReviewAmount("");
  }
}}
  style={{
  marginLeft: 8,
  padding: "3px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: isSilbae ? "#ff82c3" : "#f5f5f5",
  color: isSilbae ? "#fff" : "#333",
  cursor: "pointer",
  fontWeight: "bold",
}}
>
  실배
</button> 
</label>
</div>
<hr />

<div
  style={{
    marginTop: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5fa2",
  }}
>
  선택합계 : {
    (
      (productChecked
        ? Number(String(candidates[selectedIndex].price).replace(/,/g, ""))
        : 0)
      +
      (reviewChecked
        ? Number(reviewAmount || 0)
        : 0)
    ).toLocaleString()
  }원
</div>

  </div>
)}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  }}
>
  <button
    onClick={() => {
      if (selectedIndex === null) {
        alert("후보를 선택하세요.");
        return;
      }

      const saved = localStorage.getItem("sukys-data");
if (!saved) return;

const list: Row[] = JSON.parse(saved);

const target = candidates[selectedIndex];

const idx = list.findIndex(
  (r) =>
    r.date === target.date &&
    r.manager === target.manager &&
    r.item === target.item &&
    r.bangje === target.bangje
);

if (idx === -1) return;

if (productChecked) {
  list[idx].payback = "TRUE";
}

if (reviewChecked) {
  list[idx].reviewPaid = "TRUE";
  list[idx].reviewFee = isSilbae
    ? "실배"
    : (reviewAmount || "1000");
}

localStorage.setItem("sukys-data", JSON.stringify(list));

alert("입금처리 완료");
setProductChecked(false);
setReviewChecked(false);
setReviewAmount("");
setIsSilbae(false);
setSelectedIndex(null);
setAmount("");
findCandidates();
    }}
    style={{
      padding: "10px 26px",
      border: "none",
      borderRadius: 10,
      background: "#ff82c3",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    입금처리
  </button>
</div>
    </div>
     </div>
  );
}

const navBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 12,
  background: "linear-gradient(135deg,#ffb6d9,#ff8fbc)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};
const thStyle = {
  background: "#ff82c3",
  color: "#fff",
  border: "1px solid #ddd",
  padding: "12px 8px",
  textAlign: "center" as const,
};
const tdStyle = {
  border: "1px solid #ddd",
  textAlign: "center" as const,
  padding: "10px",
};

const tdRight = {
  border: "1px solid #ddd",
  textAlign: "right" as const,
  padding: "10px",
};
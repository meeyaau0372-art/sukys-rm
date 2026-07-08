"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OcrPage() {
  const router = useRouter();

 const today = new Date().toISOString().split("T")[0];
const [ocrStatus, setOcrStatus] = useState("사진을 선택하면 분석이 시작됩니다.");
const [ocrProgress, setOcrProgress] = useState(0);
const [ocrTotal, setOcrTotal] = useState(0);
const [ocrDone, setOcrDone] = useState(0);
const [ocrResults, setOcrResults] = useState<any[]>([]);
const updateOcrResult = (
  index: number,
  field: string,
  value: string
) => {
  setOcrResults((prev: any[]) =>
    prev.map((row: any, i: number) =>
      i === index
        ? {
            ...row,
            [field]: value,
          }
        : row
    )
  );
};

const registerOcr = () => {
  const saved = localStorage.getItem("sukys-data");
  const list = saved ? JSON.parse(saved) : [];

  ocrResults.forEach((row: any) => {
    list.push({
      date: String(row.date).replace(/-/g, "/"),
      manager: "",
      bangje: "",
      item: row.item,
      price: Number(String(row.price).replace(/,/g, "")),
      method: row.card,
      paid: "FALSE",
      repay: "FALSE",
    });
  });

  localStorage.setItem("sukys-data", JSON.stringify(list));

  alert(`${ocrResults.length}건이 등록되었습니다.`);

  setOcrResults([]);

  router.push("/purchase-list");
};

  return (
  <main
    style={{
      padding: 30,
      paddingTop: 60,
      fontFamily: "sans-serif",
    }}
  >

      {/* 네비게이션 */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginBottom: 35,
    marginTop: 10,
  }}
>
  <button
  onClick={() => {
   
    window.location.href = "/";
  }}
  style={{
      background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
      color: "#fff",
      border: "none",
      borderRadius: 18,
      padding: "12px 24px",
      fontSize: 18,
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(255,120,180,.3)",
    }}
  >
    🏠 홈
  </button>

  <button
    onClick={() => router.push("/purchase-list")}
    style={{
      background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
      color: "#fff",
      border: "none",
      borderRadius: 18,
      padding: "12px 24px",
      fontSize: 18,
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(255,120,180,.3)",
    }}
  >
    🛍 구매리스트
  </button>
    <button
  onClick={() => router.push("/purchase")}
  style={{
    background: "linear-gradient(90deg,#ffb6d9,#ff82c3)",
    color: "#fff",
    border: "none",
    borderRadius: 18,
    padding: "12px 24px",
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(255,120,180,.3)",
  }}
>
  📝 구매등록
</button>
</div>

      <h1
  style={{
    textAlign: "center",
    marginBottom: 20,
  }}
>
  📝 OCR등록
</h1>
{/* 🤖 OCR 자동등록 */}
<div
  style={{
    maxWidth: 450,
    margin: "0 auto 30px",
    border: "2px solid #ffd2e7",
    borderRadius: 18,
    padding: 20,
    background: "#fff8fc",
  }}
>
  <h3 style={{ margin: 0, color: "#ff5fa2" }}>
    🤖 OCR 자동등록
  </h3>

  <p
    style={{
      fontSize: 14,
      color: "#777",
      marginTop: 8,
      marginBottom: 20,
      lineHeight: 1.5,
    }}
  >
    영수증 사진을 선택하면
    <br />
    구매내역을 자동으로 등록합니다.
    <br />
    (최대 20장)
  </p>

  <label
    htmlFor="photo"
    style={{
      display: "block",
      border: "2px dashed #ffb6d9",
      borderRadius: 15,
      padding: "30px 20px",
      textAlign: "center",
      cursor: "pointer",
      color: "#ff5fa2",
      fontWeight: "bold",
      background: "#fff",
    }}
  >
    📷 영수증 선택
    <br />
    <span
      style={{
        fontSize: 13,
        color: "#999",
      }}
    >
      여기를 눌러 최대 20장을 선택하세요.
    </span>
    </label>
  <input
  id="photo"
  type="file"
  accept="image/*"
  multiple
  style={{ display: "none" }}
  onChange={(e) => {
    const files = e.target.files;

    if (!files) return;

    if (files.length > 20) {
      alert("최대 20장까지 선택 가능합니다.");
      return;
    }

    setOcrTotal(files.length);
    setOcrDone(0);
    setOcrProgress(0);
    setOcrStatus(`0 / ${files.length} 분석중...`);

    let count = 0;

    const timer = setInterval(() => {
      count++;

      setOcrDone(count);
      setOcrProgress((count / files.length) * 100);
      setOcrStatus(`${count} / ${files.length} 분석중...`);

      if (count >= files.length) {
        clearInterval(timer);

        setOcrProgress(100);
        setOcrStatus(`✅ OCR 분석 완료 (${files.length}건 등록되었습니다.)`);

        const results = Array.from(files).map(() => ({
          date: today,
          item: "",
          price: "",
          card: "",
          status: "⏳",
        }));

        setOcrResults(results);
      }
    }, 500);
  }}
/>

<div
  style={{
    marginTop: 20,
    padding: 15,
    background: "#fff",
    border: "1px solid #ffd2e7",
    borderRadius: 12,
  }}
>
  <div
    style={{
      fontWeight: "bold",
      color: "#ff5fa2",
      marginBottom: 10,
    }}
  >
    📊 OCR 진행상황
  </div>

  <div
    style={{
      height: 10,
      background: "#ffe5f1",
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
    }}
  >
    <div
      style={{
        width: `${ocrProgress}%`,
        height: "100%",
        background: "#ff82c3",
        transition: "width 0.3s",
      }}
    />
  </div>

  <div
    style={{
      fontSize: 14,
      color: "#666",
    }}
  >
    {ocrStatus}
  </div>
</div>
</div>

{ocrResults.length > 0 && (
  <div
    style={{
      maxWidth: 450,
      margin: "20px auto",
      background: "#fff",
      border: "1px solid #ffd2e7",
      borderRadius: 12,
      padding: 15,
    }}
  >
    <h3 style={{ color: "#ff5fa2", marginBottom: 15 }}>
      📋 OCR 결과
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 14,
      }}
    >
      <thead>
        <tr style={{ background: "#fff3f8" }}>
          <th style={{ padding: 8 }}>상태</th>
          <th style={{ padding: 8 }}>날짜</th>
          <th style={{ padding: 8 }}>품명</th>
          <th style={{ padding: 8 }}>금액</th>
          <th style={{ padding: 8 }}>카드사</th>
          <th style={{ padding: 8 }}>삭제</th>
        </tr>
      </thead>

      <tbody>
        {ocrResults.map((row, idx) => (
          <tr key={idx}>
            <td style={{ padding: 8, textAlign: "center" }}>{row.status}</td>

            <td style={{ padding: 8 }}>{row.date}</td>

            <td style={{ padding: 8 }}>
              <input
                value={row.item}
                onChange={(e) =>
                  updateOcrResult(idx, "item", e.target.value)
                }
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 14,
                }}
              />
            </td>

            <td style={{ padding: 8 }}>
              <input
                value={row.price}
                onChange={(e) =>
                  updateOcrResult(idx, "price", e.target.value)
                }
                style={{
                  width: "100%",
                  textAlign: "right",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 14,
                }}
              />
            </td>

            <td style={{ padding: 8 }}>
              <input
                value={row.card}
                onChange={(e) =>
                  updateOcrResult(idx, "card", e.target.value)
                }
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 14,
                }}
              />
            </td>

            <td style={{ padding: 8 }}>
              <button
                onClick={() => {
                  const list = [...ocrResults];
                  list.splice(idx, 1);
                  setOcrResults(list);
                }}
                style={{
                  background: "#ff5fa2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{ocrResults.length > 0 && (
  <div
    style={{
      maxWidth: 450,
      margin: "15px auto 30px",
    }}
  >
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: "#fff8fc",
        border: "1px solid #ffd2e7",
        fontWeight: "bold",
        color: "#ff5fa2",
        lineHeight: 1.8,
        marginBottom: 15,
      }}
    >
      <div>총 건수 : {ocrResults.length}건</div>

      <div>
        총 금액 :{" "}
        {ocrResults
          .reduce(
            (sum, row) =>
              sum +
              Number(String(row.price).replace(/,/g, "")),
            0
          )
          .toLocaleString()}
        원
      </div>
    </div>

    <button
      onClick={registerOcr}
      style={{
        width: "100%",
        padding: "15px",
        background: "linear-gradient(90deg,#ff6fa8,#ff4f95)",
        color: "#fff",
        border: "none",
        borderRadius: 14,
        fontSize: 18,
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 6px 15px rgba(255,120,180,.3)",
      }}
    >
      📥 OCR 전체 등록
    </button>
  </div>
)}
</main>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Bar } from "react-chartjs-2";
import { MdRefresh, MdSend } from "react-icons/md"; // ✨ MdSend 추가됨
import { RiRobot2Fill } from "react-icons/ri";
import { IoAlertCircle } from "react-icons/io5";

/* ---------------- Chart.js ---------------- */
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

/* ---------------- Global & Dark Theme ---------------- */
const GlobalStyles = createGlobalStyle`
  :root{
    --primary-400: #3B82F6; /* 다크테마에 어울리는 밝은 블루 */
    --secondary-900: #1E293B;
  }
  *, *::before, *::after { box-sizing: border-box; }
  * { scrollbar-width: thin; }
  *::-webkit-scrollbar{ height: 10px; width: 10px; }
  *::-webkit-scrollbar-thumb{ background: #475569; border-radius: 8px; }
  body { background-color: #0A0F1F; margin: 0; } /* ✨ 배경 완전 어둡게 */
  canvas { max-width: 100%; height: auto !important; z-index:10; } 
`;

/* ---------------- Tokens (다크테마 전용) ---------------- */
const color = {
  bg: "#0A0F1F",             // 전체 배경 (다크 네이비/블랙)
  card: "#111827",           // 카드 배경
  cardBorder: "#1F2937",     // 카드 테두리
  text: "#F9FAFB",           // 메인 텍스트 (완전 밝게)
  subText: "#9CA3AF",        // 서브 텍스트
  grid: "rgba(255,255,255,0.08)", // 차트 그리드 라인
  bubbleUser: "#3B82F6",     // 유저 채팅창 (블루)
  bubbleBot: "#1F2937",      // 봇 채팅창 (다크 그레이)
  inputBorder: "#374151",
  inputBg: "#1F2937",
};

// ✨ 차트 컬러 팔레트 (형광/네온 톤으로 가시성 극대화)
const chartColors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

/* ---------------- Page ---------------- */
export default function InsightPage() {
  // 차트 옵션들 (텍스트 아주 크게, 다크테마 대비 조정)
  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%", // 두께감 있게 조정
      layout: { padding: { top: 0, bottom: 0 } },
      plugins: {
        legend: {
          display: true, position: "right" as const, align: 'center',
          labels: { usePointStyle: true, pointStyle: "circle", color: color.text, font: { size: 22, weight: 'bold' }, padding: 24, boxWidth: 20, boxHeight: 20 },
        },
        legendGap: { gap: 30 },
        datalabels: {
          color: "#FFFFFF", textStrokeColor: "#000000", textStrokeWidth: 3, font: { weight: 900, size: 26 }, // ✨ 데이터 라벨 아주 크게
          padding: 18, offset: 10, anchor: "center", align: "center",
          formatter: (value: number, ctx: any) => {
            const arr: number[] = ctx.chart.data.datasets[0].data;
            const sum = arr.reduce((a: number, b: number) => a + b, 0);
            return sum > 0 ? `${Math.round((value * 100) / sum)}%` : "0%";
          },
        },
        tooltip: { backgroundColor: "#1F2937", titleFont: { size: 20 }, bodyFont: { size: 20 }, titleColor: "#fff", bodyColor: "#fff", padding: 16, cornerRadius: 8 },
      },
    }), []
  );

  const legendGapPlugin = {
    id: "legendGap",
    beforeInit(chart: any, _args: any, opts: { gap?: number } = {}) {
      const fit = chart.legend && chart.legend.fit;
      if (!fit) return;
      chart.legend.fit = function () {
        fit.bind(chart.legend)();
        this.height += opts.gap ?? 20; 
      };
    },
  };
  ChartJS.register(legendGapPlugin);

  // ✨ Line 옵션을 Bar 옵션으로 변경 (이미지 느낌)
  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, position: "top" as const, align: "end",
          labels: { usePointStyle: true, pointStyle: "circle", color: color.text, font: { size: 20, weight: 'bold' }, padding: 16, boxWidth: 20, boxHeight: 20 },
        },
        datalabels: { display: false },
        tooltip: { backgroundColor: "#1F2937", titleFont: { size: 20 }, bodyFont: { size: 20 }, titleColor: "#fff", bodyColor: "#fff", padding: 16, cornerRadius: 8 },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: color.grid }, ticks: { color: color.subText, font: { size: 20, weight: 'bold' }, padding: 10 } },
        x: { grid: { display: false }, ticks: { color: color.subText, font: { size: 20, weight: 'bold' }, padding: 10 } },
      },
    }), []
  );

  /* ------- Chat ------- */
  type Msg = { role: "user" | "bot"; lines: string[] };
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "user", lines: ["오늘 점검 횟수를 알려줘"] },
    { role: "bot", lines: ["안녕하세요! 오늘 점검 횟수를 알려드릴게요.", "점검 횟수: 3회", "배출구 별 횟수", "1번 배출구 : 1회\n2번 배출구 : 2회"] },
  ]);
  const [input, setInput] = useState("");
  const [processes, setProcesses] = useState<any>(null);
  const [facilities, setFacilities] = useState<any>(null);
  const [processesTrend, setProcessesTrend] = useState<any>(null);
  const [facilitiesTrend, setFacilitiesTrend] = useState<any>(null);
  
  // 데이터 불러오기
  const fetchAll = async () => {
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch("http://192.168.10.174:5654/db/tql/get_alarm_count_equip.tql?from=2025-10-27T00:00:00&to=2025-11-24T23:59:59&limit=5"),
        fetch("http://192.168.10.174:5654/db/tql/get_alarm_count.tql?from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&limit=5"),
        fetch("http://192.168.10.174:5654/db/tql/get_alarm_trend_equip.tql?eqpid=EQS1A0016&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60"),
        fetch("http://192.168.10.174:5654/db/tql/get_alarm_trend.tql?eqpid=EQS1A0016&tagname=M606&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60"),
      ]);
      const [j1, j2, j3, j4] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()]);
      setProcesses(j1);
      setFacilities(j2);
      setProcessesTrend(j3);
      setFacilitiesTrend(j4);
    } catch (err) { console.error("데이터 실패:", err); }
  };
  useEffect(()=> { fetchAll(); },[]);

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => { const el = taRef.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }, [input]);
  const send = () => { if (!input.trim()) return; setMsgs(m => [...m, { role: "user", lines: [input.trim()] }]); setInput(""); setTimeout(() => setMsgs(m => [...m, { role: "bot", lines: ["확인했습니다."] }]), 200); };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  /* ------- Charts Data Logic ------- */
  
  const doughnutDataProcess = useMemo(() => {
    if (processes?.success === true && processes.data.rows?.length > 0) {
      const labels = processes.data.rows.map((r: any) => r[0]); 
      const values = processes.data.rows.map((r: any) => r[r.length - 1]);
      return { labels, datasets: [{ data: values, backgroundColor: chartColors, borderWidth: 0 }] };
    }
    return { labels: ["A 설비", "B 설비", "C 설비", "D 설비", "E 설비"], datasets: [{ data: [23, 29, 12, 21, 15], backgroundColor: chartColors, borderWidth: 0 }] };
  }, [processes]);

  const doughnutDataAlarm = useMemo(() => {
    if (facilities?.success === true && facilities.data.rows?.length > 0) {
      const labels = facilities.data.rows.map((r: any) => r[0]);
      const values = facilities.data.rows.map((r: any) => r[r.length - 1]);
      return { labels, datasets: [{ data: values, backgroundColor: chartColors, borderWidth: 0 }] };
    }
    return { labels: ["로터볼트", "스테이터볼트", "사이드볼트", "기타", "알 수 없음"], datasets: [{ data: [40, 30, 20, 5, 5], backgroundColor: chartColors, borderWidth: 0 }] };
  }, [facilities]);

  const barDataProcess = useMemo(() => {
    if (processesTrend?.success === true && processesTrend.data.rows?.length > 0) {
      const labels = processesTrend.data.rows.map(([datetime]: any) => datetime.split(' ')[1].slice(0, 5));
      const values = processesTrend.data.rows.map(([_, val]: any) => val);
      return { labels, datasets: [{ label: "SideBolt 체결 누락", data: values, backgroundColor: "#3B82F6", borderRadius: 8 }] };
    }
    return { labels: ["월", "화", "수", "목", "금", "토", "일"], datasets: [{ label: "공정불량 발생 건수", data: [15, 22, 13, 24, 35, 18, 12], backgroundColor: "#3B82F6", borderRadius: 8, barThickness: 30 }] };
  }, [processesTrend]);

  const barDataAlarmTrend = useMemo(() => {
    if (facilitiesTrend?.success === true && facilitiesTrend.data.rows?.length > 0) {
      const rows = facilitiesTrend.data.rows;
      const labels = rows.map((r: any) => r[0].split(' ')[1].slice(0, 5));
      const values = rows.map((r: any) => r[1]);
      return { labels, datasets: [{ label: "설비알람 발생 건수", data: values, backgroundColor: "#10B981", borderRadius: 8 }] };
    }
    return { labels: ["09:00", "11:00", "13:00", "15:00", "17:00"], datasets: [{ label: "설비알람 Trend", data: [5, 12, 8, 14, 9], backgroundColor: "#10B981", borderRadius: 8, barThickness: 40 }] };
  }, [facilitiesTrend]);

  return (
    <>
      <GlobalStyles />
      <Page>
        <Main>
          <LeftCol>
            <Grid2x2>
              <Panel>
                <PanelTitle>공정불량 TOP 5</PanelTitle>
                <ChartBox><Doughnut data={doughnutDataProcess} options={doughnutOptions as any} /></ChartBox>
              </Panel>
              <Panel>
                <PanelTitle>공정불량 Trend</PanelTitle>
                {/* ✨ Line 컴포넌트 대신 Bar 컴포넌트 사용 */}
                <ChartBox><Bar data={barDataProcess} options={barOptions as any} /></ChartBox>
              </Panel>
              <Panel>
                <PanelTitle>설비알람 TOP 5</PanelTitle>
                <ChartBox><Doughnut data={doughnutDataAlarm} options={doughnutOptions as any} /></ChartBox>
              </Panel>
              <Panel>
                <PanelTitle>설비알람 Trend</PanelTitle>
                {/* ✨ Line 컴포넌트 대신 Bar 컴포넌트 사용 */}
                <ChartBox><Bar data={barDataAlarmTrend} options={barOptions as any} /></ChartBox>
              </Panel>
            </Grid2x2>
          </LeftCol>

          <RightCol>
            <ChatCard>
              <ChatHeader>
                <span className="title"><RiRobot2Fill /> AI 챗봇 어시스턴트</span>
                <button className="collapse" aria-label="refresh"><MdRefresh /></button>
              </ChatHeader>
              <ChatBody>
                {msgs.map((m, i) => (
                  <MsgRow key={i} $role={m.role}>
                    {m.role === "bot" && <div className="bot"><div className="robotBox"><RiRobot2Fill /></div></div>}
                    <div className="bubble">{m.lines.map((l, j) => <span key={j} style={{ display: "block" }}>{l}</span>)}</div>
                  </MsgRow>
                ))}
              </ChatBody>
              <ChatInput>
                <textarea ref={taRef} rows={1} placeholder="메세지를 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} />
                {/* ✨ 로컬 SVG 대신 react-icons의 MdSend 사용 */}
                <button onClick={send} aria-label="send"><MdSend size={28} color="#ffffff" /></button>
              </ChatInput>
            </ChatCard>
          </RightCol>
        </Main>
        
        {/* 에러/로딩 상태 알림 */}
        <div className="info-box">
          {(!processes?.success) && <AlertBox msg="공정불량 TOP5" />}
          {(!facilities?.success) && <AlertBox msg="설비알람 TOP5" />}
          {(!processesTrend?.success) && <AlertBox msg="공정불량 Trend" />}
          {(!facilitiesTrend?.success) && <AlertBox msg="설비알람 Trend" />}
        </div>
      </Page>
    </>
  );
}

function AlertBox({ msg }: { msg: string }) {
  return (
    <div className="alert" role="alert">
      <div>
        <p><IoAlertCircle /> 현재 <b>{msg}</b> 데이터가 유효하지 않습니다.</p>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */
const Page = styled.div`
  width: 100%; min-height: 100vh; background: ${color.bg}; color: ${color.text};
  .info-box { position: fixed; bottom: 30px; left: 30px; z-index: 9999; display: flex; flex-direction: column; gap: 12px; }
  .alert { width: auto; padding: 16px 32px; border-radius: 12px; display: flex; align-items: center; background-color: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; font-size: 20px; font-weight: 600; svg { width: 28px; height: 28px; margin-right: 12px; vertical-align: middle; } }
`;

const Main = styled.main`
  display: grid; grid-template-columns: 1fr 540px; /* ✨ 우측 챗봇 영역 넓게 */
  gap: 24px; padding: 40px; height: 100vh; box-sizing: border-box; overflow: hidden; align-items: stretch;
  @media (max-width: 1400px) { grid-template-columns: 1fr 450px; }
  @media (max-width: 1100px) { grid-template-columns: 1fr; height: auto; overflow: auto; }
`;

const LeftCol = styled.div` height: 100%; min-height: 0; display: grid; grid-template-rows: 1fr; overflow: hidden; `;
const Grid2x2 = styled.div`
  display: grid; height: 100%; grid-template-columns: 1fr 1fr; /* ✨ 차트 균일하게 배치 */
  grid-template-rows: repeat(2, 1fr); gap: 24px; align-items: stretch; min-height: 0;
  @media (max-width: 900px) { grid-template-columns: 1fr; grid-template-rows: auto; height: auto; }
`;

const RightCol = styled.aside` height: 100%; min-height: 0; position: sticky; top: 40px; align-self: start; @media (max-width: 1100px) { position: static; height: 800px; } `;
const Panel = styled.section` 
  background: ${color.card}; 
  border: 1px solid ${color.cardBorder}; 
  border-radius: 20px; /* ✨ 더 둥글게 */
  padding: 32px; /* ✨ 패딩 크게 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* ✨ 묵직한 그림자 */
  height: 100%; min-height: 0; display: flex; flex-direction: column; 
`;
const PanelTitle = styled.h3` 
  color: ${color.text}; 
  font-size: 30px; /* ✨ 타이틀 아주 크게 */
  font-weight: 900; 
  margin: 0 0 30px 0; 
  display: flex; justify-content: space-between; align-items: center; 
  letter-spacing: -0.5px;
`;
const ChartBox = styled.div` width: 100%; flex: 1; min-height: 300px; position: relative; `;

const ChatCard = styled.section` 
  background: ${color.card}; 
  border: 1px solid ${color.cardBorder}; 
  border-radius: 20px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); 
  display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; 
`;
const ChatHeader = styled.div` 
  display: flex; justify-content: space-between; align-items: center; 
  padding: 24px 30px; border-bottom: 1px solid ${color.cardBorder}; 
  background-color: #1E293B; color: white; 
  .title { font-weight: 900; font-size: 26px; display: flex; align-items: center; gap: 12px; svg { width: 32px; height: 32px; color: var(--primary-400); } } 
  .collapse{ width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; background: rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s; &:hover{ background: rgba(255,255,255,0.2); } } 
  .collapse svg{ width: 28px; height: 28px; color: #F9FAFB; } 
`;
const ChatBody = styled.div` padding: 30px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; flex: 1; `;
const MsgRow = styled.div<{ $role: "user" | "bot" }>` 
  display: flex; gap: 12px; align-items: flex-start; justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")}; 
  .bot{ width: 44px; height: 44px; display: grid; place-items: center; } 
  .robotBox{ width: 44px; height: 44px; border-radius: 50%; display: flex; justify-content: center; align-items: center; background: #374151; color: #60A5FA; svg { width: 24px; height: 24px; } } 
  .bubble{ 
    max-width: 80%; padding: 18px 24px; border-radius: 20px; 
    border-top-left-radius: ${(p) => (p.$role === "bot" ? "4px" : "20px")};
    border-top-right-radius: ${(p) => (p.$role === "user" ? "4px" : "20px")};
    background: ${(p) => (p.$role === "user" ? color.bubbleUser : color.bubbleBot)}; 
    color: #FFFFFF;
    font-size: 22px; /* ✨ 채팅 글씨 아주 크게 */
    font-weight: 500;
    line-height: 1.6; white-space: pre-wrap; word-break: break-word; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  } 
`;
const ChatInput = styled.div` 
  padding: 20px; border-top: 1px solid ${color.cardBorder}; display: flex; gap: 16px; align-items: flex-end; 
  margin: 20px; border: 2px solid ${color.inputBorder}; border-radius: 16px; background: ${color.inputBg};
  transition: border-color .2s ease; 
  &:focus-within{ border-color: var(--primary-400); } 
  textarea{ 
    flex: 1; resize: none; background: transparent; color: #FFFFFF; border: none; 
    padding: 12px 16px; min-height: 56px; max-height: 160px; 
    font-size: 22px; /* ✨ 입력창 글씨 아주 크게 */
    font-weight: 500;
    outline: none; 
    &::placeholder { color: #6B7280; }
  } 
  button{ 
    width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; background: var(--primary-400); 
    display: grid; place-items: center; cursor: pointer; border: none; transition: 0.2s;
    &:hover { filter: brightness(1.2); transform: scale(1.05); }
  } 
`;
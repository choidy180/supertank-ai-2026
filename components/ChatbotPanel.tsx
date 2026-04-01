// components/ChatbotPanel.tsx
// ✅ 오른쪽 챗봇 영역만 분리한 재사용 컴포넌트
// - styled-components 사용 (스타일 유지)
// - 데이터 기반 답변 로직 추가

"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { RiRobot2Fill } from "react-icons/ri";
import { MdRefresh, MdSend } from "react-icons/md"; // ✨ MdSend 추가됨

export type ChatMsg = { role: "user" | "bot"; lines: string[] };

// 로그 데이터 타입 정의 (필요한 필드만)
export type LogData = {
  id: string;
  title: string;
  time: string;
  desc: string;
};

interface ChatbotPanelProps {
  /** 헤더 타이틀 (default: "chatbot") */
  title?: string;
  /** 최초 메시지 목록 */
  initialMessages?: ChatMsg[];
  /** 카드 높이 (CSS 값) (default: "calc(100dvh - 60px)") */
  height?: string;
  /** 전송 핸들러. (옵션) */
  onSend?: (text: string) => void | string | string[] | Promise<void | string | string[]>;
  /** 클래스명 전달용 */
  className?: string;
  /** 🧠 챗봇 지능을 위한 로그 데이터 (추가됨) */
  logs?: LogData[];
}

const DEFAULT_MSGS: ChatMsg[] = [
  { role: "user", lines: ["오늘 불량 현황 알려줘"] },
  {
    role: "bot",
    lines: [
      "안녕하세요! AI 조치 이력 챗봇입니다.",
      "궁금한 내용을 물어보세요.",
    ],
  },
];

export default function ChatbotPanel({
  title = "AI 챗봇 어시스턴트",
  initialMessages = DEFAULT_MSGS,
  height = "calc(100dvh - 80px)",
  onSend,
  className,
  logs = [], 
}: ChatbotPanelProps) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null); 

  // textarea auto-resize
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [input]);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [msgs]);

  // 🧠 내부 답변 로직 함수
  const generateAnswer = (question: string): string[] => {
    if (!logs || logs.length === 0) return ["현재 로드된 데이터가 없습니다."];

    const q = question.replace(/\s+/g, "").toLowerCase(); 
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const today = new Date(now.getTime() - offset).toISOString().slice(0, 10);

    // 1. 최근/마지막 불량 조회
    if (q.includes("최근") || q.includes("마지막") || (q.includes("제일") && q.includes("늦게"))) {
        const sorted = [...logs].sort((a, b) => b.time.localeCompare(a.time));
        const latest = sorted[0];
        if (!latest) return ["데이터가 없습니다."];
        
        const cleanTitle = latest.title.replace('QR 코드 인식됨: ', '').replace('Log_', '');
        return [
            `가장 최근 기록은 [${latest.time}] 입니다.`,
            `내용: ${cleanTitle}`
        ];
    }

    // 2. 오늘 발생 건수
    if (q.includes("오늘")) {
        const todayCount = logs.filter(l => l.time.startsWith(today)).length;
        return [`오늘(${today}) 발생한 기록은 총 ${todayCount}건 입니다.`];
    }

    // 3. 전체/총 개수
    if (q.includes("전체") || q.includes("총") || q.includes("몇개") || q.includes("몇건")) {
        return [`현재 시스템에 조회된 기록은 총 ${logs.length}건 입니다.`];
    }

    // 4. 특정 시간대 (예: 09시)
    if (q.includes("시")) {
      const match = q.match(/(\d{1,2})시/);
      if (match) {
        const hour = match[1].padStart(2, '0');
        const count = logs.filter(l => l.time.includes(` ${hour}:`)).length;
        return [`${hour}시대에 발생한 기록은 총 ${count}건 입니다.`];
      }
    }

    return [
        "죄송해요, 잘 이해하지 못했어요.", 
        "'최근', '오늘', '총 건수' 등의 키워드로 질문해 주세요."
    ];
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // 유저 메시지 추가
    setMsgs((m) => [...m, { role: "user", lines: [text] }]);
    setInput("");

    try {
      if (onSend) {
        const result = await onSend(text);
        if (result) {
            const lines = Array.isArray(result) ? result : [result];
            setMsgs((m) => [...m, { role: "bot", lines }]);
            return;
        }
      }

      setTimeout(() => {
        const answerLines = generateAnswer(text);
        setMsgs((m) => [...m, { role: "bot", lines: answerLines }]);
      }, 500);

    } catch {
      setMsgs((m) => [...m, { role: "bot", lines: ["에러가 발생했어요. 잠시 후 다시 시도해 주세요."] }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <RightCol className={className}>
      <ChatCard $height={height}>
        <ChatHeader>
          <span className="title">
            <RiRobot2Fill />
            {title}
          </span>
          <button 
            className="refresh" 
            aria-label="refresh"
            onClick={() => setMsgs(initialMessages)}
          >
            <MdRefresh size={28} color="#F9FAFB" />
          </button>
        </ChatHeader>

        <ChatBody ref={bodyRef}>
          {msgs.map((m, i) => (
            <MsgRow key={i} $role={m.role}>
              {m.role === "bot" && (
                <div className="bot">
                  <div className="robotBox">
                    <RiRobot2Fill size={24} />
                  </div>
                </div>
              )}
              <div className="bubble">
                {m.lines.map((l, j) => (
                  <span key={j}>{l}</span>
                ))}
              </div>
            </MsgRow>
          ))}
        </ChatBody>

        <ChatInput>
          <textarea
            ref={taRef}
            rows={1}
            placeholder="메세지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button onClick={handleSend} aria-label="send">
            {/* ✨ 로컬 SVG 대체 */}
            <MdSend size={28} color="#ffffff" /> 
          </button>
        </ChatInput>
      </ChatCard>
    </RightCol>
  );
}

/* =========================
  styled-components (Dark Theme + Indented)
========================= */

const RightCol = styled.aside`
  position: sticky;
  max-height: calc(100vh - 80px);
  top: 40px; 
  align-self: start;
  
  @media (max-width: 1100px) {
    position: static;
  }
`;

const ChatCard = styled.section<{ $height: string }>`
  background: #111827;
  border: 1px solid #1F2937;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: ${({ $height }) => $height};
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1100px) {
    height: 800px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #1F2937;
  background-color: #1E293B;
  color: white;

  .title {
    font-weight: 900;
    font-size: 26px;
    display: flex;
    gap: 12px;
    align-items: center;
    
    svg {
      width: 32px;
      height: 32px;
      color: #3B82F6;
    }
  }
  
  .refresh {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ChatBody = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
`;

const MsgRow = styled.div<{ $role: "user" | "bot" }>`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};

  .bot {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
  }
  
  .robotBox {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #374151;
    color: #60A5FA;
  }
  
  .bubble {
    max-width: 80%;
    padding: 18px 24px;
    border-radius: 20px;
    border-top-left-radius: ${(p) => (p.$role === "bot" ? "4px" : "20px")};
    border-top-right-radius: ${(p) => (p.$role === "user" ? "4px" : "20px")};
    background: ${(p) => (p.$role === "user" ? "#3B82F6" : "#1F2937")};
    color: #FFFFFF;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);

    span {
      display: block;
    }
  }
`;

const ChatInput = styled.div`
  padding: 20px;
  border-top: 1px solid #1F2937;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin: 20px;
  border: 2px solid #374151;
  border-radius: 16px;
  background: #1F2937;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #3B82F6;
  }

  textarea {
    flex: 1;
    resize: none;
    background: transparent;
    color: #FFFFFF;
    border: none;
    padding: 12px 16px;
    min-height: 56px;
    max-height: 160px;
    font-size: 22px;
    font-weight: 500;
    outline: none;
    
    &::placeholder {
      color: #6B7280;
    }
  }

  button {
    width: 56px; 
    height: 56px; 
    flex-shrink: 0;
    border-radius: 50%;
    background: #3B82F6; 
    display: grid; 
    place-items: center;
    cursor: pointer;
    border: none;
    transition: 0.2s;
    
    &:hover {
      filter: brightness(1.2);
      transform: scale(1.05);
    }
  }
`;
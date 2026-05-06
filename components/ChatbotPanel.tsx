'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { MdRefresh, MdSend } from 'react-icons/md';
import { RiRobot2Fill } from 'react-icons/ri';
import styled, { css } from 'styled-components';

export type ChatMsg = {
  role: 'user' | 'bot';
  lines: string[];
};

export type LogData = {
  id: string;
  title: string;
  time: string;
  desc: string;
};

interface ChatbotPanelProps {
  title?: string;
  initialMessages?: ChatMsg[];
  height?: string;
  onSend?: (
    text: string,
  ) => void | string | string[] | Promise<void | string | string[]>;
  className?: string;
  logs?: LogData[];
}

const DEFAULT_MSGS: ChatMsg[] = [
  {
    role: 'user',
    lines: ['오늘 불량 현황 알려줘'],
  },
  {
    role: 'bot',
    lines: ['안녕하세요! AI 조치 이력 챗봇입니다.', '궁금한 내용을 물어보세요.'],
  },
];

export default function ChatbotPanel({
  title = 'AI 챗봇 어시스턴트',
  initialMessages = DEFAULT_MSGS,
  height = 'calc(100dvh - 80px)',
  onSend,
  className,
  logs = [],
}: ChatbotPanelProps) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState('');

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const textarea = taRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    body.scrollTop = body.scrollHeight;
  }, [msgs]);

  const generateAnswer = (question: string): string[] => {
    if (logs.length === 0) {
      return ['현재 로드된 데이터가 없습니다.'];
    }

    const normalizedQuestion = question.replace(/\s+/g, '').toLowerCase();

    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const today = new Date(now.getTime() - offset).toISOString().slice(0, 10);

    if (
      normalizedQuestion.includes('최근') ||
      normalizedQuestion.includes('마지막') ||
      (normalizedQuestion.includes('제일') &&
        normalizedQuestion.includes('늦게'))
    ) {
      const latest = [...logs].sort((a, b) => b.time.localeCompare(a.time))[0];

      if (!latest) {
        return ['데이터가 없습니다.'];
      }

      const cleanTitle = latest.title
        .replace('QR 코드 인식됨: ', '')
        .replace('Log_', '');

      return [`가장 최근 기록은 [${latest.time}] 입니다.`, `내용: ${cleanTitle}`];
    }

    if (normalizedQuestion.includes('오늘')) {
      const todayCount = logs.filter((log) => log.time.startsWith(today)).length;

      return [`오늘(${today}) 발생한 기록은 총 ${todayCount}건 입니다.`];
    }

    if (
      normalizedQuestion.includes('전체') ||
      normalizedQuestion.includes('총') ||
      normalizedQuestion.includes('몇개') ||
      normalizedQuestion.includes('몇건')
    ) {
      return [`현재 시스템에 조회된 기록은 총 ${logs.length}건 입니다.`];
    }

    if (normalizedQuestion.includes('시')) {
      const match = normalizedQuestion.match(/(\d{1,2})시/);

      if (match) {
        const hour = match[1].padStart(2, '0');
        const count = logs.filter((log) => log.time.includes(` ${hour}:`)).length;

        return [`${hour}시대에 발생한 기록은 총 ${count}건 입니다.`];
      }
    }

    return [
      '죄송해요, 질문을 정확히 이해하지 못했어요.',
      "'최근', '오늘', '총 건수', '09시' 같은 키워드로 질문해 주세요.",
    ];
  };

  const handleSend = async () => {
    const text = input.trim();

    if (!text) {
      return;
    }

    setMsgs((prev) => [...prev, { role: 'user', lines: [text] }]);
    setInput('');

    try {
      if (onSend) {
        const result = await onSend(text);

        if (result) {
          const lines = Array.isArray(result) ? result : [result];

          setMsgs((prev) => [...prev, { role: 'bot', lines }]);
          return;
        }
      }

      setTimeout(() => {
        const answerLines = generateAnswer(text);

        setMsgs((prev) => [...prev, { role: 'bot', lines: answerLines }]);
      }, 300);
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          role: 'bot',
          lines: ['에러가 발생했어요. 잠시 후 다시 시도해 주세요.'],
        },
      ]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleResetMessages = () => {
    setMsgs(initialMessages);
  };

  return (
    <RightCol className={className}>
      <ChatCard $height={height}>
        <ChatHeader>
          <ChatTitle>
            <RiRobot2Fill />
            {title}
          </ChatTitle>

          <RefreshButton
            type="button"
            aria-label="챗봇 메시지 초기화"
            onClick={handleResetMessages}
          >
            <MdRefresh />
          </RefreshButton>
        </ChatHeader>

        <ChatBody ref={bodyRef}>
          {msgs.map((message, messageIndex) => (
            <MsgRow
              key={`${message.role}-${messageIndex}`}
              $role={message.role}
            >
              {message.role === 'bot' && (
                <BotAvatar aria-hidden="true">
                  <RiRobot2Fill />
                </BotAvatar>
              )}

              <MessageBubble $role={message.role}>
                {message.lines.map((line, lineIndex) => (
                  <MsgLine key={`${line}-${lineIndex}`}>{line}</MsgLine>
                ))}
              </MessageBubble>
            </MsgRow>
          ))}
        </ChatBody>

        <ChatInput>
          <textarea
            ref={taRef}
            rows={1}
            placeholder="메세지를 입력하세요..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <SendButton type="button" aria-label="메시지 전송" onClick={handleSend}>
            <MdSend />
          </SendButton>
        </ChatInput>
      </ChatCard>
    </RightCol>
  );
}

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const RightCol = styled.aside`
  position: sticky;
  top: 40px;
  max-height: calc(100vh - 80px);
  align-self: start;
  min-height: 0;

  @media (max-width: 1100px) {
    position: static;
    max-height: none;
  }
`;

const ChatCard = styled.section<{ $height: string }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: ${({ $height }) => $height};
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 20px;
  background: var(--color-surface, #ffffff);
  color: var(--color-text-primary, #111827);

  @media (max-width: 1100px) {
    height: 800px;
  }

  @media (max-width: 768px) {
    height: 680px;
    border-radius: 18px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 24px 30px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface-muted, #f8fafc);
  color: var(--color-text-primary, #111827);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ChatTitle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: var(--color-text-primary, #111827);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.03em;
  word-break: keep-all;

  svg {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
    color: var(--color-accent, #2563eb);
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const RefreshButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  color: var(--color-text-secondary, #64748b);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  svg {
    width: 26px;
    height: 26px;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-border-strong, #cbd5e1);
    background: var(--color-surface-hover, #f1f5f9);
    color: var(--color-text-primary, #111827);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus, rgba(37, 99, 235, 0.18));
    outline-offset: 2px;
  }
`;

const ChatBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  padding: 30px;
  overflow-y: auto;
  background: var(--color-surface, #ffffff);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-border-strong, #cbd5e1);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    padding: 22px;
  }
`;

const MsgRow = styled.div<{ $role: 'user' | 'bot' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ $role }) =>
    $role === 'user' ? 'flex-end' : 'flex-start'};
  gap: 12px;
  min-width: 0;
`;

const BotAvatar = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 999px;
  background: var(--color-surface-muted, #f8fafc);
  color: var(--color-accent, #2563eb);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MessageBubble = styled.div<{ $role: 'user' | 'bot' }>`
  max-width: 80%;
  padding: 18px 24px;
  border: 1px solid
    ${({ $role }) =>
      $role === 'user'
        ? 'var(--color-accent, #2563eb)'
        : 'var(--color-border, #e5e7eb)'};
  border-radius: 20px;
  border-top-left-radius: ${({ $role }) => ($role === 'bot' ? '4px' : '20px')};
  border-top-right-radius: ${({ $role }) => ($role === 'user' ? '4px' : '20px')};
  background: ${({ $role }) =>
    $role === 'user'
      ? 'var(--color-accent-soft, rgba(37, 99, 235, 0.08))'
      : 'var(--color-surface-muted, #f8fafc)'};
  color: ${({ $role }) =>
    $role === 'user'
      ? 'var(--color-accent, #2563eb)'
      : 'var(--color-text-primary, #111827)'};
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  @media (max-width: 768px) {
    max-width: 86%;
    padding: 16px 18px;
    font-size: 18px;
  }
`;

const MsgLine = styled.span`
  display: block;
`;

const ChatInput = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin: 20px;
  padding: 20px;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 16px;
  background: var(--color-surface-muted, #f8fafc);
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-within {
    border-color: var(--color-accent, #2563eb);
    background: var(--color-surface, #ffffff);
  }

  textarea {
    flex: 1;
    min-height: 56px;
    max-height: 160px;
    padding: 12px 16px;
    resize: none;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--color-text-primary, #111827);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.5;

    &::placeholder {
      color: var(--color-text-tertiary, #94a3b8);
    }
  }

  @media (max-width: 768px) {
    margin: 16px;
    padding: 16px;

    textarea {
      font-size: 18px;
    }
  }
`;

const SendButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  border: 1px solid var(--color-accent, #2563eb);
  border-radius: 999px;
  background: var(--color-accent, #2563eb);
  color: var(--color-on-accent, #ffffff);
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus, rgba(37, 99, 235, 0.18));
    outline-offset: 2px;
  }
`;
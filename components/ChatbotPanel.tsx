'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import {
  ArrowUp,
  Bot,
  Clock3,
  Database,
  Loader2,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import styled, { css, keyframes } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

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
  subtitle?: string;
  initialMessages?: ChatMsg[];
  height?: string;
  onSend?: (
    text: string,
  ) => void | string | string[] | Promise<void | string | string[]>;
  className?: string;
  logs?: LogData[];
  showHeader?: boolean;
}

type ChatThemeStyle = {
  colorScheme: 'light' | 'dark';
  shell: string;
  panel: string;
  panelSolid: string;
  elevated: string;
  muted: string;
  mutedHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  onAccent: string;
  userBubble: string;
  userText: string;
  botBubble: string;
  botText: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  focus: string;
  scrollbar: string;
};

const CHAT_THEME: Record<'light' | 'dark', ChatThemeStyle> = {
  light: {
    colorScheme: 'light',
    shell: 'rgba(246, 247, 251, 0.72)',
    panel: 'rgba(255, 255, 255, 0.84)',
    panelSolid: '#ffffff',
    elevated: 'rgba(255, 255, 255, 0.96)',
    muted: 'rgba(244, 246, 250, 0.94)',
    mutedHover: 'rgba(235, 239, 246, 0.96)',
    border: 'rgba(17, 24, 39, 0.09)',
    borderStrong: 'rgba(17, 24, 39, 0.16)',
    textPrimary: '#111827',
    textSecondary: '#64748b',
    textTertiary: '#9ca3af',
    accent: '#0a84ff',
    accentStrong: '#111827',
    accentSoft: 'rgba(10, 132, 255, 0.1)',
    onAccent: '#ffffff',
    userBubble: '#111827',
    userText: '#ffffff',
    botBubble: 'rgba(255, 255, 255, 0.94)',
    botText: '#111827',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    shadow:
      '0 24px 60px rgba(15, 23, 42, 0.12), 0 4px 16px rgba(15, 23, 42, 0.06)',
    focus: 'rgba(10, 132, 255, 0.22)',
    scrollbar: 'rgba(100, 116, 139, 0.28)',
  },
  dark: {
    colorScheme: 'dark',
    shell: 'rgba(2, 6, 23, 0.4)',
    panel: 'rgba(17, 24, 39, 0.82)',
    panelSolid: '#111827',
    elevated: 'rgba(30, 41, 59, 0.88)',
    muted: 'rgba(30, 41, 59, 0.68)',
    mutedHover: 'rgba(51, 65, 85, 0.72)',
    border: 'rgba(226, 232, 240, 0.12)',
    borderStrong: 'rgba(226, 232, 240, 0.22)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#7dd3fc',
    accentStrong: '#f8fafc',
    accentSoft: 'rgba(125, 211, 252, 0.12)',
    onAccent: '#0f172a',
    userBubble: '#f8fafc',
    userText: '#0f172a',
    botBubble: 'rgba(30, 41, 59, 0.78)',
    botText: '#f8fafc',
    success: '#86efac',
    warning: '#fcd34d',
    danger: '#fca5a5',
    shadow:
      '0 28px 72px rgba(0, 0, 0, 0.44), 0 8px 24px rgba(0, 0, 0, 0.26)',
    focus: 'rgba(125, 211, 252, 0.26)',
    scrollbar: 'rgba(203, 213, 225, 0.24)',
  },
};

const createChatThemeVars = (theme: ChatThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --chat-shell: ${theme.shell};
  --chat-panel: ${theme.panel};
  --chat-panel-solid: ${theme.panelSolid};
  --chat-elevated: ${theme.elevated};
  --chat-muted: ${theme.muted};
  --chat-muted-hover: ${theme.mutedHover};
  --chat-border: ${theme.border};
  --chat-border-strong: ${theme.borderStrong};
  --chat-text-primary: ${theme.textPrimary};
  --chat-text-secondary: ${theme.textSecondary};
  --chat-text-tertiary: ${theme.textTertiary};
  --chat-accent: ${theme.accent};
  --chat-accent-strong: ${theme.accentStrong};
  --chat-accent-soft: ${theme.accentSoft};
  --chat-on-accent: ${theme.onAccent};
  --chat-user-bubble: ${theme.userBubble};
  --chat-user-text: ${theme.userText};
  --chat-bot-bubble: ${theme.botBubble};
  --chat-bot-text: ${theme.botText};
  --chat-success: ${theme.success};
  --chat-warning: ${theme.warning};
  --chat-danger: ${theme.danger};
  --chat-shadow: ${theme.shadow};
  --chat-focus: ${theme.focus};
  --chat-scrollbar: ${theme.scrollbar};
`;

const DEFAULT_MSGS: ChatMsg[] = [
  {
    role: 'bot',
    lines: [
      '안녕하세요. 조치 이력 데이터를 기준으로 빠르게 요약해드릴게요.',
      '예: 오늘 기록, 최근 기록, 전체 건수, 09시 기록처럼 물어보세요.',
    ],
  },
];

const QUICK_PROMPTS = ['오늘 기록', '최근 기록', '전체 건수', '09시 기록'];

const getTodayDateString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const cleanLogTitle = (title: string) => {
  return title
    .replace('QR 코드 인식됨: ', '')
    .replace(/^Log_/u, '')
    .trim();
};

const normalizeQuestion = (question: string) => {
  return question.replace(/\s+/gu, '').toLowerCase();
};

const createAnswerFromLogs = (question: string, logs: LogData[]): string[] => {
  if (logs.length === 0) {
    return [
      '아직 불러온 조치 이력 데이터가 없습니다.',
      '영상 리스트 또는 로그 API가 로드된 뒤 다시 질문해 주세요.',
    ];
  }

  const normalizedQuestion = normalizeQuestion(question);
  const today = getTodayDateString();
  const sortedLogs = [...logs].sort((a, b) => b.time.localeCompare(a.time));
  const latest = sortedLogs[0];

  if (
    normalizedQuestion.includes('최근') ||
    normalizedQuestion.includes('마지막') ||
    (normalizedQuestion.includes('제일') && normalizedQuestion.includes('늦게'))
  ) {
    if (!latest) {
      return ['조회된 최신 기록이 없습니다.'];
    }

    return [
      `가장 최근 기록은 ${latest.time} 입니다.`,
      `항목: ${cleanLogTitle(latest.title) || latest.id}`,
      latest.desc ? `내용: ${latest.desc.slice(0, 140)}` : '내용은 아직 변환 중이거나 비어 있습니다.',
    ];
  }

  if (normalizedQuestion.includes('오늘')) {
    const todayLogs = sortedLogs.filter((log) => log.time.startsWith(today));
    const latestToday = todayLogs[0];

    if (!latestToday) {
      return [`오늘(${today}) 조회된 조치 이력은 없습니다.`];
    }

    return [
      `오늘(${today}) 조회된 조치 이력은 총 ${todayLogs.length}건입니다.`,
      `가장 최근 항목은 ${latestToday.time} · ${cleanLogTitle(latestToday.title) || latestToday.id} 입니다.`,
    ];
  }

  if (
    normalizedQuestion.includes('전체') ||
    normalizedQuestion.includes('총') ||
    normalizedQuestion.includes('몇개') ||
    normalizedQuestion.includes('몇건') ||
    normalizedQuestion.includes('건수')
  ) {
    const dates = new Set(logs.map((log) => log.time.slice(0, 10)).filter(Boolean));

    return [
      `현재 조회된 조치 이력은 총 ${logs.length}건입니다.`,
      `기록 날짜는 ${dates.size}일 범위로 확인됩니다.`,
    ];
  }

  if (normalizedQuestion.includes('시')) {
    const match = normalizedQuestion.match(/(\d{1,2})시/u);

    if (match) {
      const hour = match[1].padStart(2, '0');
      const matchedLogs = sortedLogs.filter((log) => log.time.includes(` ${hour}:`));

      if (matchedLogs.length === 0) {
        return [`${hour}시대에 조회된 조치 이력은 없습니다.`];
      }

      return [
        `${hour}시대 조치 이력은 총 ${matchedLogs.length}건입니다.`,
        `대표 항목: ${matchedLogs[0].time} · ${cleanLogTitle(matchedLogs[0].title) || matchedLogs[0].id}`,
      ];
    }
  }

  return [
    '질문을 조금 더 구체적으로 입력해 주세요.',
    '예: 오늘 기록, 최근 기록, 전체 건수, 09시 기록처럼 물어보면 바로 요약할 수 있습니다.',
  ];
};

export default function ChatbotPanel({
  title = 'AI 조치 어시스턴트',
  subtitle = '조치 이력과 영상 로그를 빠르게 요약합니다.',
  initialMessages = DEFAULT_MSGS,
  height = '100%',
  onSend,
  className,
  logs = [],
  showHeader = true,
}: ChatbotPanelProps) {
  const isDark = useThemeStore((state) => state.isDark);
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => getTodayDateString(), []);

  const stats = useMemo(() => {
    const latest = [...logs].sort((a, b) => b.time.localeCompare(a.time))[0];
    const todayCount = logs.filter((log) => log.time.startsWith(today)).length;
    const dates = new Set(logs.map((log) => log.time.slice(0, 10)).filter(Boolean));

    return {
      totalCount: logs.length,
      todayCount,
      dateCount: dates.size,
      latestTime: latest?.time ?? '-',
    };
  }, [logs, today]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 132)}px`;
  }, [input]);

  useEffect(() => {
    const scrollArea = scrollRef.current;

    if (!scrollArea) {
      return;
    }

    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isResponding]);

  const handleSend = async (presetText?: string) => {
    const text = (presetText ?? input).trim();

    if (!text || isResponding) {
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', lines: [text] }]);
    setInput('');
    setIsResponding(true);

    try {
      if (onSend) {
        const result = await onSend(text);

        if (result) {
          const lines = Array.isArray(result) ? result : [result];

          setMessages((prev) => [...prev, { role: 'bot', lines }]);
          return;
        }
      }

      await new Promise((resolve) => window.setTimeout(resolve, 260));

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          lines: createAnswerFromLogs(text, logs),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          lines: ['응답을 생성하는 중 문제가 발생했습니다.', '잠시 후 다시 시도해 주세요.'],
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleResetMessages = () => {
    setMessages(initialMessages);
    setInput('');
  };

  return (
    <ChatThemeScope $isDark={isDark} className={className}>
      <Panel $height={height} $showHeader={showHeader}>
        {showHeader && (
          <PanelHeader>
            <HeaderIntro>
              <AssistantMark aria-hidden="true">
                <Sparkles size={18} />
              </AssistantMark>

              <HeaderCopy>
                <HeaderEyebrow>Factory Copilot</HeaderEyebrow>
                <HeaderTitle>{title}</HeaderTitle>
                <HeaderSubtitle>{subtitle}</HeaderSubtitle>
              </HeaderCopy>
            </HeaderIntro>

            <HeaderAction
              type="button"
              aria-label="챗봇 대화 초기화"
              onClick={handleResetMessages}
            >
              <RefreshCcw size={17} />
            </HeaderAction>
          </PanelHeader>
        )}

        <InsightStrip aria-label="조치 이력 요약">
          <InsightCard>
            <Database size={15} />
            <span>전체</span>
            <strong>{stats.totalCount}</strong>
          </InsightCard>

          <InsightCard>
            <Clock3 size={15} />
            <span>오늘</span>
            <strong>{stats.todayCount}</strong>
          </InsightCard>

          <InsightCard>
            <Sparkles size={15} />
            <span>최근</span>
            <strong>{stats.latestTime}</strong>
          </InsightCard>
        </InsightStrip>

        <MessageStage ref={scrollRef}>

          {messages.map((message, messageIndex) => (
            <MessageRow
              key={`${message.role}-${messageIndex}`}
              $role={message.role}
            >
              {message.role === 'bot' && (
                <MessageAvatar aria-hidden="true">
                  <Bot size={16} />
                </MessageAvatar>
              )}

              <MessageStack $role={message.role}>
                <MessageMeta>{message.role === 'user' ? 'You' : 'Assistant'}</MessageMeta>
                <MessageBubble $role={message.role}>
                  {message.lines.map((line, lineIndex) => (
                    <MessageLine key={`${messageIndex}-${lineIndex}-${line}`}>
                      {line}
                    </MessageLine>
                  ))}
                </MessageBubble>
              </MessageStack>
            </MessageRow>
          ))}

          {isResponding && (
            <MessageRow $role="bot">
              <MessageAvatar aria-hidden="true">
                <Bot size={16} />
              </MessageAvatar>
              <MessageStack $role="bot">
                <MessageMeta>Assistant</MessageMeta>
                <TypingBubble>
                  <Loader2 size={16} />
                  분석 중입니다
                </TypingBubble>
              </MessageStack>
            </MessageRow>
          )}
        </MessageStage>

        <ComposerDock>
          <PromptRail>
            {QUICK_PROMPTS.map((prompt) => (
              <PromptButton
                key={prompt}
                type="button"
                disabled={isResponding}
                onClick={() => void handleSend(prompt)}
              >
                {prompt}
              </PromptButton>
            ))}
          </PromptRail>

          <Composer>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="조치 이력에 대해 질문하세요..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <SendButton
              type="button"
              aria-label="메시지 전송"
              disabled={!input.trim() || isResponding}
              onClick={() => void handleSend()}
            >
              {isResponding ? <Loader2 size={18} /> : <ArrowUp size={19} />}
            </SendButton>
          </Composer>
        </ComposerDock>
      </Panel>
    </ChatThemeScope>
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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const ChatThemeScope = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) => createChatThemeVars($isDark ? CHAT_THEME.dark : CHAT_THEME.light)}

  width: 100%;
  min-width: 0;
  min-height: 0;
  color: var(--chat-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'SF Pro Display',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
`;

const Panel = styled.section<{ $height: string; $showHeader: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: ${({ $showHeader }) =>
    $showHeader ? 'auto auto minmax(0, 1fr) auto' : 'auto minmax(0, 1fr) auto'};
  width: 100%;
  height: ${({ $height }) => $height};
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--chat-border);
  /* border-radius: 30px; */
  padding-top: 20px;
  /* background:
    radial-gradient(circle at 12% 0%, var(--chat-accent-soft), transparent 34%),
    linear-gradient(180deg, var(--chat-panel), var(--chat-shell)); */
  box-shadow: var(--chat-shadow);
  backdrop-filter: blur(22px) saturate(1.16);

  &::before {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    /* background: linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent 28%); */
    content: '';
  }
`;

const PanelHeader = styled.header`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 20px 16px;
`;

const HeaderIntro = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  min-width: 0;
`;

const AssistantMark = styled.div`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid var(--chat-border);
  border-radius: 16px;
  background: var(--chat-elevated);
  color: var(--chat-accent);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const HeaderEyebrow = styled.div`
  color: var(--chat-accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.13em;
  line-height: 1;
  text-transform: uppercase;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: var(--chat-text-primary);
  font-size: 21px;
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1.22;
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  color: var(--chat-text-secondary);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.45;
  word-break: keep-all;
`;

const HeaderAction = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--chat-border);
  border-radius: 999px;
  background: var(--chat-elevated);
  color: var(--chat-text-secondary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--chat-border-strong);
    background: var(--chat-muted-hover);
    color: var(--chat-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--chat-focus);
    outline-offset: 2px;
  }
`;

const InsightStrip = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0 16px 14px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  display: flex;
  align-content: space-between;
  align-items: center;
  gap: 4px;
  min-width: 0;
  padding: 10px 11px;
  border: 1px solid var(--chat-border);
  border-radius: 18px;
  background: var(--chat-elevated);
  position: relative;

  svg {
    color: var(--chat-accent);
  }

  span {
    color: var(--chat-text-tertiary);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  strong {
    min-width: 0;
    overflow: hidden;
    color: var(--chat-text-primary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    right: 11px;
  }
`;

const MessageStage = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 18px 18px 22px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--chat-scrollbar);
    background-clip: padding-box;
  }
`;

const WelcomeTile = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--chat-border);
  border-radius: 22px;
  background: var(--chat-muted);
`;

const WelcomeIcon = styled.div`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 14px;
  background: var(--chat-accent-soft);
  color: var(--chat-accent);
`;

const WelcomeCopy = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  strong {
    color: var(--chat-text-primary);
    font-size: 13px;
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  span {
    color: var(--chat-text-secondary);
    font-size: 12px;
    font-weight: 650;
    line-height: 1.55;
    word-break: keep-all;
  }
`;

const MessageRow = styled.div<{ $role: 'user' | 'bot' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};
  gap: 9px;
  min-width: 0;
`;

const MessageAvatar = styled.div`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  margin-top: 22px;
  border: 1px solid var(--chat-border);
  border-radius: 999px;
  background: var(--chat-elevated);
  color: var(--chat-accent);
`;

const MessageStack = styled.div<{ $role: 'user' | 'bot' }>`
  display: grid;
  justify-items: ${({ $role }) => ($role === 'user' ? 'end' : 'start')};
  gap: 5px;
  max-width: min(82%, 620px);
  min-width: 0;
`;

const MessageMeta = styled.div`
  padding: 0 4px;
  color: var(--chat-text-tertiary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const MessageBubble = styled.div<{ $role: 'user' | 'bot' }>`
  display: grid;
  gap: 5px;
  min-width: 0;
  padding: 13px 15px;
  border: 1px solid
    ${({ $role }) => ($role === 'user' ? 'transparent' : 'var(--chat-border)')};
  border-radius: 20px;
  border-top-left-radius: ${({ $role }) => ($role === 'bot' ? '8px' : '20px')};
  border-top-right-radius: ${({ $role }) => ($role === 'user' ? '8px' : '20px')};
  background: ${({ $role }) =>
    $role === 'user' ? 'var(--chat-user-bubble)' : 'var(--chat-bot-bubble)'};
  color: ${({ $role }) =>
    $role === 'user' ? 'var(--chat-user-text)' : 'var(--chat-bot-text)'};
  box-shadow: ${({ $role }) =>
    $role === 'user' ? '0 10px 24px rgba(15, 23, 42, 0.18)' : 'none'};
  font-size: 14px;
  font-weight: 650;
  line-height: 1.2;
  white-space: pre-wrap;
  word-break: break-word;
`;

const MessageLine = styled.span`
  display: block;
`;

const TypingBubble = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid var(--chat-border);
  border-radius: 999px;
  background: var(--chat-bot-bubble);
  color: var(--chat-text-secondary);
  font-size: 13px;
  font-weight: 850;

  svg {
    color: var(--chat-accent);
    animation: ${spin} 1s linear infinite;
  }
`;

const ComposerDock = styled.footer`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--chat-border);
  /* background: linear-gradient(180deg, transparent, var(--chat-panel-solid) 30%); */
`;

const PromptRail = styled.div`
  display: flex;
  gap: 7px;
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 1px;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PromptButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--chat-border);
  border-radius: 999px;
  background: var(--chat-elevated);
  color: var(--chat-text-secondary);
  font-size: 12px;
  font-weight: 850;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: var(--chat-border-strong);
    background: var(--chat-muted-hover);
    color: var(--chat-text-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  &:focus-visible {
    outline: 3px solid var(--chat-focus);
    outline-offset: 2px;
  }
`;

const Composer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  min-height: 52px;
  padding: 8px 8px 8px 14px;
  border: 1px solid var(--chat-border);
  border-radius: 24px;
  background: var(--chat-elevated);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:focus-within {
    border-color: var(--chat-accent);
    box-shadow: 0 0 0 4px var(--chat-focus);
  }

  textarea {
    width: 100%;
    min-height: 34px;
    max-height: 132px;
    padding: 7px 0;
    resize: none;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--chat-text-primary);
    font-size: 14px;
    font-weight: 600;
    /* line-height: 1.5; */
    font-family:
      'Pretendard Variable',
      'Pretendard',
      -apple-system,
      BlinkMacSystemFont,
      'SF Pro Display',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      sans-serif;

    &::placeholder {
      color: var(--chat-text-tertiary);
    }
  }
`;

const SendButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--chat-accent-strong);
  color: var(--chat-on-accent);
  transition:
    transform 160ms ease,
    opacity 160ms ease,
    background 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px) scale(1.02);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.36;
  }

  &:focus-visible {
    outline: 3px solid var(--chat-focus);
    outline-offset: 2px;
  }

  svg {
    animation: none;
  }

  &:disabled svg {
    animation: none;
  }

  &[disabled] svg {
    animation: none;
  }
`;

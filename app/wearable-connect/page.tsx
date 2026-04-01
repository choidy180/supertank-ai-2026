"use client";

import { useEffect, useState } from "react";
import styled, { css } from "styled-components"; // ✨ { css } 추가
import { LuTriangle } from "react-icons/lu";

type Status = "idle" | "checking" | "ok" | "error";

const PORT = 8080;

export default function Stream8080Frame() {
  const [host, setHost] = useState("192.168.50.196"); // 기본값은 알아서 바꿔써
  const [status, setStatus] = useState<Status>("idle");
  const [retryKey, setRetryKey] = useState(0);

  const streamUrl = host ? `http://${host}:${PORT}/` : null;
  const accessLabel = host ? `${host}:${PORT}` : "-";

  // 스트림 상태 체크
  useEffect(() => {
    if (!streamUrl) {
      setStatus("idle");
      return;
    }

    let cancelled = false;

    async function checkStream() {
      setStatus("checking");
      try {
        await fetch(streamUrl!, { // ✨ 느낌표(!) 하나만 추가해주세요!
          method: "HEAD",
          mode: "no-cors",
        });
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    checkStream();
    return () => {
      cancelled = true;
    };
  }, [streamUrl, retryKey]);

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHost(e.target.value.trim());
    setStatus("idle");
  };

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <Title>Live Stream (8080)</Title>
          <StatusBadge $status={status}>
            {status === "checking" && "상태 확인 중"}
            {status === "ok" && "스트리밍 중"}
            {status === "error" && "연결 실패"}
            {status === "idle" && "대기"}
          </StatusBadge>
        </HeaderLeft>

        <HeaderRight>
          <AccessInfo>
            <span className="label">ACCESS</span>
            <span className="value">{accessLabel}</span>
          </AccessInfo>
          <IpInput
            value={host}
            onChange={handleHostChange}
            placeholder="예: 192.168.50.196"
          />
        </HeaderRight>
      </Header>

      <ContentArea>
        {status === "ok" && streamUrl && (
          <FrameBox>
            <StyledIframe src={streamUrl} allow="fullscreen" />
          </FrameBox>
        )}

        {status === "checking" && (
          <Placeholder>
            <div className="spinner" />
            <p>스트림 상태를 확인하는 중입니다...</p>
          </Placeholder>
        )}

        {status === "error" && (
          <ErrorCard>
            <IconCircle>
              <LuTriangle size={40} />
            </IconCircle>
            <ErrorTitle>현재 스트리밍 상태가 아닙니다.</ErrorTitle>
            <ErrorDesc>
              스트림 서버가 실행 중인지, 같은 Wi-Fi에 연결되어 있는지,
              포트(8080)가 맞는지 확인한 후 다시 시도해 주세요.
            </ErrorDesc>
            <RetryButton type="button" onClick={handleRetry}>
              다시 연결 시도
            </RetryButton>
          </ErrorCard>
        )}

        {status === "idle" && !streamUrl && (
          <Placeholder>
            <p>오른쪽 위에 IP를 입력해서 스트림에 연결해 주세요.</p>
          </Placeholder>
        )}
      </ContentArea>
    </Wrapper>
  );
}

/* ─── 스타일 (Dark Theme + Indented) ───────────────────────────── */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  background: #0A0F1F;
  color: #F9FAFB;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 24px;
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 900px) {
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const StatusBadge = styled.span<{ $status: Status }>`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 700;
  border: 2px solid transparent;

  ${({ $status }) => {
    switch ($status) {
      case "ok":
        return css`
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border-color: #059669;
        `;
      case "checking":
        return css`
          background: rgba(59, 130, 246, 0.2);
          color: #60A5FA;
          border-color: #2563EB;
        `;
      case "error":
        return css`
          background: rgba(239, 68, 68, 0.2);
          color: #F87171;
          border-color: #DC2626;
        `;
      default:
        return css`
          background: #1F2937;
          color: #9CA3AF;
          border-color: #374151;
        `;
    }
  }}
`;

const AccessInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.3;

  .label {
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #9CA3AF;
    font-size: 14px;
    font-weight: 700;
  }

  .value {
    font-weight: 700;
    color: #F9FAFB;
    font-size: 20px;
  }
`;

const IpInput = styled.input`
  padding: 0 24px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid #374151;
  background: #1F2937;
  color: #F9FAFB;
  font-size: 22px;
  font-weight: 600;
  min-width: 240px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    background: #111827;
  }

  &::placeholder {
    color: #6B7280;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  border-radius: 24px;
  background: #111827;
  border: 1px solid #1F2937;
  padding: 24px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const FrameBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #1F2937;
  background: #000000;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: 2px dashed #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #0F172A;
  color: #9CA3AF;
  font-size: 24px;
  font-weight: 600;
  text-align: center;

  .spinner {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 6px solid #1F2937;
    border-top-color: #3B82F6;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorCard = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  max-width: 600px;
  height: fit-content;
  padding: 40px;
  border-radius: 24px;
  background: #111827;
  border: 2px solid #EF4444;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
`;

const ErrorTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #F9FAFB;
`;

const ErrorDesc = styled.p`
  margin: 0;
  font-size: 20px;
  color: #D1D5DB;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  margin-top: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  background: #3B82F6;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563EB;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
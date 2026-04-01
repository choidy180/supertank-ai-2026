// components/video-thumbnail.tsx

"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaVideo } from "react-icons/fa";

interface VideoThumbnailProps {
  videoUrl: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  alt?: string;
}

// 시간 포맷팅 함수 (초 -> MM:SS)
const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mDisplay = m < 10 ? `0${m}` : `${m}`;
  const sDisplay = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) return `${h}:${mDisplay}:${sDisplay}`;
  return `${mDisplay}:${sDisplay}`;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoUrl,
  width = "100%",
  height = "auto",
  className,
  alt = "Video thumbnail",
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [durationStr, setDurationStr] = useState<string>("");
  
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    setIsLoading(true);
    setIsError(false);

    const video = document.createElement("video");
    video.src = videoUrl;
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    // 1. 메타데이터 로드 (시간 계산)
    video.onloadedmetadata = () => {
      setDurationStr(formatDuration(video.duration));
      // 1초 지점으로 이동해서 썸네일 따기
      video.currentTime = 1;
    };

    // 2. 썸네일 추출
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setThumbnailSrc(dataUrl);
        }
        setIsLoading(false);
      } catch (e) {
        console.error("썸네일 생성 실패:", e);
        setIsError(true);
        setIsLoading(false);
      } finally {
         video.remove();
      }
    };

    video.onerror = () => {
        console.error("비디오 로드 실패:", videoUrl);
        setIsError(true);
        setIsLoading(false);
        video.remove();
    };

  }, [videoUrl]);

  return (
    <Wrapper $width={width} $height={height} className={className}>
      {/* 로딩 중이거나 에러가 아닐 때 이미지가 있으면 이미지 표시 */}
      {!isLoading && !isError && thumbnailSrc ? (
        <StyledImage src={thumbnailSrc} alt={alt} />
      ) : (
        // 로딩 중일 때 스켈레톤 UI 표시
        <SkeletonLoader>
            <FaVideo className="loading-icon" />
        </SkeletonLoader>
      )}

      {/* 에러 발생 시 표시할 화면 */}
      {isError && (
        <ErrorPlaceholder>
            <span>영상 없음</span>
        </ErrorPlaceholder>
      )}

      {/* 시간 라벨 (로딩 끝났을 때만 표시) */}
      {!isLoading && !isError && durationStr && (
        <DurationLabel>{durationStr}</DurationLabel>
      )}
    </Wrapper>
  );
};

export default VideoThumbnail;

/* ================= Styled Components ================= */

// 반짝이는 애니메이션 정의
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Wrapper = styled.div<{ $width: string | number; $height: string | number }>`
  position: relative;
  width: ${({ $width }) => (typeof $width === "number" ? `${$width}px` : $width)};
  height: ${({ $height }) => (typeof $height === "number" ? `${$height}px` : $height)};
  background-color: #111827;
  overflow: hidden;
  border-radius: inherit;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn { 
    from { 
      opacity: 0; 
    } 
    to { 
      opacity: 1; 
    } 
  }
`;

// ✅ 다크테마에 맞춘 스켈레톤 UI
const SkeletonLoader = styled.div`
  width: 100%;
  height: 100%;
  background: #1F2937;
  background-image: linear-gradient(
    90deg,
    #1F2937 0px,
    #374151 50%,
    #1F2937 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  display: flex;
  align-items: center;
  justify-content: center;

  .loading-icon {
    font-size: 48px; /* ✨ 아이콘 아주 크게 */
    color: #4B5563;
    opacity: 0.5;
  }
`;

const ErrorPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: #1F2937;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  font-size: 20px; /* ✨ 에러 텍스트 크게 */
  font-weight: 700;
`;

const DurationLabel = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #FFFFFF;
  font-size: 16px; /* ✨ 시간 텍스트 크게 */
  font-weight: 700;
  padding: 6px 12px; /* ✨ 여백 크게 */
  border-radius: 8px;
  line-height: 1;
  letter-spacing: 0.5px;
  z-index: 2;
  pointer-events: none;
`;
// app/logs/page.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaSpinner } from "react-icons/fa";
import { FiSearch, FiCalendar } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import VideoThumbnail from "@/components/video-thumbnail";
import ChatbotPanel from "@/components/ChatbotPanel";

/* ===========================
    Types & API Base
=========================== */
const API_BASE = "http://192.168.10.175:5000";
const WAITING_MSG = "현재 텍스트를 STT로 변환중 입니다";
const NO_TEXT_MSG = "변환된 텍스트가 없습니다";

type LogItem = {
  id: string;
  title: string;
  desc: string;
  fullLogText: string;
  thumb: string;
  videoTitle: string;
  videoSrc: string;
  videoReady: boolean;
  time: string;
  sttUrl: string;
  textUrl: string;
};

type ModalStep = "closed" | "video";

type ApiLogItem = { IMG_PATH: string; LOG_NAME: string; STT_NAME: string; TIME: string; VIDEO_NAME: string; };
type LogsApiResponse = { data: ApiLogItem[]; status: string; };
type SttResponse = { config: { dialogs: { speakerText: string }[] }; status: string; message?: string; };

/* ===========================
    Helper Functions
=========================== */
const formatTimeDisplay = (timeStr: string) => {
  if (!timeStr) return { date: "", time: "" };
  const parts = timeStr.split(' ');
  if (parts.length < 2) return { date: timeStr, time: "" };
  const date = parts[0].replace(/-/g, '. ');
  const time = parts[1].substring(0, 8);
  return { date, time };
};

const convertToInputFormat = (dbTimeStr: string) => {
    if (!dbTimeStr) return "";
    return dbTimeStr.replace(' ', 'T').substring(0, 16);
};

const getNowInputFormat = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

// ✨ 화면 표출용 날짜 포맷 함수 추가
const formatForDisplay = (dateString: string) => {
    if (!dateString) return "날짜 및 시간 선택";
    return dateString.replace("T", " ");
};

const isTimeOverOneMinute = (logTimeStr: string): boolean => {
    if (!logTimeStr) return true; 
    try {
        const logDate = new Date(logTimeStr.replace(' ', 'T'));
        const now = new Date();
        const diffMs = now.getTime() - logDate.getTime();
        return diffMs > 60000;
    } catch (e) {
        return true; 
    }
};

/* ===========================
    URL 빌더
=========================== */
const buildImageNameUrl = (imgPath: string) => `${API_BASE}/api/images/${encodeURIComponent(imgPath)}`;
const buildImageUrl = (imgPath: string, imgName: string) => `${API_BASE}/api/images/${encodeURIComponent(imgPath)}/${encodeURIComponent(imgName)}`;
const buildSttUrl = (sttName: string) => `${API_BASE}/api/STT/${encodeURIComponent(sttName)}`;
const buildTextUrl = (logName: string) => `${API_BASE}/api/text/${encodeURIComponent(logName)}`;
const buildVideoUrl = (videoName: string) => `${API_BASE}/api/videos/${encodeURIComponent(videoName)}`;

/* ===========================
    Animation CSS (Gradient Text)
=========================== */
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const waitingCss = css`
  background: linear-gradient(
    to right,
    #60A5FA,
    #A78BFA,
    #F472B6,
    #60A5FA
  );
  background-size: 300% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: ${gradientAnimation} 3s ease infinite;
  font-weight: 800;
  display: inline-block;
`;

const spin = keyframes` 
  100% { transform: rotate(360deg); } 
`;

/* ===========================
    Sub-Component: Expandable Description
=========================== */
const ExpandableDesc = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const isWaiting = text === WAITING_MSG;

  useEffect(() => {
    if (textRef.current) {
      if (isWaiting || text === NO_TEXT_MSG) {
         setShowButton(false);
         return;
      }
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight + 1;
      setShowButton(isOverflowing);
    }
  }, [text, isWaiting]);

  return (
    <DescWrapper>
      <TextContainer ref={textRef} $expanded={expanded} $isWaiting={isWaiting}>
        {text}
      </TextContainer>
      {showButton && !isWaiting && (
        <ToggleButton onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
          {expanded ? <>접기 <FaChevronUp size={16} /></> : <>더보기 <FaChevronDown size={16} /></>}
        </ToggleButton>
      )}
    </DescWrapper>
  );
};

/* ===========================
    Sub-Component: Skeleton Card
=========================== */
const SkeletonCard = () => {
  return (
    <Card>
      <SkeletonThumb />
      <CardBody>
        <SkeletonLine width="70%" height="40px" style={{ marginBottom: '16px' }} />
        <SkeletonLine width="30%" height="24px" style={{ marginBottom: '20px' }} />
        <SkeletonLine width="100%" height="22px" style={{ marginBottom: '8px' }} />
        <SkeletonLine width="90%" height="22px" />
        <SkeletonBtn />
      </CardBody>
    </Card>
  );
};

/* ===========================
    Page Component
=========================== */
export default function LogsPage() {
  const [allLogs, setAllLogs] = useState<LogItem[]>([]); 
  const [logs, setLogs] = useState<LogItem[]>([]);       
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadedIdsRef = useRef<Set<string>>(new Set());
  const logsRef = useRef<LogItem[]>([]);

  const [startTime, setStartTime] = useState(""); 
  const [endTime, setEndTime] = useState("");     
  const [searchCode, setSearchCode] = useState(""); 

  useEffect(() => {
    logsRef.current = allLogs;
  }, [allLogs]);

  const fetchSttOnly = async (sttUrl: string): Promise<string | null> => {
      try {
          const res = await fetch(sttUrl);
          const json: SttResponse = await res.json();
          if (res.ok && json.status !== "error") {
              return json.config?.dialogs?.map((d) => d.speakerText).join("\n") ?? "";
          }
          return null; 
      } catch (e) { return null; }
  };

  const checkVideoAvailability = async (videoUrl: string): Promise<boolean> => {
    try {
        const res = await fetch(videoUrl, { method: 'HEAD' });
        return res.ok;
    } catch (e) {
        return false;
    }
  };

  const processLogItem = async (item: ApiLogItem): Promise<LogItem> => {
    const sttUrl = buildSttUrl(item.STT_NAME);
    const textUrl = buildTextUrl(item.LOG_NAME);
    const videoUrl = buildVideoUrl(item.VIDEO_NAME);

    let imgName: string | null = null;
    try {
      const res = await fetch(buildImageNameUrl(item.IMG_PATH));
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.images) && json.images.length > 0) imgName = json.images[0];
      }
    } catch (e) { console.error(e); }
    const thumbUrl = imgName != null ? buildImageUrl(item.IMG_PATH, imgName) : "/img/logs_03.jpg";

    let fetchedTitle = item.LOG_NAME.replace(/\.[^/.]+$/, "");
    let fetchedFullText = "";
    try {
        const res = await fetch(textUrl);
        if (res.ok) {
            const textData = await res.text();
            if (textData) {
                fetchedFullText = textData;
                const lines = textData.split('\n');
                const qrLine = lines.find(line => line.includes("QR"));
                if (qrLine) fetchedTitle = qrLine.trim();
                else if (lines.length > 0) fetchedTitle = lines[0].trim();
            }
        }
    } catch (e) { console.error(e); }

    let desc = "";
    try {
      const res = await fetch(sttUrl);
      const sttJson: SttResponse = await res.json(); 
      if (res.ok && sttJson.status !== 'error') {
        desc = sttJson.config?.dialogs?.map((d) => d.speakerText).join("\n") ?? "";
      } else {
        if (sttJson.status === 'error') {
            desc = isTimeOverOneMinute(item.TIME) ? NO_TEXT_MSG : WAITING_MSG;
        } else {
            desc = sttUrl;
        }
      }
    } catch (e) { 
        desc = isTimeOverOneMinute(item.TIME) ? NO_TEXT_MSG : WAITING_MSG;
    }

    let isVideoReady = false;
    try {
        isVideoReady = await checkVideoAvailability(videoUrl);
    } catch (e) {
        isVideoReady = false;
    }

    return {
      id: item.LOG_NAME,
      title: fetchedTitle,
      fullLogText: fetchedFullText,
      desc,
      thumb: thumbUrl,
      videoTitle: `${fetchedTitle} / ${item.TIME}`,
      videoSrc: videoUrl,
      videoReady: isVideoReady, 
      time: item.TIME, 
      sttUrl,
      textUrl,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async (isFirstLoad = false) => {
      try {
        const res = await fetch(`${API_BASE}/api/data`);
        if (!res.ok) throw new Error("Failed to fetch list");
        const json = await res.json();
        const wrapper = json as LogsApiResponse;
        const items: ApiLogItem[] = wrapper?.data ?? [];

        const newItems = items.filter(item => !loadedIdsRef.current.has(item.LOG_NAME));
        
        let processedNewLogs: LogItem[] = [];
        if (newItems.length > 0) {
          if (!isFirstLoad) console.log(`🔄 새로운 로그 ${newItems.length}건 발견!`);
          processedNewLogs = await Promise.all(newItems.map(item => processLogItem(item)));
          newItems.forEach(item => loadedIdsRef.current.add(item.LOG_NAME));
        }

        const sttRetryCandidates = logsRef.current.filter(log => 
            log.desc === WAITING_MSG && !isTimeOverOneMinute(log.time)
        );
        const sttTimeoutCandidates = logsRef.current.filter(log =>
            log.desc === WAITING_MSG && isTimeOverOneMinute(log.time)
        );

        let updatedSttLogs: { id: string, newDesc: string }[] = [];
        if (sttRetryCandidates.length > 0) {
            const results = await Promise.all(
                sttRetryCandidates.map(async (item) => {
                    const newText = await fetchSttOnly(item.sttUrl);
                    if (newText) return { id: item.id, newDesc: newText };
                    return null;
                })
            );
            updatedSttLogs = results.filter((r): r is { id: string, newDesc: string } => r !== null);
        }

        const sttTimeoutUpdates = sttTimeoutCandidates.map(item => ({
            id: item.id,
            newDesc: NO_TEXT_MSG
        }));

        const videoRetryCandidates = logsRef.current.filter(log => 
            !log.videoReady && !isTimeOverOneMinute(log.time)
        );

        let updatedVideoLogs: { id: string, isReady: boolean }[] = [];
        if (videoRetryCandidates.length > 0) {
            const results = await Promise.all(
                videoRetryCandidates.map(async (item) => {
                    const isReady = await checkVideoAvailability(item.videoSrc);
                    if (isReady) return { id: item.id, isReady: true };
                    return null;
                })
            );
            updatedVideoLogs = results.filter((r): r is { id: string, isReady: boolean } => r !== null);
        }

        if (isMounted) {
            const hasSttUpdates = updatedSttLogs.length > 0 || sttTimeoutUpdates.length > 0;
            const hasVideoUpdates = updatedVideoLogs.length > 0;
            const hasNewLogs = processedNewLogs.length > 0;

            if (hasNewLogs || hasSttUpdates || hasVideoUpdates) {
                setAllLogs(prev => {
                    let newAllLogs = [...prev];

                    const allSttUpdates = [...updatedSttLogs, ...sttTimeoutUpdates];
                    if (allSttUpdates.length > 0) {
                        newAllLogs = newAllLogs.map(log => {
                            const target = allSttUpdates.find(u => u.id === log.id);
                            if (target) return { ...log, desc: target.newDesc };
                            return log;
                        });
                    }

                    if (updatedVideoLogs.length > 0) {
                         newAllLogs = newAllLogs.map(log => {
                            const target = updatedVideoLogs.find(v => v.id === log.id);
                            if (target) return { ...log, videoReady: true };
                            return log;
                        });
                    }

                    if (processedNewLogs.length > 0) {
                        newAllLogs = [...processedNewLogs, ...newAllLogs];
                    }

                    return newAllLogs.sort((a, b) => b.time.localeCompare(a.time));
                });

                if (hasNewLogs && !searchCode) {
                    setEndTime(getNowInputFormat());
                }
            }
        }
      } catch (error) {
        console.error("Polling Error:", error);
      } finally {
        if (isMounted && isFirstLoad) setIsInitialLoading(false);
      }
    };

    fetchAndProcessData(true);
    const intervalId = setInterval(() => fetchAndProcessData(false), 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCode]); 

  useEffect(() => {
    if (allLogs.length > 0 && !startTime && !endTime && !searchCode) {
      const times = allLogs.map(l => l.time).sort(); 
      const minTime = times[0]; 
      setStartTime(convertToInputFormat(minTime)); 
      setEndTime(getNowInputFormat()); 
      setLogs(allLogs); 
    } else {
      applyFilter(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLogs, startTime, endTime, searchCode]);

  const applyFilter = () => {
    if (searchCode.trim()) {
        const keyword = searchCode.toLowerCase();
        const filtered = allLogs.filter((item) => 
          item.title.toLowerCase().includes(keyword) || 
          item.id.toLowerCase().includes(keyword)
        );
        setLogs(filtered);
    } else if (startTime && endTime) {
        const startStr = startTime.replace("T", " ");
        const endStr = endTime.replace("T", " ");
        const filtered = allLogs.filter((item) => {
          return item.time >= startStr && item.time <= endStr + ":59"; 
        });
        setLogs(filtered);
    } else {
        setLogs(allLogs);
    }
  };

  const handleTimeSearch = () => {
    setSearchCode(""); 
    if (!startTime || !endTime) {
      alert("시작 시간과 종료 시간을 모두 선택해주세요.");
      return;
    }
    applyFilter(); 
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCode(value);
    setStartTime("");
    setEndTime("");
  };

  const [modalStep, setModalStep] = useState<ModalStep>("closed");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [currentVideoSrc, setCurrentVideoSrc] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openVideoModal = (item: LogItem) => {
    if (!item.videoReady) return; 

    setCurrentVideoTitle(item.videoTitle);
    setCurrentVideoSrc(item.videoSrc);
    setModalStep("video");
    setTimeout(() => { videoRef.current?.play().catch(() => {}); }, 150);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setModalStep("closed");
  };

  return (
    <>
      <Global />
      <Shell>
        <LeftCol>
          <SearchArea>
            <div className="left-group">
              <span className="label">기간검색</span>
              
              {/* ✨ 완전 커스텀 디자인: 화면에는 span 텍스트만 보이고, input은 투명하게 덮여있음 */}
              <div className="custom-date-box">
                <FiCalendar className="icon" />
                <span className="date-text">
                  {formatForDisplay(startTime)}
                </span>
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="hidden-picker"
                />
              </div>

              <span className="tilde">~</span>
              
              <div className="custom-date-box">
                <FiCalendar className="icon" />
                <span className="date-text">
                  {formatForDisplay(endTime)}
                </span>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="hidden-picker"
                />
              </div>
              
              <SearchBtn onClick={handleTimeSearch} aria-label="time-search">
                <FiSearch />
              </SearchBtn>
            </div>

            <div className="divider" />

            <div className="right-group">
              <div className="input-box text-search">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="QR 코드 또는 파일명 입력" 
                  value={searchCode}
                  onChange={handleCodeChange} 
                />
              </div>
            </div>
          </SearchArea>

          <List>
            {isInitialLoading && logs.length === 0 ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : logs.length === 0 ? (
               <NoData>검색 결과가 없습니다.</NoData>
            ) : (
              logs.map((item) => (
                <Card key={item.id}>
                  <Thumb>
                    <VideoThumbnail videoUrl={item.videoSrc} width="100%" height="100%" className="thumb-img" />
                  </Thumb>
                  <CardBody>
                    <h3 className="title">조치보고: {item.title.replace('QR 코드 인식됨: ','')}</h3>
                    <div className="time-row">
                      {(() => {
                        const { date, time } = formatTimeDisplay(item.time);
                        return (
                          <>
                            <span className="date">{date}</span>
                            <span className="sep">|</span>
                            <span className="time">{time}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ExpandableDesc text={item.desc} />
                    
                    <VideoBtn 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        if (item.videoReady) openVideoModal(item);
                      }}
                      $ready={item.videoReady}
                      disabled={!item.videoReady}
                    >
                      {item.videoReady ? (
                        <>
                          <FaCheckCircle size={20} />
                          <span>영상 확인</span>
                        </>
                      ) : (
                        <>
                          <FaSpinner className="spinner" size={20} />
                          <span>영상 생성중...</span>
                        </>
                      )}
                    </VideoBtn>

                  </CardBody>
                </Card>
              ))
            )}
          </List>
        </LeftCol>

        <ChatbotPanel logs={allLogs}/>
      </Shell>

      {modalStep === "video" && (
        <ModalDim onClick={closeModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentVideoTitle}</h3>
              <CloseBtn onClick={closeModal}>
                <IoCloseSharp size={32} />
              </CloseBtn>
            </div>
            <div className="modal-body">
              <div className="video-container">
                <video ref={videoRef} controls autoPlay>
                  <source src={currentVideoSrc} type="video/mp4" />
                  브라우저가 비디오 재생을 지원하지 않습니다.
                </video>
              </div>
            </div>
          </Modal>
        </ModalDim>
      )}
    </>
  );
}

/* ===========================
    Styled-Components (Dark Theme + Indented)
=========================== */
const Global = createGlobalStyle`
  :root {
    --bg: #0A0F1F;
    --card: #111827;
    --text: #F9FAFB;
    --muted: #9CA3AF;
    --border: #1F2937;
    --primary: #3B82F6;
    --danger: #EF4444;
    --accent: #60A5FA;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    --radius: 20px;
  }
  
  * { 
    box-sizing: border-box; 
    font-family: var(--font-pretendard); 
  }
  
  html, body, #__next { 
    height: 100%; 
  }
  
  body { 
    margin: 0; 
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; 
    color: var(--text); 
    background: var(--bg); 
  }
  
  img { 
    display: block; 
    max-width: 100%; 
  }
  
  button { 
    border: none; 
    background: none; 
    cursor: pointer; 
  }
`;

const Shell = styled.main`
  width: 100%; 
  padding: 40px; 
  display: grid; 
  grid-template-columns: 1fr 540px; 
  gap: 24px;
  min-height: 100vh;
  
  @media (max-width: 1400px) { 
    grid-template-columns: 1fr 450px; 
  }
  @media (max-width: 1100px) { 
    grid-template-columns: 1fr; 
  }
`;

const LeftCol = styled.section`
  display: flex; 
  flex-direction: column; 
  gap: 24px; 
  min-height: 0;
  max-height: calc(100vh - 80px);
`;

const SearchArea = styled.div`
  display: flex; 
  align-items: center; 
  width: 100%;
  background: var(--card); 
  padding: 24px 32px;
  border-radius: var(--radius); 
  border: 1px solid var(--border); 
  box-shadow: var(--shadow);
  gap: 24px;

  .left-group {
    display: flex; 
    align-items: center; 
    gap: 16px;
    
    .label { 
      font-size: 20px; 
      font-weight: 700; 
      color: var(--text); 
      margin-right: 8px; 
      white-space: nowrap; 
    }
    
    .tilde { 
      color: var(--muted); 
      font-weight: 700; 
      font-size: 20px;
    }
  }

  /* ✨ 완전 투명화 트릭이 적용된 데이트 피커 */
  .custom-date-box {
    position: relative;
    background: #1F2937;
    border: 2px solid #374151;
    border-radius: 12px;
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 250px;
    overflow: hidden;

    &:hover, &:focus-within {
      border-color: #3B82F6;
      background: #111827;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }

    .icon {
      color: #60A5FA;
      font-size: 24px;
      flex-shrink: 0;
      pointer-events: none;
    }

    /* 화면에 보여지는 가짜(커스텀) 텍스트 */
    .date-text {
      color: #F9FAFB;
      font-size: 18px;
      font-weight: 600;
      pointer-events: none; /* 텍스트 클릭 방해 금지 */
      white-space: nowrap;
    }

    /* 보이지 않지만 위에 덮어씌워진 실제 input */
    .hidden-picker {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0; /* ✨ 완.전.투.명! */
      cursor: pointer;
      
      /* 사파리, 크롬 등에서 달력 아이콘 위치를 전체 영역으로 확장 */
      &::-webkit-calendar-picker-indicator {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
  
  .divider { 
    width: 2px; 
    height: 40px; 
    background: var(--border); 
  }
  
  .right-group { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-left: auto; 
  }
  
  .input-box {
    background: #1F2937; 
    border-radius: 12px; 
    padding: 0 16px; 
    height: 56px;
    display: flex; 
    align-items: center; 
    transition: border-color 0.2s;
    border: 2px solid #374151;
    
    &:focus-within { 
      border-color: var(--primary); 
    }
    
    .search-icon { 
      color: var(--muted); 
      margin-right: 12px; 
      width: 24px; 
      height: 24px; 
    }
    
    input {
      border: none; 
      background: transparent; 
      height: 100%; 
      font-size: 20px;
      color: var(--text); 
      outline: none; 
      font-family: inherit; 
      cursor: pointer;
      font-weight: 500;
      
      &::placeholder {
        color: var(--muted);
      }
    }
  }
  
  .text-search { 
    width: 380px; 
    input { 
      width: 100%; 
      cursor: text; 
    } 
  }
  
  @media (max-width: 900px) {
    flex-direction: column; 
    align-items: stretch;
    
    .divider { 
      display: none; 
    }
    
    .right-group { 
      margin-left: 0; 
    }
    
    .input-box.text-search { 
      width: 100%; 
    }
    
    .left-group { 
      flex-wrap: wrap; 
      .custom-date-box { 
        flex: 1; 
      } 
    }
  }
`;

const SearchBtn = styled.button`
  width: 56px; 
  height: 56px; 
  border-radius: 12px; 
  position: relative;
  background: var(--primary); 
  display: flex; 
  justify-content: center; 
  align-items: center;
  flex-shrink: 0;
  transition: 0.2s;
  
  svg { 
    width: 28px; 
    height: 28px; 
    color: white; 
  }
  
  &:hover { 
    filter: brightness(1.2); 
    transform: scale(1.05);
  }
`;

const List = styled.div`
  display: grid; 
  gap: 24px;
  max-height: calc(100vh - 200px); 
  overflow-y: auto;
  padding-right: 10px;
`;

const NoData = styled.div`
  padding: 60px; 
  text-align: center; 
  color: var(--muted); 
  font-size: 24px;
  font-weight: 700;
  background: var(--card); 
  border-radius: var(--radius); 
  border: 1px solid var(--border);
`;

const Card = styled.article`
  display: grid; 
  grid-template-columns: 320px 1fr; 
  gap: 32px; 
  padding: 32px;
  border: 1px solid var(--border); 
  background: var(--card);
  border-radius: var(--radius); 
  box-shadow: var(--shadow); 
  position: relative;
  
  @media (max-width: 720px) { 
    grid-template-columns: 1fr; 
  }
`;

const Thumb = styled.div`
  border-radius: 16px; 
  overflow: hidden; 
  height: 220px; 
  background: #1F2937;
  
  img, div.thumb-img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
  }
`;

const CardBody = styled.div`
  display: grid; 
  align-content: start; 
  gap: 0px;
  
  .title { 
    margin: 0; 
    font-size: 34px; 
    font-weight: 900; 
    letter-spacing: -0.5px; 
    margin-bottom: 12px; 
    color: var(--text);
  }
  
  .time-row {
    display: flex; 
    align-items: center; 
    gap: 16px;
    font-size: 24px; 
    color: var(--muted); 
    font-weight: 600; 
    margin-bottom: 20px; 
    letter-spacing: 0.5px;
    
    .sep { 
      color: #374151; 
      font-weight: 300; 
      margin-top: -3px; 
    }
  }
`;

const DescWrapper = styled.div`
  margin: 10px 0 0 0; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  min-height: 60px;
`;

const TextContainer = styled.div<{ $expanded: boolean; $isWaiting?: boolean }>`
  font-size: 22px; 
  color: #D1D5DB; 
  line-height: 1.6; 
  white-space: pre-wrap; 
  word-break: break-word;
  width: 100%;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease; 
  overflow: hidden;

  ${({ $expanded }) => $expanded 
    ? css` 
        max-height: 800px; 
        opacity: 1; 
        -webkit-line-clamp: unset; 
        display: block; 
      ` 
    : css` 
        max-height: 3.2em; 
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical; 
        text-overflow: ellipsis; 
      `
  }

  ${({ $isWaiting }) => $isWaiting && waitingCss}
`;

const ToggleButton = styled.button`
  margin-top: 8px; 
  font-size: 20px; 
  color: var(--primary); 
  font-weight: 700;
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 8px 0;
  
  &:hover { 
    opacity: 0.8; 
  }
`;

const VideoBtn = styled.button<{ $ready?: boolean }>`
  position: absolute; 
  bottom: 32px; 
  right: 32px;
  display: inline-flex; 
  gap: 12px; 
  justify-content: center; 
  align-items: center;
  width: 180px; 
  height: 50px; 
  padding: 8px 16px;
  background: ${({ $ready }) => $ready ? "#3B82F6" : "#374151"}; 
  color: white; 
  border-radius: 12px; 
  font-weight: 800;
  font-size: 20px;
  transition: all 0.2s;
  cursor: ${({ $ready }) => $ready ? "pointer" : "not-allowed"};
  
  &:hover {
    filter: ${({ $ready }) => $ready ? "brightness(1.1)" : "none"};
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

/* ====== Skeleton Styles ====== */
const shimmer = keyframes`
  0% { background-position: -200% 0; } 
  100% { background-position: 200% 0; }
`;

const SkeletonThumb = styled.div`
  border-radius: 16px; 
  height: 220px; 
  width: 100%;
  background: linear-gradient(90deg, #1F2937 25%, #374151 50%, #1F2937 75%);
  background-size: 200% 100%; 
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'}; 
  height: ${({ height }) => height || '20px'};
  background: linear-gradient(90deg, #1F2937 25%, #374151 50%, #1F2937 75%);
  background-size: 200% 100%; 
  animation: ${shimmer} 1.5s infinite; 
  border-radius: 8px;
`;

const SkeletonBtn = styled.div`
  position: absolute; 
  bottom: 32px; 
  right: 32px; 
  width: 180px; 
  height: 50px; 
  border-radius: 12px;
  background: linear-gradient(90deg, #1F2937 25%, #374151 50%, #1F2937 75%);
  background-size: 200% 100%; 
  animation: ${shimmer} 1.5s infinite;
`;

/* ===========================
    Modal Styles
=========================== */
const fade = keyframes`
  from { opacity: 0; } 
  to { opacity: 1; }
`;

const pop = keyframes`
  from { transform: scale(0.95); opacity: 0; } 
  to { transform: scale(1); opacity: 1; }
`;

const ModalDim = styled.div`
  position: fixed; 
  inset: 0; 
  background: rgba(0, 0, 0, 0.85); 
  display: grid; 
  place-items: center; 
  z-index: 100;
  animation: ${fade} 0.2s ease; 
  backdrop-filter: blur(8px);
`;

const Modal = styled.div`
  width: min(1200px, 90vw); 
  background: var(--card); 
  border-radius: 24px;
  border: 1px solid var(--border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
  animation: ${pop} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden; 
  display: flex; 
  flex-direction: column;
  
  .modal-header {
    height: 80px; 
    padding: 0 32px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    border-bottom: 1px solid var(--border); 
    background: var(--card);
    
    h3 { 
      margin: 0; 
      font-size: 26px; 
      font-weight: 800; 
      color: var(--text); 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }
  }
  
  .modal-body {
    padding: 0; 
    background: black; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    width: 100%;
    
    .video-container { 
      width: 100%; 
      aspect-ratio: 16 / 9; 
      background: black; 
      
      video { 
        width: 100%; 
        height: 100%; 
        display: block; 
        outline: none; 
      } 
    }
  }
`;

const CloseBtn = styled.button`
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: var(--muted); 
  transition: all 0.2s;
  
  &:hover { 
    background-color: #1F2937; 
    color: var(--danger); 
    transform: rotate(90deg); 
  }
`;
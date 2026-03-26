"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link"; // [수정] next/link 임포트
import { 
  Package, 
  Eye, 
  Settings, 
  Presentation, 
  HardHat, 
  Truck, 
  ArrowUpRight 
} from "lucide-react";

// --- 데이터 정의 (A1 ~ A6) ---
const MENU_DATA = [
  { id: "realtime-defect-status", title: "불량 역추적", desc: "불량 수리대에서 불량품 발생 시 작업자가 육안으로 원인을 파악하고 수리 방법을 매뉴얼에서 검색합니다.", Icon: Eye },
  { id: "timecheck", title: "타임체크", desc: "정해진 시간마다 라인을 순회하며 설비를 점검하고 수기로 보고서 작성", Icon: Package },
  { id: "fire", title: "소방관리", desc: "정기적으로 소화기, 소화전 등 소방설비의 위치와 상태를 점검하고 보고서 작성", Icon: Settings },
  { id: "a4", title: "A4", desc: "A1-4", Icon: Presentation },
  { id: "a5", title: "A5", desc: "A1-5", Icon: HardHat },
  { id: "a6", title: "A6", desc: "A1-6", Icon: Truck },
];

export default function FactoryDashboard() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <DashboardWrapper>
      <BackgroundImage />
      
      <GridContainer>
        {MENU_DATA.map((menu) => (
          <MenuCard
            key={menu.id}
            href={`/${menu.id}`} // [수정] Link 컴포넌트의 href 속성 사용
            $isActive={activeCard === menu.id}
            onTouchStart={() => setActiveCard(menu.id)}
            onTouchEnd={() => setActiveCard(null)}
          >
            <IconBox>
              <menu.Icon size={32} color="#ffffff" strokeWidth={1.5} />
            </IconBox>
            
            <BottomContent>
              <TextGroup className="text-content">
                <Title>{menu.title}</Title>
                <Description>{menu.desc}</Description>
              </TextGroup>
              
              <ArrowBox className="arrow-icon">
                <ArrowUpRight size={36} color="#ffffff" strokeWidth={1.5} />
              </ArrowBox>
            </BottomContent>
          </MenuCard>
        ))}
      </GridContainer>
    </DashboardWrapper>
  );
}

// --- Styled Components ---

const DashboardWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #111111;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/bg-factory.jpg'); 
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  z-index: 0;
`;

const GridContainer = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  background-color: rgba(0, 0, 0, 0.4);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
`;

/* [수정] styled.div 에서 styled(Link) 로 변경 */
const MenuCard = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 2.5rem;
  cursor: pointer;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none; /* [추가] 링크 기본 밑줄 제거 */

  /* 터치 액티브 상태 시: 밝은 하늘색 반투명 */
  background-color: ${(props) => (props.$isActive ? "rgba(66, 133, 244, 0.85)" : "transparent")};

  .text-content {
    transition: transform 0.3s ease;
    transform-origin: left bottom;
    transform: ${(props) => (props.$isActive ? "scale(1.1)" : "scale(1)")};
  }

  .arrow-icon {
    transition: all 0.3s ease;
    opacity: ${(props) => (props.$isActive ? 0.2 : 0)};
    transform: ${(props) => (props.$isActive ? "translateY(0)" : "translateY(10px)")};
  }

  /* 데스크톱 마우스 호버 시 */
  @media (hover: hover) {
    &:hover {
      background-color: rgba(66, 133, 244, 0.85);
      
      .text-content {
        transform: scale(1.1);
      }
      
      .arrow-icon {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
`;

const BottomContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: -0.05em;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }
`;

const Description = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  min-height: 60px;

  @media (max-width: 1024px) {
    font-size: 1.0rem;
  }
`;

const ArrowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
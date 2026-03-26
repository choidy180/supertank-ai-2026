"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { 
  Activity, 
  Clock, 
  Flame, 
  PauseCircle, 
  Menu, 
  ChevronLeft 
} from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
  { id: "realtime-defect-status", label: "불량역추적", icon: <Activity size={24} />, path: "/realtime-defect-status" },
  { id: "time", label: "타임체크", icon: <Clock size={24} />, path: "/timecheck" },
  { id: "fire", label: "소방관리", icon: <Flame size={24} />, path: "/fire" },
  { id: "idle", label: "무작업관리", icon: <PauseCircle size={24} />, path: "/no-work" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  if (pathname === "/") return null;

  return (
    <SidebarWrapper $isExpanded={isExpanded}>
      <Header $isExpanded={isExpanded}>
        <LogoWrapper $isExpanded={isExpanded}>
          <LogoIcon />
          <LogoText $isExpanded={isExpanded}>SmartFactory</LogoText>
        </LogoWrapper>
        <ToggleButton onClick={() => {
          console.log("버튼 정상적으로 클릭됨! 상태 변경 시도 중..."); // 💡 클릭 확인용 로그
          setIsExpanded((prev) => !prev);
        }}>
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </ToggleButton>
      </Header>

      <MenuList>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <MenuItem key={item.id}>
              <MenuLink href={item.path} $isActive={isActive} $isExpanded={isExpanded}>
                <IconWrapper $isActive={isActive}>
                  {item.icon}
                </IconWrapper>
                <MenuText $isExpanded={isExpanded} $isActive={isActive}>
                  {item.label}
                </MenuText>
              </MenuLink>
            </MenuItem>
          );
        })}
      </MenuList>
    </SidebarWrapper>
  );
}

// --- Styled Components ---

const SidebarWrapper = styled.aside<{ $isExpanded: boolean }>`
  /* width뿐만 아니라 min-width도 같이 제어해서 강제로 크기를 맞춥니다 */
  width: ${({ $isExpanded }) => ($isExpanded ? "260px" : "80px")};
  min-width: ${({ $isExpanded }) => ($isExpanded ? "260px" : "80px")};
  
  /* 부모 flex 컨테이너에 의해 크기가 맘대로 늘어나거나 줄어드는 것을 완벽히 차단합니다 */
  flex-shrink: 0; 
  
  height: 100vh;
  background-color: #0b132b;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), min-width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: sticky;
  top: 0;
  overflow: hidden;
  z-index: 100;
`;

const Header = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) => ($isExpanded ? "space-between" : "center")};
  padding: ${({ $isExpanded }) => ($isExpanded ? "24px 20px" : "24px 0")};
  height: 80px;
  transition: all 0.3s ease;
`;

const LogoWrapper = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  width: ${({ $isExpanded }) => ($isExpanded ? "160px" : "0px")};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: width 0.3s ease, opacity 0.3s ease;
  white-space: nowrap;
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  flex-shrink: 0;
`;

const LogoText = styled.span<{ $isExpanded: boolean }>`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  /* ✨ 토글 버튼(햄버거/화살표)도 밝은 흰색으로 변경 */
  color: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 9999;
  pointer-events: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  /* ✨ 토글 아이콘 색상 강제 적용 */
  svg {
    stroke: currentColor;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  margin: 0;
  list-style: none;
  flex: 1;
`;

const MenuItem = styled.li`
  width: 100%;
`;

const MenuLink = styled(Link)<{ $isActive: boolean; $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) => ($isExpanded ? "flex-start" : "center")};
  height: 52px;
  
  /* ✨ 핵심: 닫혔을 때는 박스 크기를 48px로 줄이고, 가운데 정렬되도록 고정 */
  width: ${({ $isExpanded }) => ($isExpanded ? "100%" : "48px")};
  margin: 0 auto;
  
  padding: ${({ $isExpanded }) => ($isExpanded ? "0 12px" : "0")};
  border-radius: 12px;
  text-decoration: none;
  background-color: ${({ $isActive }) => ($isActive ? "rgba(59, 130, 246, 0.25)" : "transparent")};
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? "rgba(59, 130, 246, 0.35)" : "rgba(255, 255, 255, 0.05)")};
  }
`;

const IconWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* ✨ 아이콘 크기 고정 (밀려나거나 찌그러짐 방지) */
  min-width: 24px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  
  /* 활성화 시 확 띄게 완전한 흰색으로 */
  color: ${({ $isActive }) => ($isActive ? "#ffffff" : "#f8fafc")};
  transition: color 0.2s ease;

  svg {
    stroke: currentColor;
  }
`;

const MenuText = styled.span<{ $isExpanded: boolean; $isActive: boolean }>`
  color: #f8fafc;
  font-size: 1rem;
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "500")};
  white-space: nowrap;
  
  /* ✨ 핵심: 닫혔을 때 글자가 차지하는 물리적 공간(너비, 마진)을 0으로 만들어버림 */
  max-width: ${({ $isExpanded }) => ($isExpanded ? "200px" : "0")};
  margin-left: ${({ $isExpanded }) => ($isExpanded ? "16px" : "0")};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  overflow: hidden;
  
  transition: all 0.3s ease;
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? "auto" : "none")};
`;
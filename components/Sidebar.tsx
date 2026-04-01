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
  ChevronLeft,
  Package,
  Truck, 
  LineChart, 
  History,   
  Watch      
} from "lucide-react";
import Link from "next/link";

const MENU_ITEMS = [
  { id: "realtime-defect-status", label: "불량역추적", icon: <Activity size={24} />, path: "/realtime-defect-status" },
  { id: "time", label: "타임체크", icon: <Clock size={24} />, path: "/timecheck" },
  { id: "fire", label: "소방관리", icon: <Flame size={24} />, path: "/fire" },
  { id: "idle", label: "무작업관리", icon: <PauseCircle size={24} />, path: "/no-work" },
  { id: "receiving-material", label: "자재입고", icon: <Package size={24} />, path: "/receiving-material" }, 
  { id: "divider-1", isDivider: true }, // ✨ SMES 위 경계선
  { id: "smes", label: "SMES", icon: <Truck size={24} />, path: "/smes" }, 
  { id: "divider-2", isDivider: true }, // ✨ SMES 아래 경계선
  { id: "insight", label: "인사이트", icon: <LineChart size={24} />, path: "/insight" }, 
  { id: "action-history", label: "조치이력", icon: <History size={24} />, path: "/action-history" }, 
  { id: "wearable-connect", label: "웨어러블 연결", icon: <Watch size={24} />, path: "/wearable-connect" }, 
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  if (pathname === "/") return null;

  return (
    <SidebarWrapper $isExpanded={isExpanded}>
      <Header $isExpanded={isExpanded}>
        <LogoWrapper href="/" $isExpanded={isExpanded}>
          <LogoIcon />
          <LogoText $isExpanded={isExpanded}>SmartFactory</LogoText>
        </LogoWrapper>
        <ToggleButton onClick={() => {
          setIsExpanded((prev) => !prev);
        }}>
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </ToggleButton>
      </Header>

      <MenuList>
        {MENU_ITEMS.map((item) => {
          // ✨ 구분선 렌더링 처리
          if (item.isDivider) {
            return <MenuDivider key={item.id} />;
          }

          // item.path가 존재한다는 가정하에 안전하게 체크
          const isActive = item.path ? pathname.startsWith(item.path) : false;
          
          return (
            <MenuItem key={item.id}>
              <MenuLink href={item.path!} $isActive={isActive} $isExpanded={isExpanded}>
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
  width: ${({ $isExpanded }) => ($isExpanded ? "300px" : "80px")};
  min-width: ${({ $isExpanded }) => ($isExpanded ? "300px" : "80px")};
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

const LogoWrapper = styled(Link)<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  width: ${({ $isExpanded }) => ($isExpanded ? "200px" : "0px")};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: width 0.3s ease, opacity 0.3s ease;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
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

// ✨ 새롭게 추가된 구분선 컴포넌트
const MenuDivider = styled.li`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
  width: 100%;
  list-style: none;
`;

const MenuLink = styled(Link)<{ $isActive: boolean; $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) => ($isExpanded ? "flex-start" : "center")};
  height: 52px;
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
  min-width: 24px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
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
  max-width: ${({ $isExpanded }) => ($isExpanded ? "200px" : "0")};
  margin-left: ${({ $isExpanded }) => ($isExpanded ? "16px" : "0")};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  overflow: hidden;
  transition: all 0.3s ease;
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? "auto" : "none")};
`;
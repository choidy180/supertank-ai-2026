'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { SummaryCard as SummaryCardType, SummaryTone } from '../model/types';
import StatusCard from '../StatusCard';

// API 응답 타입 정의 (summary_total 부분만)
interface ApiSummaryTotal {
  total: number;
  completed: number;
  proceeding: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    summary_total: ApiSummaryTotal;
  };
}

// ✨ isDark 프롭스 인터페이스 추가
interface SummaryCardsProps {
  isDark: boolean;
}

const SummaryCards = ({ isDark }: SummaryCardsProps) => {
  // API에서 가져온 숫자 데이터를 저장할 상태
  const [summaryData, setSummaryData] = useState<ApiSummaryTotal>({
    total: 0,
    proceeding: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // 오늘 날짜 동적 생성 (YYYY-MM-DD)
        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const apiUrl = `http://192.168.10.175:24828/api/DX_API006002?startDate=${formattedToday}&endDate=${formattedToday}`;
        
        // 1. 네트워크 통신 자체의 실패 방어
        let response;
        try {
          response = await fetch(apiUrl, { method: 'GET' });
        } catch (networkError) {
          console.warn('[Summary API 연결 실패] 서버가 닫혀있거나 네트워크 오류입니다:', networkError);
          return; 
        }

        // 2. 통신은 성공했으나 HTTP 에러인 경우
        if (!response.ok) {
          console.warn(`[Summary API 상태 에러] ${response.status}: ${apiUrl}`);
          return; 
        }

        // 3. 정상적인 응답일 때만 JSON 파싱 진행
        const result: ApiResponse = await response.json();

        if (result.success && result.data?.summary_total) {
          setSummaryData(result.data.summary_total);
        }
      } catch (error) {
        console.warn('요약 데이터를 처리하는데 실패했습니다:', error);
      }
    };

    // 컴포넌트 마운트 시 1회 호출
    fetchSummaryData();
  }, []);

  // API 데이터를 StatusCard 컴포넌트가 그릴 수 있는 배열 형태로 변환
  const cards: SummaryCardType[] = [
    {
      id: 'total',
      label: '금일 발생 건수',
      value: String(summaryData.total),
      caption: '건 발생',
      tone: 'incident' as SummaryTone,
      icon: '🚨',
    },
    {
      id: 'proceeding',
      label: '처리 진행',
      value: String(summaryData.proceeding),
      caption: '건 진행 중',
      tone: 'processing' as SummaryTone,
      icon: '🔧',
    },
    {
      id: 'completed',
      label: '조치 완료',
      value: String(summaryData.completed),
      caption: '건 완료',
      tone: 'done' as SummaryTone,
      icon: '✅',
    },
  ];

  return (
    <Grid>
      {cards.map((card) => (
        // ✨ 하위 컴포넌트인 StatusCard에 테마 상태 전달
        <StatusCard key={card.id} card={card} isDark={isDark} />
      ))}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export default SummaryCards;
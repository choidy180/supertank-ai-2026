import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // ⚠️ 타겟 IP와 URL이 맞는지 다시 한번 확인해 주세요! 
    const response = await fetch('http://192.168.10.175:24828/api/DX_API006001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), 
      cache: 'no-store', 
    });

    // ✨ 타겟 서버가 거절했을 때, 진짜 이유를 콘솔에 출력하도록 수정
    if (!response.ok) {
      const errorText = await response.text(); // 타겟 서버가 보낸 에러 메시지 본문
      console.error('🚨 [API 연동 실패] 🚨');
      console.error(`- 상태 코드: ${response.status} ${response.statusText}`);
      console.error(`- 서버 메시지: ${errorText}`);
      
      return NextResponse.json(
        { error: `타겟 API 에러 (${response.status})`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
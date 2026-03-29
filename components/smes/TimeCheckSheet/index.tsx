import styled from 'styled-components';

// --- 스타일 컴포넌트 ---
const Container = styled.div`
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow-x: auto;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  gap: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const MainTitle = styled.h1`
  font-size: 20px;
  font-weight: 900;
  margin: 0;
  text-align: center;
  letter-spacing: 2px;
  color: #000000;
`;

const MetaInfoRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const MetaText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #000000;
`;

const ApprovalTable = styled.table`
  border-collapse: collapse;
  border: 2px solid #000000;
  text-align: center;
`;

const ApprovalTh = styled.th`
  background-color: #f0f0f0;
  border: 1px solid #000000;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 800;
`;

const ApprovalTd = styled.td`
  border: 1px solid #000000;
  padding: 12px 16px;
  font-size: 16px;
  min-width: 50px;
  height: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000000;
  table-layout: fixed;
`;

const Th = styled.th`
  background-color: #f0f0f0;
  border: 1px solid #000000;
  padding: 12px 8px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  color: #000000;
`;

const ThLarge = styled(Th)`
  font-size: 20px;
`;

const Td = styled.td`
  border: 1px solid #000000;
  padding: 10px 8px;
  font-size: 16px;
  text-align: center;
  color: #000000;
  height: 44px;
`;

const TdLeft = styled(Td)`
  text-align: left;
  padding-left: 12px;
`;

const HighlightRow = styled.tr`
  background-color: #fff4f4;
  border: 2px solid #e03e3e;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #6c757d;
  border: 1px dashed #adb5bd;
  box-sizing: border-box;
  padding: 16px;
`;

// --- 더미 데이터 설정 ---
const TIME_SLOTS = [
  '주간\n(08:30~10:30)',
  '주간\n(10:30~13:00)',
  '주간\n(14:00~15:30)',
  '야간\n(19:30~21:30)',
  '야간\n(21:30~24:00)',
  '야간\n(04:00~06:00)',
];

export default function TimeCheckSheet() {
  return (
    <Container>
      <TopSection>
        <HeaderLeft>
          <MainTitle>Time Check Sheet</MainTitle>
          <MetaInfoRow>
            <MetaText>호기 : 오븐 - discovery</MetaText>
            <MetaText>차종 : Roll</MetaText>
            <MetaText>제품명 : Tub Cover</MetaText>
            <MetaText>품번 : 22002020202</MetaText>
            <MetaText>검사일 : 2024년</MetaText>
            <MetaText>검사자 : 주 / 야</MetaText>
          </MetaInfoRow>
        </HeaderLeft>

        <ApprovalTable>
          <tbody>
            <tr>
              <ApprovalTh rowSpan={2}>결<br />재</ApprovalTh>
              <ApprovalTh>주간<br />작성자</ApprovalTh>
              <ApprovalTh>주간<br />검토자</ApprovalTh>
              <ApprovalTh>야간<br />작성자</ApprovalTh>
              <ApprovalTh>야간<br />검토자</ApprovalTh>
              <ApprovalTh>검토</ApprovalTh>
              <ApprovalTh>승인</ApprovalTh>
            </tr>
            <tr>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
            </tr>
          </tbody>
        </ApprovalTable>
      </TopSection>

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>NO</Th>
            <Th style={{ width: '60px' }}>구분</Th>
            <ThLarge style={{ width: '220px' }}>검사항목</ThLarge>
            <ThLarge colSpan={TIME_SLOTS.length}>시간대 별 체크 사항</ThLarge>
            <ThLarge style={{ width: '250px' }}>제품 검사 부위</ThLarge>
          </tr>
          <tr>
            <Th colSpan={3}></Th>
            {TIME_SLOTS.map((time, idx) => (
              <Th key={idx} style={{ whiteSpace: 'pre-line' }}>{time}</Th>
            ))}
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {/* 구동 평가 섹션 */}
          <tr>
            <Td>1</Td>
            <Th rowSpan={4}>구<br />동<br />평<br />가</Th>
            <TdLeft>외관 검사 (크랙/파손)</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`eval1-${i}`}></Td>)}
            <Td rowSpan={8} style={{ padding: '8px', verticalAlign: 'top' }}>
              <ImagePlaceholder>
                [ 이미지 영역 ]<br />
                제품 사진 및 검사 부위가<br />
                여기에 들어갑니다.
              </ImagePlaceholder>
            </Td>
          </tr>
          <tr>
            <Td>2</Td>
            <TdLeft>작동상태 확인</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`eval2-${i}`}></Td>)}
          </tr>
          <tr>
            <Td>3</Td>
            <TdLeft>온도 (AUTO HEATER)</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`eval3-${i}`}></Td>)}
          </tr>
          <tr>
            <Td>4</Td>
            <TdLeft>사이클 타임</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`eval4-${i}`}></Td>)}
          </tr>

          {/* 제품 / 구조 섹션 */}
          <tr>
            <Td>5</Td>
            <Th rowSpan={2}>제<br />품</Th>
            <TdLeft>외관 찍힘/스크래치 없을 것</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`prod1-${i}`}></Td>)}
          </tr>
          <tr>
            <Td>6</Td>
            <TdLeft>게이트 컷팅 상태 양호할 것</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`prod2-${i}`}></Td>)}
          </tr>
          <tr>
            <Td>7</Td>
            <Th rowSpan={2}>구<br />조</Th>
            <TdLeft>미성형 없을 것</TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`struc1-${i}`}></Td>)}
          </tr>
          <HighlightRow>
            <Td style={{ border: '1px solid #000' }}>8</Td>
            <TdLeft style={{ border: '1px solid #000', fontWeight: 'bold', color: '#e03e3e' }}>
              밀림/터짐 없을 것 (중요)
            </TdLeft>
            {TIME_SLOTS.map((_, i) => <Td key={`struc2-${i}`} style={{ border: '1px solid #000' }}></Td>)}
          </HighlightRow>
          
          {/* 하단 공통 영역 */}
          <tr>
            <Th colSpan={3}>검사 시간 / 특이사항</Th>
            <Td colSpan={TIME_SLOTS.length}></Td>
            <Th rowSpan={2}>특이사항 (인수인계)</Th>
          </tr>
          <tr>
            <Th colSpan={3}>검사자 서명</Th>
            {TIME_SLOTS.map((_, i) => <Td key={`sign-${i}`}></Td>)}
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
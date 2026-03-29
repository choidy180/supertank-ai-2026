import styled from 'styled-components';

// --- 데이터 정의 ---
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const CHECK_ITEMS = [
  '구동 실린더',
  '흡착패드',
  '진공게이지',
  '에어실린더',
  '에어호스',
  '배선노출',
  '센서 스위치',
  '센서 부착부',
  '볼트/너트',
  '시그널 타워',
  '도어열림',
  '설비내 먼지',
  '제품감지 센서',
];

const JIG_ITEMS = [
  'P1(기준 42mm)',
  'P2(기준 42mm)',
  'P3(기준 31mm)',
  'P4(기준 45mm)',
];

// --- 스타일 컴포넌트 ---
const Container = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow-x: auto;
`;

const MainTitle = styled.h1`
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  margin: 0;
  padding-bottom: 20px;
  color: #000000;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
  gap: 20px;
`;

const InfoGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const InfoBox = styled.div`
  display: flex;
  border: 1px solid #000000;
`;

const InfoLabel = styled.div`
  background-color: #e2e2e2;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-right: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoValue = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ApprovalTable = styled.table`
  border-collapse: collapse;
  text-align: center;
  border: 1px solid #000000;
`;

const ApprovalTh = styled.th`
  background-color: #e2e2e2;
  border: 1px solid #000000;
  padding: 4px 16px;
  font-size: 16px;
  font-weight: bold;
`;

const ApprovalTd = styled.td`
  border: 1px solid #000000;
  padding: 10px 16px;
  font-size: 16px;
  min-width: 60px;
  height: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000000;
  table-layout: fixed;
`;

const Th = styled.th`
  background-color: #e2e2e2;
  border: 1px solid #000000;
  padding: 8px 4px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #000000;
`;

const ThLarge = styled(Th)`
  font-size: 20px;
  padding: 12px;
`;

const Td = styled.td`
  border: 1px solid #000000;
  padding: 6px 4px;
  font-size: 16px;
  text-align: center;
  height: 30px;
  color: #000000;
`;

const TdLeft = styled(Td)`
  text-align: left;
  padding-left: 10px;
`;

const SubSectionTitle = styled.td`
  background-color: #e2e2e2;
  border: 1px solid #000000;
  padding: 8px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #000000;
`;

const NoteTextArea = styled.div`
  min-height: 100px;
  width: 100%;
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
`;

// --- 컴포넌트 ---
export default function EquipmentChecklist() {
  return (
    <Container>
      <MainTitle>설비 일일 점검표</MainTitle>

      <HeaderSection>
        <InfoGroup>
          <InfoBox>
            <InfoLabel>설비명</InfoLabel>
            <InfoValue>취출 Robot ( 14 )호기(탑 칠러용)</InfoValue>
          </InfoBox>
          <InfoBox>
            <InfoLabel>점검 년월</InfoLabel>
            <InfoValue>2024년 7월</InfoValue>
          </InfoBox>
        </InfoGroup>

        <ApprovalTable>
          <tbody>
            <tr>
              <ApprovalTh rowSpan={2}>결재</ApprovalTh>
              <ApprovalTh>작성</ApprovalTh>
              <ApprovalTh>검토</ApprovalTh>
              <ApprovalTh>승인</ApprovalTh>
            </tr>
            <tr>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
              <ApprovalTd></ApprovalTd>
            </tr>
          </tbody>
        </ApprovalTable>
      </HeaderSection>

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '50px' }}>구분</Th>
            <Th style={{ width: '150px' }}>항목</Th>
            {DAYS.map((day) => (
              <Th key={`header-day-${day}`}>{day}</Th>
            ))}
          </tr>
          <tr>
            <Th>Check No.</Th>
            <Th></Th>
            {DAYS.map((day) => (
              <Th key={`header-check-${day}`}></Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 1~13 기본 항목 */}
          {CHECK_ITEMS.map((item, index) => (
            <tr key={`check-${index + 1}`}>
              <Td>{index + 1}</Td>
              <Td>{item}</Td>
              {DAYS.map((day) => (
                <Td key={`check-${index + 1}-day-${day}`}></Td>
              ))}
            </tr>
          ))}

          {/* 중간 타이틀 */}
          <tr>
            <SubSectionTitle colSpan={DAYS.length + 2}>
              A/S BOLT COVER JIG 육안 점검(단위 mm)
            </SubSectionTitle>
          </tr>

          {/* 14~17 지그 항목 */}
          {JIG_ITEMS.map((item, index) => (
            <tr key={`jig-${index + 14}`}>
              <Td>{index + 14}</Td>
              <Td>{item}</Td>
              {DAYS.map((day) => (
                <Td key={`jig-${index + 14}-day-${day}`}></Td>
              ))}
            </tr>
          ))}

          {/* 확인자 서명란 */}
          <tr>
            <Td colSpan={2} style={{ backgroundColor: '#e2e2e2', fontWeight: 'bold' }}>
              일일 점검자 확인
            </Td>
            {DAYS.map((day) => (
              <Td key={`daily-sign-${day}`}></Td>
            ))}
          </tr>
          <tr>
            <Td colSpan={2} style={{ backgroundColor: '#e2e2e2', fontWeight: 'bold' }}>
              주간 점검자 확인
            </Td>
            {DAYS.map((day) => (
              <Td key={`weekly-sign-${day}`}></Td>
            ))}
          </tr>

          {/* 특이 사항 */}
          <tr>
            <Td colSpan={2} style={{ backgroundColor: '#e2e2e2', fontWeight: 'bold' }}>
              특이 사항
            </Td>
            <Td colSpan={DAYS.length}>
              <NoteTextArea></NoteTextArea>
            </Td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
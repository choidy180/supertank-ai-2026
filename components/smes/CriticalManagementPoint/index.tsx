import styled from 'styled-components';

// --- 스타일 컴포넌트 ---
const Container = styled.div`
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #ffffff;
`;

const MainTitleContainer = styled.div`
  background-color: #f2f5f9;
  border: 2px solid #000000;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const MainTitle = styled.h1`
  font-size: 28px; /* 타이틀은 가장 눈에 띄도록 28px 적용 */
  font-weight: 900;
  margin: 0;
  color: #000000;
  letter-spacing: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000000;
  table-layout: fixed;
`;

const Th = styled.th`
  background-color: #f2f5f9;
  border: 1px solid #000000;
  padding: 16px;
  font-size: 20px; /* 큰 글씨 20px */
  font-weight: 800;
  text-align: center;
  color: #000000;
`;

const Td = styled.td`
  border: 1px solid #000000;
  padding: 16px;
  font-size: 16px; /* 작은 글씨 16px */
  text-align: center;
  color: #000000;
  vertical-align: middle;
`;

const TdNoPadding = styled.td`
  border: 1px solid #000000;
  padding: 0;
  vertical-align: middle;
  height: 220px; /* 이미지/경고창의 최소 높이 확보 */
`;

const TdRole = styled(Td)`
  background-color: #f9f9f9;
  font-weight: 800;
`;

const TdDetails = styled(Td)`
  text-align: left;
  line-height: 1.8;
  padding-left: 20px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  min-height: 220px;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #555555;
`;

const AlertBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 220px;
  background-color: #ff0000; /* 강렬한 빨간 배경 */
  color: #ffffff;
  font-size: 20px; /* 경고 문구 큰 글씨 20px */
  font-weight: 900;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 2;
  box-sizing: border-box;
`;

const HighlightText = styled.span`
  color: #ff0000; /* 빨간색 텍스트 강조 */
  font-weight: 800;
`;

// --- 컴포넌트 ---
export default function CriticalManagementPoint() {
  return (
    <Container>
      <MainTitleContainer>
        <MainTitle>중점 관리 항목</MainTitle>
      </MainTitleContainer>

      <Table>
        {/* 열(Column) 너비 비율 설정 */}
        <colgroup>
          <col style={{ width: '28%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '38%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>

        <thead>
          <tr>
            <Th>현상 및 불량 내용</Th>
            <Th colSpan={2}>관리 방안</Th>
            <Th colSpan={2}>관리 인원</Th>
          </tr>
        </thead>
        <tbody>
          {/* 작업자 행 */}
          <tr>
            <TdNoPadding>
              <ImagePlaceholder>
                [ 이미지 영역 ]<br />
                불량 현상 사진
              </ImagePlaceholder>
            </TdNoPadding>
            <TdRole>작업자</TdRole>
            <TdDetails>
              ▶ 해당 부위 집중 확인
            </TdDetails>
            <TdRole>작업자</TdRole>
            <Td>
              이형진J<br />
              김태희S
            </Td>
          </tr>

          {/* 조/반장 행 */}
          <tr>
            <TdNoPadding>
              <AlertBox>
                흑선 불량!!!<br />
                확인 후<br />
                작업 진행
              </AlertBox>
            </TdNoPadding>
            <TdRole>조/반장</TdRole>
            <TdDetails>
              ▶ 신규 작업자 배치 시, 관리<br /><br />
              <HighlightText>C/Time 3초 지연 생산 진행!!</HighlightText>
            </TdDetails>
            <TdRole>반장</TdRole>
            <Td>
              정유승K<br />
              우상윤K
            </Td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
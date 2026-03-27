import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 30px;
  padding: 0 12px;
  background: var(--chrome-bg);
  border-bottom: 1px solid #b8c2cd;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #4b5668;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #e24c4c;
  box-shadow: 0 0 0 1px rgba(80, 87, 98, 0.18);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const WindowButton = styled.span`
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1px solid rgba(105, 116, 132, 0.58);
  background: linear-gradient(180deg, #f7f9fb 0%, #dde3ea 100%);
`;

export default function WindowBar() {
  return (
    <Bar>
      <Title>
        <Dot />
        SMES ShopFloorControl
      </Title>

      <Controls>
        <WindowButton />
        <WindowButton />
        <WindowButton />
      </Controls>
    </Bar>
  );
}

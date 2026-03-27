import styled from 'styled-components';

interface MainHeaderProps {
  currentDateTime: string;
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 74px;
  padding: 10px 12px;
  background: linear-gradient(90deg, #1c232e 0%, #111822 45%, #1a2028 100%);
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const LogoSquare = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, #edf2f7 0%, #cbd5df 100%);
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #6b7788;
  }

  &::before {
    inset: 5px 7px 5px 5px;
    clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%);
  }

  &::after {
    inset: 7px 5px 7px 11px;
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
  }
`;

const Brand = styled.div`
  display: grid;
  gap: 2px;
`;

const BrandTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const Gmes = styled.span`
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #ffffff;

  span:first-child {
    color: #e1282f;
  }
`;

const MachineCode = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #8ea0b8;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const TimePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid rgba(86, 134, 92, 0.45);
  background: linear-gradient(180deg, #0a220d 0%, #071808 100%);
  color: #38ff5a;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 24px rgba(56, 255, 90, 0.06);
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #38ff5a;
  box-shadow: 0 0 12px rgba(56, 255, 90, 0.75);
`;

const ActionButton = styled.button<{ $tone?: 'neutral' | 'green' }>`
  appearance: none;
  border: 1px solid
    ${({ $tone = 'neutral' }) => ($tone === 'green' ? 'rgba(98, 192, 101, 0.56)' : 'rgba(111, 122, 139, 0.72)')};
  background: ${({ $tone = 'neutral' }) => ($tone === 'green' ? 'linear-gradient(180deg, #41c85f 0%, #31a84a 100%)' : 'linear-gradient(180deg, #646e7d 0%, #4e5763 100%)')};
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
`;

export default function MainHeader({ currentDateTime }: MainHeaderProps) {
  return (
    <Header>
      <Left>
        <LogoSquare />
        <Brand>
          <BrandTitle>
            <Gmes>
              <span>G</span>MES
            </Gmes>
            가전 사출 20호기(2300T)
            <MachineCode>[PCS1M0000]</MachineCode>
          </BrandTitle>
        </Brand>
      </Left>

      <Right>
        <TimePill suppressHydrationWarning>
          <LiveDot />
          {currentDateTime}
        </TimePill>
        <ActionButton>● Config</ActionButton>
        <ActionButton>→ Logout</ActionButton>
        <ActionButton $tone="green">↑ Update</ActionButton>
      </Right>
    </Header>
  );
}

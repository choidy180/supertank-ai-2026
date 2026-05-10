import type { ContextMeta } from '@/types/wearable-connect/types';
import {
  Description,
  Eyebrow,
  Header,
  HeaderMeta,
  MetaPill,
  Title,
  TitleBlock,
} from '@/styles/wearable-connect/styles';

type PageHeaderProps = {
  pageMeta: ContextMeta;
  targetCount: number;
  onlineCount: number;
  checkingCount: number;
};

export function PageHeader({
  pageMeta,
  targetCount,
  onlineCount,
  checkingCount,
}: PageHeaderProps) {
  return (
    <Header>
      <TitleBlock>
        <Eyebrow>{pageMeta.badge}</Eyebrow>
        <Title>{pageMeta.title}</Title>
        <Description>{pageMeta.description}</Description>
      </TitleBlock>

      <HeaderMeta>
        <MetaPill>
          등록 장비 <strong>{targetCount}</strong>
        </MetaPill>
        <MetaPill>
          연결 가능 <strong>{onlineCount}</strong>
        </MetaPill>
        <MetaPill>
          확인 중 <strong>{checkingCount}</strong>
        </MetaPill>
      </HeaderMeta>
    </Header>
  );
}

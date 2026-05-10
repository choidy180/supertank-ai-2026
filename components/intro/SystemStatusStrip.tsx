import { LANDING_STATS } from '@/model/intro//menuItems';
import { StatusItem, StatusStrip, StatusText, StatusValue } from '@/styles/intro/styles';

const SystemStatusStrip = () => {
  return (
    <StatusStrip aria-label="대시보드 구성 요약">
      {/* {LANDING_STATS.map((item) => (
        <StatusItem key={item.label}>
          <StatusValue>{item.value}</StatusValue>
          <StatusText>
            <span>{item.label}</span>
            <p>{item.caption}</p>
          </StatusText>
        </StatusItem>
      ))} */}
    </StatusStrip>
  );
};

export default SystemStatusStrip;

import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type Props = {
  message: string;
};

export function QueryPendingFallback({ message }: Props) {
  return (
    <div
      css={css`
        padding: 40px 24px;
        text-align: center;
      `}
    >
      <Text typography="t5" fontWeight="semibold">
        불러오는 중
      </Text>
      <Spacing size={8} />
      <Text typography="t7" color={colors.grey600}>
        {message}
      </Text>
    </div>
  );
}

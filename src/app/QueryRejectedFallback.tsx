import { css } from '@emotion/react';
import { Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type Props = {
  message: string;
  onRetry: () => void;
};

export function QueryRejectedFallback({ message, onRetry }: Props) {
  return (
    <div
      css={css`
        padding: 40px 24px;
        text-align: center;
      `}
    >
      <Text typography="t5" fontWeight="semibold">
        불러오지 못했어요
      </Text>
      <Spacing size={8} />
      <Text typography="t7" color={colors.grey600}>
        {message}
      </Text>
      <Spacing size={20} />
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <Button size="small" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}

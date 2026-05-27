import { ParseKeys, TOptions, t } from 'i18next';
import React from 'react';
import { Text as TextBase, TextProps as TextPropsBase } from 'tamagui';
import { scale } from 'utils';

export type TextProps = TextPropsBase & {
  text?: string;
  tx?: TxKeyPath;
  txOptions?: TOptions & { [key: string]: any };
};

export const Text = ({ tx, text, txOptions, children, ...rest }: TextProps) => {
  const i18nText = tx ? t(tx as ParseKeys, txOptions) : '';
  const content = i18nText || text || children;

  return (
    <TextBase fontSize={scale(14)} fontWeight="500" {...rest}>
      {content}
    </TextBase>
  );
};

export default Text;

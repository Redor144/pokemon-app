import { requireNativeView } from 'expo';
import * as React from 'react';

import { AnimatedTextViewProps } from './AnimatedText.types';

const NativeView: React.ComponentType<AnimatedTextViewProps> = requireNativeView('AnimatedText');

export default function AnimatedTextView({value, color, style}: AnimatedTextViewProps) {
  return <NativeView value={value} color={color} style={style} />;
}

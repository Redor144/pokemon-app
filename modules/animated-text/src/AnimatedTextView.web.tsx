import { AnimatedTextViewProps } from "./AnimatedText.types";

// AnimatedTextView is not available on the web platform.
export default function AnimatedTextView(_props: AnimatedTextViewProps) {
  throw new Error("AnimatedTextView is not available on the web platform.");
}

export function formatDetectionLabel(label: string) {
  return label
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDetectionConfidence(score: number) {
  return `${Math.round(score * 100)}% confidence`;
}

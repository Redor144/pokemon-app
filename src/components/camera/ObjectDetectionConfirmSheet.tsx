import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import type { Detection } from 'react-native-executorch';
import ObjectDetectionConfirmContent from '@/components/camera/ObjectDetectionConfirmContent';
import ModalSheetContainer from '@/components/sheets/ModalSheetContainer';
import { useModalBottomSheet } from '@/hooks/useModalBottomSheet';
import type { ProposalPreview } from '@/hooks/useObjectTapTracking';

type Props = {
  isOpen: boolean;
  detection: Detection | null;
  preview: ProposalPreview | null;
  onAccept: () => void;
  onDismiss: () => void;
};

export default function ObjectDetectionConfirmSheet({
  isOpen,
  detection,
  preview,
  onAccept,
  onDismiss,
}: Props) {
  const { index, requestOpen, close, handleIndexChange, handleSettle } = useModalBottomSheet({
    shouldOpen: isOpen,
    onClearSelection: onDismiss,
  });

  useEffect(() => {
    if (isOpen) {
      requestOpen();
    }
  }, [isOpen, requestOpen]);

  const handleAccept = useCallback(() => {
    onAccept();
    close();
  }, [close, onAccept]);

  const handleDismiss = useCallback(() => {
    onDismiss();
    close();
  }, [close, onDismiss]);

  return (
    <ModalSheetContainer
      index={index}
      onIndexChange={handleIndexChange}
      onSettle={handleSettle}
      contentStyle={styles.sheetContent}
    >
      <ObjectDetectionConfirmContent
        detection={detection}
        preview={preview}
        onAccept={handleAccept}
        onDismiss={handleDismiss}
      />
    </ModalSheetContainer>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    width: '100%',
    alignItems: 'stretch',
  },
});

import { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import ObjectTrackingLostContent from "@/components/camera/ObjectTrackingLostContent";
import ModalSheetContainer from "@/components/sheets/ModalSheetContainer";
import { useModalBottomSheet } from "@/hooks/useModalBottomSheet";

type Props = {
  isOpen: boolean;
  label: string | null;
  onDismiss: () => void;
};

export default function ObjectTrackingLostSheet({
  isOpen,
  label,
  onDismiss,
}: Props) {
  const { index, requestOpen, close, handleIndexChange, handleSettle } =
    useModalBottomSheet({
      shouldOpen: isOpen,
      onClearSelection: onDismiss,
    });

  useEffect(() => {
    if (isOpen) {
      requestOpen();
    }
  }, [isOpen, requestOpen]);

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
      <ObjectTrackingLostContent label={label} onDismiss={handleDismiss} />
    </ModalSheetContainer>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    width: "100%",
    alignItems: "stretch",
  },
});

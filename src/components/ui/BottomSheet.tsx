import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors, radius, spacing } from '@/constants/theme';

export interface BottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  title?: string;
  snapPoints?: (string | number)[];
  children?: React.ReactNode;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  ({ title, snapPoints = ['50%', '85%'], children, onClose }, ref) => {
    const sheetRef = useRef<GorhomBottomSheet>(null);
    const points = useMemo(() => snapPoints, [snapPoints]);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    );

    return (
      <GorhomBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={points}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
        </BottomSheetView>
      </GorhomBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.bg.secondary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handle: { backgroundColor: colors.border.default, width: 40 },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
});

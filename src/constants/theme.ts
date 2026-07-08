export const colors = {
    background: '#0d0d1a',
    foreground: '#f0f0f5',
    card: '#161627',
    cardForeground: '#f0f0f5',
    primary: '#ffcb05',
    primaryForeground: '#0d0d1a',
    secondary: '#cc0000',
    secondaryForeground: '#ffffff',
    muted: '#1e1e35',
    mutedForeground: '#8888aa',
    border: 'rgba(255, 203, 5, 0.15)',
    secondaryBorder: 'rgba(204, 0, 0, 0.15)',
  
    popover: '#1e1e35',
    popoverForeground: '#f0f0f5',
    accent: '#3d3a6b',
    accentForeground: '#f0f0f5',
    destructive: '#ff4444',
    destructiveForeground: '#ffffff',
    inputBackground: '#1e1e35',
    ring: '#ffcb05',
    overlay: 'rgba(0, 0, 0, 0.5)',
    controlBackground: 'rgba(255, 255, 255, 0.08)',
    controlBorder: 'rgba(255, 255, 255, 0.18)',
    controlRing: 'rgba(255, 255, 255, 0.35)',
    stat: '#ff5f36',
  } as const;
  
  export const fontFamilies = {
    heading: 'Nunito',      // headings, tab labels, buttons
    body: 'DMSans',         // body / general UI
    mono: 'DMMono',         // IDs, stats, labels
  } as const;
  
  export const fonts = {
    // Nunito — 400, 600, 700, 800, 900
    nunitoRegular: 'Nunito_400Regular',
    nunitoSemiBold: 'Nunito_600SemiBold',
    nunitoBold: 'Nunito_700Bold',
    nunitoExtraBold: 'Nunito_800ExtraBold',
    nunitoBlack: 'Nunito_900Black',
  
    // DM Sans — 400, 500, 600
    dmSansRegular: 'DMSans_400Regular',
    dmSansMedium: 'DMSans_500Medium',
    dmSansSemiBold: 'DMSans_600SemiBold',
  
    // DM Mono — 400, 500
    dmMonoRegular: 'DMMono_400Regular',
    dmMonoMedium: 'DMMono_500Medium',
  } as const;
  
  export const fontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  };
  
  export const radius = {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    full: 9999,
  } as const;
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  } as const;
  
  export const typography = {
    screenTitle: {
      fontFamily: fonts.nunitoBlack,
      fontSize: 22,
      lineHeight: 24,
      color: colors.foreground,
    },
    heading: {
      fontFamily: fonts.nunitoBold,
      fontSize: 22,
      lineHeight: 28,
      color: colors.foreground,
    },
    body: {
      fontFamily: fonts.dmSansRegular,
      fontSize: 16,
      lineHeight: 24,
      color: colors.foreground,
    },
    label: {
      fontFamily: fonts.nunitoBold,
      fontSize: 14,
      lineHeight: 20,
      color: colors.foreground,
    },
    caption: {
      fontFamily: fonts.nunitoBold,
      fontSize: 12,
      lineHeight: 16,
      color: colors.mutedForeground,
    },
    tabLabel: {
      fontFamily: fonts.nunitoBold,
      fontSize: 12,
      lineHeight: 16,
    },
    mono: {
      fontFamily: fonts.dmMonoRegular,
      fontSize: 10,
      lineHeight: 14,
      color: colors.mutedForeground,
    },
    monoSmall: {
      fontFamily: fonts.dmMonoMedium,
      fontSize: 9,
      lineHeight: 12,
      color: colors.mutedForeground,
    },
    pokemonId: {
      fontFamily: fonts.dmMonoMedium,
      fontSize: 11,
      lineHeight: 14,
      color: colors.mutedForeground,
    },
    pokemonName: {
      fontFamily: fonts.nunitoBold,
      fontSize: 16,
      lineHeight: 20,
      color: colors.foreground,
    },
    pokemonNameLarge: {
      fontFamily: fonts.nunitoBold,
      fontSize: 24,
      lineHeight: 28,
      color: colors.foreground,
    },
  } as const;
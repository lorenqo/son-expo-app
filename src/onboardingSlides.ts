import { ImageSourcePropType } from 'react-native'

export type OnboardingSlide = {
  key: string
  title: string
  description: string
  image?: ImageSourcePropType
  hint?: string
  final?: boolean
}

export const getOnboardingSlides = (t: (key: string) => string): OnboardingSlide[] => [
  {
    key: 'slide1',
    title: t('onboarding.slide1_title'),
    description: t('onboarding.slide1_desc'),
    image: require('../assets/onboarding/slide1.png'),
  },
  {
    key: 'slide2',
    title: t('onboarding.slide2_title'),
    description: t('onboarding.slide2_desc'),
    image: require('../assets/onboarding/slide2.png'),
  },
  {
    key: 'slide3',
    title: t('onboarding.slide3_title'),
    description: t('onboarding.slide3_desc'),
    image: require('../assets/onboarding/slide3.png'),
  },
  {
    key: 'slide4',
    title: t('onboarding.slide4_title'),
    description: t('onboarding.slide4_desc'),
    image: require('../assets/onboarding/slide4.png'),
  },
  {
    key: 'slide5',
    title: t('onboarding.slide5_title'),
    description: t('onboarding.slide5_desc'),
    hint: t('onboarding.slide5_hint'),
    final: true,
  },
]

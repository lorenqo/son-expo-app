import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const { t } = useTranslation()

  return (
    <View className="flex-1 bg-[#1C1022] items-center justify-center">
      <SafeAreaView className="flex-1 bg-transparent">
        <View className="flex-1 items-center justify-center px-6 py-8">
          <Text className="text-white text-[26px] font-bold tracking-[-0.3px] mb-[10px] text-center">
            {t('settings.title')}
          </Text>
          <Text className="text-[#B790CB] text-[15px] leading-[22px] text-center max-w-[280px]">
            {t('settings.inDevelopment')}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

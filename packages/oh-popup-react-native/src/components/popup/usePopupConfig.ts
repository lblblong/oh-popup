import { useMemo } from 'react'
import { ViewStyle } from 'react-native'
import {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
} from 'react-native-reanimated'
import { Position } from './type'

export function usePopupConfig(position?: Position) {
  return useMemo(() => {
    if (position === 'top') {
      return {
        entering: SlideInUp,
        exiting: SlideOutUp,
        style: {} as ViewStyle,
      }
    } else if (position === 'bottom') {
      return {
        entering: SlideInDown,
        exiting: SlideOutDown,
        style: {
          justifyContent: 'flex-end',
        } as ViewStyle,
      }
    } else if (position === 'right') {
      return {
        entering: SlideInRight,
        exiting: SlideOutRight,
        style: {
          alignItems: 'flex-end',
        } as ViewStyle,
      }
    } else if (position === 'left') {
      return {
        entering: SlideInLeft,
        exiting: SlideOutLeft,
        style: {
          alignItems: 'flex-start',
        } as ViewStyle,
      }
    } else {
      return {
        entering: FadeIn,
        exiting: FadeOut,
        style: {
          alignItems: 'center',
          justifyContent: 'center',
        } as ViewStyle,
      }
    }
  }, [position])
}

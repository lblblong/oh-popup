import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Dimensions,
  ScaledSize,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
} from 'react-native-reanimated'
import { useUpdate } from '../../hooks/useUpdate'
import { Position } from './type'
import { usePopupConfig } from './usePopupConfig'

export interface PopupProps {
  visible: boolean
  position?: Position
  duration?: number
  zIndex?: number
  mask?: boolean | number
  maskClosable?: boolean
  onClose?: () => void
  onClosed?: () => void
  onOpened?: () => void
  destroyOnClose?: boolean
  children?: React.ReactNode
  maskStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

export const Popup: FC<PopupProps> = (props) => {
  const {
    visible = false,
    position = 'bottom',
    duration = 300,
    zIndex = 999,
    maskClosable = true,
    mask = true,
    onClose,
    destroyOnClose,
    children,
  } = props
  const update = useUpdate()
  let screenRef = useRef<ScaledSize>()
  if (screenRef.current === undefined) {
    screenRef.current = Dimensions.get('screen')
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      screenRef.current = screen
      update()
    })
    return () => {
      subscription?.remove()
    }
  }, [])

  const [animatedVisible, setAnimatedVisible] = useState(visible)

  const config = usePopupConfig(position)

  const onOpened = () => {
    props.onOpened?.()
  }

  const onClosed = () => {
    setAnimatedVisible(false)
    props.onClosed?.()
  }

  useLayoutEffect(() => {
    if (visible) {
      setAnimatedVisible(true)
    } else {
      setAnimatedVisible(false)
    }
  }, [visible])

  const onMaskClick = () => {
    if (maskClosable) {
      setAnimatedVisible(false)
      onClose?.()
    }
  }

  const renderMask = () => {
    if (mask === false) return null

    const opacity = typeof mask === 'number' ? mask : 0.73

    return (
      <TouchableWithoutFeedback onPress={onMaskClick}>
        {animatedVisible ? (
          <Animated.View
            style={[
              {
                zIndex,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
            ]}
            entering={FadeIn.duration(duration)
              .easing(Easing.ease)
              .withCallback(() => {
                'worklet'
                runOnJS(onOpened)()
              })}
            exiting={FadeOut.duration(duration)
              .easing(Easing.ease)
              .withCallback(() => {
                'worklet'
                runOnJS(onClosed)()
              })}
          >
            <View
              style={[
                {
                  width: '100%',
                  height: '100%',
                  opacity,
                  backgroundColor: '#000000',
                },
                props.maskStyle,
              ]}
            ></View>
          </Animated.View>
        ) : (
          <View></View>
        )}
      </TouchableWithoutFeedback>
    )
  }

  const renderPopup = () => {
    return (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            zIndex,
            flexDirection: 'column',
          },
          config.style,
        ]}
      >
        <TouchableWithoutFeedback onPress={onMaskClick}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          ></View>
        </TouchableWithoutFeedback>
        {animatedVisible && (
          <Animated.View
            style={[{ zIndex }, props.style]}
            entering={config.entering.duration(duration).easing(Easing.linear)}
            exiting={config.exiting.duration(duration).easing(Easing.linear)}
          >
            {children}
          </Animated.View>
        )}
      </View>
    )
  }

  return (
    <>
      {renderMask()}
      {renderPopup()}
    </>
  )
}

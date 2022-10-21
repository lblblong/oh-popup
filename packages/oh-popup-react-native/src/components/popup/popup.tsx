import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
    Animated,
    Dimensions,
    ScaledSize,
    ScrollView,
    StyleProp,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native'
import { useUpdate } from '../../hooks/useUpdate'
import { Position } from './type'
import { usePopupAnim } from './usePopupAnim'

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
    visible,
    position,
    duration,
    zIndex,
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
    return () => subscription?.remove()
  }, [])

  const [animatedVisible, setAnimatedVisible] = useState(visible)
  const contentAnim = usePopupAnim({
    position: position!,
    duration: duration!,
  })

  const opacityAnim = useRef(new Animated.Value(0)).current

  const maskShow = () => {
    if (props.mask === false) return
    const opacity =
      props.mask === true || props.mask === undefined ? 0.73 : props.mask

    Animated.timing(opacityAnim, {
      toValue: opacity,
      duration,
      useNativeDriver: true,
    }).start(() => {
      props.onOpened?.()
    })
  }

  const maskHide = () => {
    if (props.mask === false) return

    Animated.timing(opacityAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setAnimatedVisible(false)
      props.onClosed?.()
    })
  }

  useLayoutEffect(() => {
    if (visible) {
      setAnimatedVisible(true)
      maskShow()
      contentAnim.show()
    } else {
      maskHide()
      contentAnim.hide()
    }
  }, [visible])

  const onMaskClick = () => {
    if (props.maskClosable) onClose?.()
  }

  const renderMask = () => {
    if (animatedVisible === false) return null
    if (props.mask === false) return null

    return (
      <TouchableWithoutFeedback onPress={onMaskClick}>
        <Animated.View
          style={[
            {
              zIndex,
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              opacity: opacityAnim,
              backgroundColor: '#000000',
            },
            props.maskStyle,
          ]}
        ></Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  const renderPopup = () => {
    if (animatedVisible === false) return null

    return (
      <ScrollView
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex,
        }}
      >
        <View
          style={{
            position: 'relative',
            width: screenRef.current!.width,
            height: screenRef.current!.height,
            zIndex,
          }}
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
          <View style={contentAnim.style}>
            <Animated.View
              style={[
                {
                  zIndex,
                },
                contentAnim.innerStyle,
                props.style,
              ]}
            >
              {children}
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      {renderMask()}
      {renderPopup()}
    </>
  )
}

Popup.defaultProps = {
  visible: false,
  duration: 300,
  zIndex: 999,
  mask: true,
  position: 'bottom',
  destroyOnClose: false,
  maskClosable: true,
}

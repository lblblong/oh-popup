import { useRef } from 'react'
import { Animated, StyleProp } from 'react-native'
import { Position } from './type'

export function usePopupAnim({
    position,
    duration,
}: {
    position: Position
    duration: number
}): {
    style: StyleProp<any>
    innerStyle: StyleProp<any>
    show: () => void
    hide: () => void
} {
    const slideAnim = useRef(new Animated.Value(100)).current
    const opacityAnim = useRef(new Animated.Value(0)).current

    if (position === 'top') {
        return {
            style: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
            },
            innerStyle: {
                position: 'relative',
                left: 0,
                right: 0,
                bottom: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                }),
            },
            show: () => {
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
            hide: () => {
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
        }
    } else if (position === 'bottom') {
        return {
            style: {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
            },
            innerStyle: {
                position: 'relative',
                left: 0,
                right: 0,
                top: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                }),
            },
            show: () => {
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
            hide: () => {
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
        }
    } else if (position === 'right') {
        return {
            style: {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
            },
            innerStyle: {
                position: 'relative',
                top: 0,
                bottom: 0,
                left: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                }),
            },
            show: () => {
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
            hide: () => {
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
        }
    } else if (position === 'left') {
        return {
            style: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
            },
            innerStyle: {
                position: 'relative',
                top: 0,
                bottom: 0,
                right: slideAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                }),
            },
            show: () => {
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
            hide: () => {
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration,
                    useNativeDriver: false,
                }).start()
            },
        }
    } else {
        return {
            style: {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            },
            innerStyle: {
                opacity: opacityAnim,
            },
            show: () => {
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }).start()
            },
            hide: () => {
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }).start()
            },
        }
    }
}

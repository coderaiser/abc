import {useEffect} from 'react';
import {
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import {colors} from '../../theme/colors';
import {useJoke} from './useJoke';

export function JokeCard() {
    const {
        joke,
        status,
        refresh,
    } = useJoke();
    
    const cardOpacity = useSharedValue(0);
    
    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{
            translateY: (1 - cardOpacity.value) * 14,
        }],
    }));
    
    useEffect(() => {
        cardOpacity.value = withTiming(1, {
            duration: 450,
        });
    }, []);
    
    return (
        <>
            <Animated.View style={[styles.card, cardStyle]}>
                <Text style={styles.setup}>
                    {joke ? joke.setup : 'Warming up the mic…'}
                </Text>
                <Text style={styles.punchline}>{joke ? joke.punchline : ''}</Text>
            </Animated.View>
            {status === 'error'
                ? (
                    <Text style={styles.error}>Could not load a joke. Try again.</Text>
                )
                : null}
            <Pressable style={styles.refresh} onPress={refresh}>
                <Text style={styles.refreshText}>New joke</Text>
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    error: {
        color: colors.danger,
        fontSize: 13,
        marginTop: 8,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        minHeight: 140,
        justifyContent: 'center',
    },
    setup: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    punchline: {
        color: colors.accent,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
        marginTop: 8,
    },
    refresh: {
        alignSelf: 'flex-start',
        backgroundColor: colors.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    refreshText: {
        color: '#231A05',
        fontWeight: '700',
    },
});

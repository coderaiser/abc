import {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
    ScrollView,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import * as amplitude from '@amplitude/analytics-react-native';
import {RootStackParamList} from '../App';
import {
    fetchRandomJoke,
    Joke,
    SHOWS,
    colors,
} from './data';

// The whole home experience lives in this one file for now. It works, but it
// was put together fast. Structure it however you think it should be.
export function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const [joke, setJoke] = useState<Joke | null>(null);
    const [, setHistory] = useState<Joke[]>([]);
    const [refreshCount, setRefreshCount] = useState(0);
    
    const cardOpacity = useSharedValue(0);
    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{
            translateY: (1 - cardOpacity.value) * 14,
        }],
    }));
    
    const loadJoke = async () => {
        const next = await fetchRandomJoke();
        setJoke(next);
        setHistory((prev) => [...prev, next]);
        amplitude.track('joke_loaded', {
            joke_id: next.id,
            refresh_count: refreshCount,
        });
    };
    
    useEffect(() => {
        cardOpacity.value = withTiming(1, {
            duration: 450,
        });
        loadJoke();
    }, []);
    
    const onManualRefresh = () => {
        setRefreshCount((c) => c + 1);
        loadJoke();
        amplitude.track('joke_refreshed');
    };
    
    // --- Shows list state ---
    const [sortByScarcity, setSortByScarcity] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    const shows = sortByScarcity
        ? SHOWS.toSorted((a, b) => a.seatsLeft - b.seatsLeft)
        : SHOWS;
    
    // --- Booking form ---
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            quantity: '2',
        },
        validationSchema: Yup.object({
            name: Yup
                .string()
                .required('Name is required'),
            email: Yup
                .string()
                .email('Enter a valid email')
                .required('Email is required'),
            quantity: Yup
                .number()
                .min(1)
                .max(6)
                .required(),
        }),
        onSubmit: () => setBooked(true),
    });
    
    const [booked, setBooked] = useState(false);
    
    const onBook = () => {
        amplitude.track('booking_submitted', {
            name: formik.values.name,
            email: formik.values.email,
            quantity: Number(formik.values.quantity),
        });
        setBooked(true);
    };
    
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.kicker}>THE PUNCHLINE</Text>
                <Text style={styles.hero}>Comedy that lands. Seats that don't last.</Text>
                <Animated.View style={[styles.card, cardStyle]}>
                    <Text style={styles.setup}>
                        {joke ? joke.setup : 'Warming up the mic…'}
                    </Text>
                    <Text style={styles.punchline}>{joke ? joke.punchline : ''}</Text>
                </Animated.View>
                <Pressable style={styles.refresh} onPress={onManualRefresh}>
                    <Text style={styles.refreshText}>New joke</Text>
                </Pressable>
                <Text style={styles.section}>Upcoming shows</Text>
                <Pressable
                    style={styles.toggle}
                    onPress={() => setSortByScarcity((v) => !v)}
                >
                    <Text style={styles.toggleText}>
                        {sortByScarcity ? 'Sort: fewest seats' : 'Sort: date'}
                    </Text>
                </Pressable>
                <FlatList
                    data={shows}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item, index}) => (
                        <Pressable
                            onPress={() => {
                                setSelectedIndex(index);
                                navigation.navigate('ShowDetails', {
                                    showId: item.id,
                                });
                            }}
                            style={[styles.row, selectedIndex === index && styles.rowSelected]}
                        >
                            <Text style={styles.headliner}>{item.headliner}</Text>
                            <Text style={styles.meta}>
                                {new Date(item.night).toLocaleString()} · {item.venue}
                            </Text>
                            <Text style={styles.seats}>{item.seatsLeft} seats left</Text>
                        </Pressable>
                    )}
                />
                <Text style={styles.section}>Book tickets</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor={colors.muted}
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                />
                {formik.touched.name && formik.errors.name
                    ? (
                        <Text style={styles.error}>{formik.errors.name}</Text>
                    )
                    : null}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.muted}
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                />
                {formik.touched.email && formik.errors.email
                    ? (
                        <Text style={styles.error}>{formik.errors.email}</Text>
                    )
                    : null}
                <TextInput
                    style={styles.input}
                    placeholder="Tickets"
                    placeholderTextColor={colors.muted}
                    value={formik.values.quantity}
                    onChangeText={formik.handleChange('quantity')}
                />
                <Pressable style={styles.book} onPress={onBook}>
                    <Text style={styles.bookText}>Book now</Text>
                </Pressable>
                {booked
                    ? (
                        <Text style={styles.ok}>You're on the list. See you at the show.</Text>
                    )
                    : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        padding: 16,
        paddingBottom: 48,
    },
    kicker: {
        color: colors.accent,
        letterSpacing: 3,
        fontSize: 12,
        fontWeight: '700',
    },
    hero: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        marginTop: 8,
        marginBottom: 24,
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
    section: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginTop: 32,
        marginBottom: 8,
    },
    toggle: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    toggleText: {
        color: colors.muted,
        fontSize: 13,
    },
    row: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    rowSelected: {
        borderColor: colors.accent,
    },
    headliner: {
        color: colors.text,
        fontSize: 17,
        fontWeight: '700',
    },
    meta: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
    seats: {
        color: colors.accent,
        fontSize: 13,
        marginTop: 4,
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: 16,
        color: colors.text,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 8,
    },
    error: {
        color: colors.danger,
        fontSize: 13,
        marginBottom: 8,
    },
    book: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    bookText: {
        color: '#231A05',
        fontWeight: '800',
        fontSize: 16,
    },
    ok: {
        color: colors.accent,
        marginTop: 16,
        fontSize: 15,
    },
});

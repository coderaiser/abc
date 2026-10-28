import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
    ScrollView,
    Text,
    StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {JokeCard} from '../features/joke/JokeCard';
import {ShowsList} from '../features/shows/ShowsList';
import {BookingForm} from '../features/booking/BookingForm';

export function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.kicker}>THE PUNCHLINE</Text>
                <Text style={styles.hero}>Comedy that lands. Seats that don't last.</Text>
                <JokeCard/>
                <ShowsList
                    onSelectShow={(showId) => navigation.navigate('ShowDetails', {
                        showId,
                    })}
                />
                <BookingForm/>
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
});

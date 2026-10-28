import {useState} from 'react';
import {
    Text,
    Pressable,
    FlatList,
    StyleSheet,
} from 'react-native';
import {colors} from '../../theme/colors';
import {
    SHOWS,
    sortByScarcity as sortShows,
} from './shows';

type ShowsListProps = {
    onSelectShow: (showId: string) => void;
};

export function ShowsList({onSelectShow}: ShowsListProps) {
    const [sortByScarcity, setSortByScarcity] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    const shows = sortByScarcity ? sortShows(SHOWS) : SHOWS;
    
    return (
        <>
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
                            onSelectShow(item.id);
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
        </>
    );
}

const styles = StyleSheet.create({
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
});

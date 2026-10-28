import {
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import {colors} from '../../theme/colors';
import {useBookingForm} from './useBookingForm';

export function BookingForm() {
    const {
        formik,
        booked,
        onBook,
    } = useBookingForm();
    
    return (
        <>
            <Text style={styles.section}>Book tickets</Text>
            <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.muted}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
            />
            { /* istanbul ignore next */formik.touched.name && formik.errors.name
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
            { /* istanbul ignore next */formik.touched.email && formik.errors.email
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

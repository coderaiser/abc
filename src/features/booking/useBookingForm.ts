import {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {trackBookingSubmitted} from '../../analytics';

export const bookingSchema = Yup.object({
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
});

export const useBookingForm = () => {
    const [booked, setBooked] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            quantity: '2',
        },
        validationSchema: bookingSchema,
        // Unreachable today: formik.handleSubmit is never called.
        onSubmit: /* istanbul ignore next */() => setBooked(true),
    });
    
    const onBook = () => {
        trackBookingSubmitted({
            name: formik.values.name,
            email: formik.values.email,
            quantity: Number(formik.values.quantity),
        });
        setBooked(true);
    };
    
    return {
        formik,
        booked,
        onBook,
    };
};

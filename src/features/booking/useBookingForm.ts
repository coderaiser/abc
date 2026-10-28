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
        .typeError('Enter a number')
        .min(1, 'Choose 1 to 6 tickets')
        .max(6, 'Choose 1 to 6 tickets')
        .required('Enter a number'),
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
        onSubmit: (values) => {
            trackBookingSubmitted({
                quantity: Number(values.quantity),
            });
            setBooked(true);
        },
    });
    
    return {
        formik,
        booked,
    };
};

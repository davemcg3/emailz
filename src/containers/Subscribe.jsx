import { Formik } from 'formik'
import { subscribeCall } from '../reducers/subscriptionSlice'
import header from '../images/cadillac.jpg'

export default function Subscribe(dispatch) {

    return (
        <>
            <img src={header} alt="Beater Cadillac" />
            <h2>Subscribe</h2>
            <p>Subscribe to our mailing list for weekly emails of pictures of cars that have had better days.</p>
            <Formik
                initialValues={{ email: '' }}
                validate={values => {
                    const errors = {}
                    if (!values.email) {
                        errors.email = 'Required'
                    } else if (
                        // Email standards are horrific and this regex leaves out a lot of valid email addresses
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address'
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        dispatch(subscribeCall(values))
                        setSubmitting(false)
                    }, 400)
                }
                }
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <br />
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        <br />
                        {errors.email && touched.email && errors.email}
                        <br />
                        <button type="submit" disabled={isSubmitting}>
                            Subscribe
                        </button>
                    </form>
                )
                }
            </Formik>
        </>
    )
}

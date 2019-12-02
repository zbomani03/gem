import './login.css';
import * as React from "react";
import {Redirect} from "react-router-dom";
import {GKAlert, GKButton, GKCard, GKCardBody, GKContent, GKFormFeedback, GKFormGroup, GKInput, GKLabel, GKPosition, GKShell, Position} from "@gkernel/ux-components";
import {ErrorMessage, Field, Form, Formik, FormikValues} from 'formik';
import * as Yup from 'yup';
import {IAuthenticationStore} from "./reduxReducer";
import {INotificationStore} from "../notificationReducer";
import {FormattedMessage, injectIntl, IntlShape} from 'react-intl';

const LoginComponent = (
    props: {
        location: any,
        authentication: IAuthenticationStore,
        notifications: INotificationStore[],
        clearNotification: (id: string) => void,
        login: (values: any, intl: IntlShape, callback: () => void) => void,
        intl: IntlShape
    }
) => {
    const {from} = props.location.state ? props.location.state : {from: {pathname: "/"}};
    if (props.authentication.access_token) {
        return <Redirect to={from.pathname === "/" ? from : {pathname: "/"}}/>;
    } else {
        return (
            <GKShell>
                <GKContent>
                    <div className="agstudio-login-container d-flex flex-row">
                        <div className="agstudio-login-container-inner">
                            <GKPosition position={Position.CC}>
                                <GKCard className="agstudio-login-card">
                                    <GKCardBody className="pb-0">
                                        <svg className="agstudio-logo" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.59 67.51">
                                            <path fill="#101010" d={`M83.19,59.52h-11v-5h2.06l6.75-22H77.57v-5H90.81l8.54,27h1.91v5H90v-5H92.5L91.4,50.8H81.59l-1,
                                            3.74h2.65Zm0-14.15h6.71L86.52,34h-.09Z`}/>
                                            <path fill="#101010" d={`M118.2,67.51h-9.08v-5h7.62c1.05,0,2.24-.28,2.24-1.88v-4a7.67,7.67,0,0,1-6.48,3.15c-5.66,
                                            0-10-4.29-10-10.82s4.34-10.87,10-10.87a7.57,7.57,0,0,1,6.62,3.24c0-.23-.09-.64-.09-1.73v-1h8v4.75h-2.1V61.07C124.91,64.36,123.27,67.51,
                                            118.2,67.51Zm.92-18.58c0-3.43-2.15-5.75-5.3-5.75s-5.25,2.32-5.25,5.75,2.15,5.7,5.25,5.7S119.12,52.31,119.12,48.93Z`}/>
                                            <path fill="#101010" d={`M135.56,57.42v2.1h-5.43V48.74h5.43a5.84,5.84,0,0,0,5.75,6c2.47,0,4.16-1.6,4.16-3.61,
                                            0-1.74-1.28-2.88-3.61-3.84L137,45.23c-4.39-1.83-6.85-4.61-6.85-9.09A9,9,0,0,1,139.49,27a8.85,8.85,0,0,1,6.25,
                                            2.38V27.56h5.43v10h-5.34c-.36-3.33-2.42-5.34-5.11-5.34a3.68,3.68,0,0,0-3.93,3.47c0,1.51.82,2.83,3.56,4l4.89,2c4.2,1.74,7.12,4.48,
                                            7.12,9,0,4.8-3.47,9.41-9.91,9.41A10,10,0,0,1,135.56,57.42Z`}/>
                                            <path fill="#101010" d={`M163.09,30.67v7.94h4.52v4.75h-4.52v9.81c0,1.33.41,1.74,1.6,1.74a22.78,22.78,0,0,0,2.28-.14v4.61a21.23,21.23,
                                            0,0,1-3.79.41c-3,0-6-.5-6-4.7V43.36h-3.28V38.61h3.28V30.67Z`}/>
                                            <path fill="#101010" d={`M179.48,60.07c-4.52,0-7.44-2.88-7.44-7.76v-9h-2.1V38.61h8V50.8c0,2.65,1.37,3.74,3.24,3.74a5.57,5.57,0,0,0,
                                            4.3-2.37V43.36H182V38.61h9.4V54.77h2.1v4.75h-7.9V58.7c0-.51.05-1.1.09-1.83A8,8,0,0,1,179.48,60.07Z`}/>
                                            <path fill="#101010" d={`M204.73,60.07c-5.76,0-10.14-4.61-10.14-11s4.34-11,10.09-11a7.6,7.6,0,0,1,6.67,
                                            3.24c0-.68-.09-2.42-.09-4v-5h-2.11V27.56h8V54.77h2.1v4.75h-8V56.87A7.66,7.66,0,0,1,204.73,60.07Zm6.66-11c0-3.24-2.19-5.7-5.34-5.7s-5.34,
                                            2.46-5.34,5.7,2.19,5.76,5.34,5.76S211.39,52.26,211.39,49.06Z`}/>
                                            <path fill="#101010" d={`M221.76,59.52V54.77h2.56V43.36h-2.56V38.61h8.5V54.77h2.55v4.75Zm5.25-32a3.83,3.83,0,0,1,3.84,3.84,3.81,3.81,0,
                                            0,1-7.62,0A3.82,3.82,0,0,1,227,27.56Z`}/>
                                            <path fill="#101010" d={`M256.59,49.06a11.19,11.19,0,1,1-11.19-11A10.88,10.88,0,0,1,256.59,49.06Zm-6,0c0-3.28-2.15-5.7-5.21-5.7s-5.25,
                                            2.42-5.25,5.7,2.15,5.71,5.25,5.71S250.61,52.31,250.61,49.06Z`}/>
                                            <polygon fill="#1bb24b" points="0 38.26 38.26 38.26 38.26 0 59.52 0 59.52 59.52 59.52 59.52 0 59.52 0 38.26"/>
                                            <polygon fill="#1bb24b" points="17.01 17.01 17.01 0 34.01 0 34.01 34.01 0 34.01 0 17.01 17.01 17.01"/>
                                            <rect fill="#1bb24b" width="12.75" height="12.75" transform="translate(0 12.76) rotate(-90)"/>
                                        </svg>
                                    </GKCardBody>
                                    <GKCardBody>
                                        <Formik
                                            initialValues={{
                                                username: '',
                                                password: '',
                                            }}
                                            validationSchema={Yup.object().shape({
                                                username: Yup.string().required(props.intl.formatMessage({id: "validation.required"})),
                                                password: Yup.string().required(props.intl.formatMessage({id: "validation.required"}))
                                                    .min(2, props.intl.formatMessage({id: "validation.tooShort"}))
                                                    .max(50, props.intl.formatMessage({id: "validation.tooLarge"}))
                                            })}
                                            onSubmit={(values, actions) => {
                                                props.login(values, props.intl, () => {
                                                    actions.setSubmitting(false);
                                                });
                                            }}
                                            render={(formikBag) => (
                                                <Form>
                                                    <GKFormGroup>
                                                        <GKLabel htmlFor="username"><FormattedMessage id="label.username"/></GKLabel>
                                                        <Field name="username" render={({field}: FormikValues) => (
                                                            <GKInput data-qa="login-username-input" {...field}
                                                                     invalid={Boolean(formikBag.touched.username && formikBag.errors.username)}
                                                                     type="text"/>
                                                        )}/>
                                                        <ErrorMessage name="username">
                                                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                                                        </ErrorMessage>
                                                    </GKFormGroup>
                                                    <GKFormGroup>
                                                        <GKLabel htmlFor="password"><FormattedMessage id="label.password"/></GKLabel>
                                                        <Field name="password" render={({field}: FormikValues) => (
                                                            <GKInput data-qa="login-password-input" {...field}
                                                                     invalid={Boolean(formikBag.touched.password && formikBag.errors.password)}
                                                                     type="password"/>
                                                        )}/>
                                                        <ErrorMessage name="password">
                                                            {msg => <GKFormFeedback>{msg}</GKFormFeedback>}
                                                        </ErrorMessage>
                                                    </GKFormGroup>
                                                    <GKFormGroup className={"text-center"}>
                                                        <GKButton data-qa="login-button" type="submit" className="login-button" id="loginButton" disabled={formikBag.isSubmitting} color="primary">
                                                            {formikBag.isSubmitting ? <FormattedMessage id="label.loggingInButton"/> : <FormattedMessage id="label.logInButton"/>}
                                                        </GKButton>
                                                    </GKFormGroup>
                                                </Form>
                                            )}
                                        />
                                    </GKCardBody>
                                </GKCard>
                            </GKPosition>
                            <GKPosition position={Position.BL}>
                                <div className="d-flex flex-row align-items-center">
                                    <svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                        <polygon fill="#c03131" fillRule="evenodd" points="40 26 48 26 48 34 40 34 40 26"/>
                                        <polygon fill="#c03131" points="26 38 48 38 48 48 26 48 26 38"/>
                                        <rect fill="#c03131" y="26" width="22" height="22"/>
                                        <path fill="#c03131" d="M24,22H0V0H48V22Z"/>
                                    </svg>
                                    <span className="p-2 copyright">&copy; 2019 Granular, Inc.</span></div>
                            </GKPosition>
                        </div>
                        <GKPosition position={
                            {
                                xl: Position.TR,
                                lg: Position.TR,
                                md: Position.TR,
                                sm: Position.TC,
                                xs: Position.TC
                            }}>
                            {props.notifications && props.notifications.map(notification =>
                                <GKAlert onDismiss={() => {
                                    props.clearNotification(notification.id);
                                }} key={notification.id} color={notification.color} timeout={3000}>{notification.message}</GKAlert>
                            )}
                        </GKPosition>
                    </div>
                </GKContent>
            </GKShell>
        );
    }
};

export default injectIntl(LoginComponent);

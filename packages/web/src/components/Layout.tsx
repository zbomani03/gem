import * as React from "react";
import {
    Col, Container,
    GKAlert,
    GKCard,
    GKCardBody,
    GKContent,
    GKLoading,
    GKLoadingType,
    GKShell,
    Row
} from "@gkernel/ux-components";
import Header from "./Header";
import {INotificationStore} from "./notificationReducer";
import {IFeatureFlagsStore} from "./featureFlagsReducer";
import {IDomainStore} from "./Domain/reduxReducer";
import wrappedFetchFactory from "../helpers/wrappedFetch";
import {agstudioAPIServiceFactory} from "@agstudio/services/lib/services/agstudioAPIService";
import {useState} from "react";
import {useEffect} from "react";
import {FormattedMessage} from "react-intl";
import Domain from "./Domain/Domain";
import {Dispatch} from "redux";
import {domainActions} from "./Domain/reduxActions";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {IAgStudioService} from "@agstudio/services/lib/models/agstudioAPIService";

export interface INavMenu {
    path: string;
    intlKey: string;
    qaLocator: string;
}

const mapStateToProps = (state: any) => ({
    authentication: state.authentication,
    agstudioAPIUrl: state.app.agstudioAPIUrl,
    featureFlags: state.featureFlags,
    domain: state.domain
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendDispatch: () => dispatch,
    saveDomain(domainObject: IDomainStore) {
        dispatch(domainActions.save(domainObject));
    }
});

const mergeProps = (propsFromState: any, propsFromDispatch: any, ownProps: any) => {
    return {
        ...propsFromState,
        ...propsFromDispatch,
        ...ownProps,
        agstudioAPIService: agstudioAPIServiceFactory(propsFromState.agstudioAPIUrl, wrappedFetchFactory(propsFromDispatch.sendDispatch(), propsFromState.authentication))
    }
};

const Layout = (
    props: {
        location: any,
        featureFlags: IFeatureFlagsStore,
        agstudioAPIService: IAgStudioService,
        domain: IDomainStore,
        navMenu: INavMenu[],
        domainRequired?: string,
        notifications: INotificationStore[],
        clearNotification: (id: string) => void,
        saveDomain: (domainObject: IDomainStore) => void,
        children: any
    }
) => {

    const params = new URLSearchParams(props.location.search);
    const growerKey = params.get("growerKey");
    const skipDomainPicker = (): boolean => !props.domainRequired || Boolean(
        (props.domainRequired === "grower" && props.domain.growers.selected) ||
        (props.domainRequired === "location" && props.domain.locations.selected) ||
        (props.domainRequired === "territory" && props.domain.territories.selected) ||
        (props.domainRequired === "company" && props.domain.companies.selected)
    );
    const {featureFlags, saveDomain} = props;

    const renderDomainPicker = () => (
        <Container>
            <Row className="justify-content-center">
                <Col xl={{size: 5}} lg={{size: 6}} md={{size: 8}} sm={{size: 10}} xs={{size: 12}}>
                    {
                        loadingFromUrl ?
                            <div className="m-4">
                                <GKLoading isLoading={true} type={GKLoadingType.Spinner} style={{height: 100}}/>
                            </div>
                            :
                            <>
                                {
                                    props.domainRequired === "grower" &&
                                    <>
                                        <h2 className="text-success text-center mt-5"><FormattedMessage id="common.selectGrower.title"/></h2>
                                        <p className="text-secondary text-center"><FormattedMessage id="common.selectGrower.text"/></p>
                                    </>
                                }
                                <GKCard>
                                    <GKCardBody>
                                        {props.domainRequired === "company" && <h2 className="text-center"><FormattedMessage id="common.domainPicker"/></h2>}
                                        <Domain domainRequired={props.domainRequired}/>
                                    </GKCardBody>
                                </GKCard>
                            </>
                    }
                </Col>
            </Row>
        </Container>
    );

    // Load From Url functionality

    const [loadingFromUrl, setLoadingFromUrl] = useState(Boolean(growerKey));

    useEffect(() => {
        if (growerKey) {
            props.agstudioAPIService.loadGrowerAncestors(growerKey).then(results => {
                saveDomain(results);
                setLoadingFromUrl(false);
            }, () => {
                setLoadingFromUrl(false);
            });
        }
    }, [props.agstudioAPIService, growerKey, saveDomain]);

    // Resource Linker Module

    const disableResourceLinker: boolean = !featureFlags.resource_linker || !featureFlags.resource_linker.enabled;

    const filteredNavMenu = disableResourceLinker ? props.navMenu.filter(nm => nm.path !== "/resource-linker") : props.navMenu;

    if (props.location.pathname === "/resource-linker" && disableResourceLinker) {
        return (<Redirect to={{pathname: '/'}}/>);
    }

    return (
        <GKShell>
            {props.location.pathname !== "/404" && <Header navMenu={filteredNavMenu}/>}
            <GKContent>
                <div id="notifications">
                    {props.notifications && props.notifications.map((notification: INotificationStore) =>
                        <GKAlert onDismiss={() => {
                            props.clearNotification(notification.id);
                        }} key={notification.id} color={notification.color} timeout={5000}>{notification.message}</GKAlert>
                    )}
                </div>
                {skipDomainPicker() ? props.children : renderDomainPicker()}
            </GKContent>
        </GKShell>
    );
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Layout);

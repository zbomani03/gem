import './header.css';
import * as React from "react";
import {Link, NavLink} from "react-router-dom";
import {
    GKCollapse,
    GKButton,
    GKIconName,
    GKNav,
    GKNavbar,
    GKNavbarLeft,
    GKNavbarRight,
    GKNavItem,
    GKIcon,
    GKModalHeader,
    GKModalBody,
    GKModal, GKTooltip
} from "@gkernel/ux-components";
import Domain from "../Domain/Domain";
import {FormattedMessage, IntlShape, injectIntl} from "react-intl";
import {useState} from "react";
import {INavMenu} from "../Layout";
import {IDomainStore} from "../Domain/reduxReducer";

const HeaderComponent = (props: { domain: IDomainStore, navMenu: INavMenu[], appName: string, logout: () => void, intl: IntlShape }) => {

    const [menuState, setMenuState] = useState(false);
    const [domainModalState, setDomainModalState] = useState(false);

    const getDomainDesc = () => {
        if (props.domain.growers.selected) {
            return props.domain.growers.list.filter(g => g.Key === props.domain.growers.selected)[0].Name;
        } else {
            if (props.domain.locations.selected) {
                return props.domain.locations.list.filter(l => l.Key === props.domain.locations.selected)[0].Name;
            } else {
                if (props.domain.territories.selected) {
                    return props.domain.territories.list.filter(t => t.Key === props.domain.territories.selected)[0].Name;
                } else {
                    if (props.domain.companies.selected) {
                        return props.domain.companies.list.filter(c => c.Key === props.domain.companies.selected)[0].Name;
                    } else {
                        return props.intl.formatMessage({id: "common.domainPicker"});
                    }
                }
            }
        }
    };

    const openHelp = () => {
        window.hasOwnProperty("WalkMePlayerAPI") && window["WalkMePlayerAPI"].toggleMenu();
    };

    return (
        <GKNavbar className="agstudio-navigation align-items-start">
            <GKNavbarLeft>
                <div className="d-flex align-items-center">
                    <GKButton data-qa="app-mobile-menu-button"
                              className={"gk-icon-button btn-icon d-inline-flex d-sm-none mr-2"} onClick={() => {
                        setMenuState(!menuState)
                    }} color="link" size="lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0V0z"/>
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </GKButton>
                    <Link data-qa="app-home-link" to="/" className="d-flex my-2 align-items-center">
                        <svg width="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.52 59.52">
                            <polygon fill="#1bb24b"
                                     points="0 38.26 38.26 38.26 38.26 0 59.52 0 59.52 59.52 59.52 59.52 0 59.52 0 38.26"/>
                            <polygon fill="#1bb24b"
                                     points="17.01 17.01 17.01 0 34.01 0 34.01 34.01 0 34.01 0 17.01 17.01 17.01"/>
                            <rect fill="#1bb24b" width="12.75" height="12.75"
                                  transform="translate(0 12.76) rotate(-90)"/>
                        </svg>
                        <h4 className="ml-2 mb-0 d-inline-block">{props.appName}</h4>
                    </Link>
                    <GKNav pills={true} className="d-none d-sm-inline-flex ml-3">
                        {props.navMenu.map(menuItem =>
                            <GKNavItem key={menuItem.path} className="d-flex">
                                <NavLink data-qa={`app-${menuItem.qaLocator}-link`}
                                         activeClassName="active"
                                         to={menuItem.path}
                                         exact={true}
                                         className="link ml-2 align-self-center">
                                    <FormattedMessage id={menuItem.intlKey}/>
                                </NavLink>
                            </GKNavItem>
                        )}
                    </GKNav>
                </div>
                <div className="d-block d-sm-none">
                    <GKCollapse isOpen={menuState}>
                        <div className="py-4 text-left">
                            {props.navMenu.map(menuItem =>
                                <NavLink key={menuItem.path} data-qa={`app-mobile-${menuItem.qaLocator}-link`} onClick={() => {
                                    setMenuState(!menuState)
                                }} to={menuItem.path} exact={true} className="link">
                                    <FormattedMessage id={menuItem.intlKey}/>
                                </NavLink>
                            )}
                        </div>
                    </GKCollapse>
                </div>
            </GKNavbarLeft>
            <GKNavbarRight>
                {/*Domain Picker*/}
                <GKButton id={"domain-picker-button"} className="mr-2" color="primary" outline={true} onClick={() => setDomainModalState(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0V0z"/>
                        <path d={`M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 
                        12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z`}/>
                    </svg>
                    <span className={"pl-1 domainPickerDesc"}>{getDomainDesc()}</span>
                </GKButton>
                <GKTooltip target="domain-picker-button" placement={"left"}>
                    <FormattedMessage id={"common.domainPicker"}/>
                </GKTooltip>
                <GKModal isOpen={domainModalState} centered={true}>
                    <GKModalHeader><FormattedMessage id="common.domainPicker"/></GKModalHeader>
                    <GKModalBody><Domain callback={() => setDomainModalState(false)}/></GKModalBody>
                </GKModal>
                {/*Domain Picker*/}
                <GKButton id={"help-button"} data-qa="app-help-button" className={"gk-icon-button btn-icon"} onClick={openHelp} color="link" size="lg">
                    <GKIcon name={GKIconName.HelpOutline}/>
                </GKButton>
                <GKTooltip target="help-button" placement={"left"}>
                    <FormattedMessage id={"common.help"}/>
                </GKTooltip>
                <GKButton id={"logout-button"} data-qa="app-logout-button" className="gk-icon-button btn-icon" onClick={props.logout} color="link" size="lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0V0z"/>
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM21 3H3v6h2V5h14v14H5v-4H3v6h18V3z"/>
                    </svg>
                </GKButton>
                <GKTooltip target="logout-button" placement={"left"}>
                    <FormattedMessage id={"label.logout"}/>
                </GKTooltip>
                {/*<GKMenuButton data-qa="app-account-button" icon={GKIconName.AccountBox} color="link" size="lg">*/}
                {/*    <GKMenuItem><Link data-qa="app-my-account-link" to="/account">Account</Link></GKMenuItem>*/}
                {/*    <GKMenuItem onSelect={props.logout} data-qa="app-logout-button"><FormattedMessage id="label.logout"/></GKMenuItem>*/}
                {/*</GKMenuButton>*/}
            </GKNavbarRight>
        </GKNavbar>
    );
};

export default injectIntl(HeaderComponent);

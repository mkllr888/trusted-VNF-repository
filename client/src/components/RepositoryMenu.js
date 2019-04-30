import {Menu, Icon} from "semantic-ui-react";
import * as PropTypes from "prop-types";
import React from "react";

// handles the Menu item (tab row)
export function RepositoryMenu(props) {
    return <Menu pointing>
        <Menu.Item
            name='repositiory'
            active={props.activeItem === "repositiory"}
            onClick={props.onClick}>
            Repository
        </Menu.Item>
        <Menu.Item
            name='dev'
            active={props.activeItem === "dev"}
            onClick={props.onClick}>
            Developer overview
        </Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item
                name='account'
                active={props.activeItem === "account"}
                onClick={props.onClick}>
                <Icon name="user"/>
                My account
            </Menu.Item>
        </Menu.Menu>
    </Menu>;
}

RepositoryMenu.propTypes = {
    activeItem: PropTypes.string,
    onClick: PropTypes.func
};
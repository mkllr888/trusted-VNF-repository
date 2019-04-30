import {Dropdown, Header, Icon, Segment} from "semantic-ui-react";
import {Accordion} from "semantic-ui-react/dist/commonjs/modules/Accordion/Accordion";
import {Form} from "semantic-ui-react/dist/commonjs/collections/Form/Form";
import * as PropTypes from "prop-types";
import React from "react";

export function DeveloperSegment(props) {
    return <Segment>
        <Header as='h1'>Developer</Header>

        <Accordion styled fluid>
            <Accordion.Title active={props.activeAccordion === 0} index={0}
                             onClick={props.onClick}>
                <Icon name='dropdown'/>
                Register new VNF package
            </Accordion.Title>
            <Accordion.Content active={props.activeAccordion === 0}>
                <Header as='h3'>Register new VNF packages</Header>
                <Form name="new" onSubmit={props.onSubmit}>
                    <Form.Field>
                        <Form.Input name='name' label='Name' placeholder='Name'/>
                        <Form.Input name='description' label='Description' placeholder='Description'/>
                        <Form.Input name='image_link' label='Image Link' placeholder='Image Link'/>
                        <Form.Input name='service_type' label='Service type'
                                    placeholder='Service type'/>
                        <Form.Input name='repository_link' label='Repository Link'
                                    placeholder='Repository Link'/>
                        <Form.Field name='price' label='Price (Ether)' control='input' type='number'
                                    step="0.00000000000000001"/>
                        <Form.Input name='version' label='Version' placeholder='Version'/>
                        <Form.Input name='requirements' label='Requirements'
                                    placeholder='Requirements'/>
                        <Form.Input name='resources' label='Resources' placeholder='Resources'/>
                    </Form.Field>
                    <Form.Button content='Submit'/>
                </Form>
            </Accordion.Content>

            <Accordion.Title active={props.activeAccordion === 1} index={1}
                             onClick={props.onClick}>
                <Icon name='dropdown'/>
                Update existing VNF package
            </Accordion.Title>
            <Accordion.Content active={props.activeAccordion === 1}>
                <Form name="update" onSubmit={props.onSubmit}>
                    <Form.Field>
                        <Dropdown
                            placeholder='Select package to update'
                            fluid
                            selection
                            options={props.repository.filter(vnf => vnf.author === props.account).map(function (vnf) {
                                return {value: vnf.index, text: vnf.name};
                            })
                            }
                            onChange={props.onIndexChosen}
                        />
                        <Form.Input name='name' label='Name' placeholder='Name'/>
                        <Form.Input name='description' label='Description' placeholder='Description'/>
                        <Form.Input name='image_link' label='Image Link' placeholder='Image Link'/>
                        <Form.Input name='service_type' label='Service type'
                                    placeholder='Service type'/>
                        <Form.Input name='repository_link' label='Repository Link'
                                    placeholder='Repository Link'/>
                        <Form.Field name='price' label='Price (Ether)' control='input' type='number'
                                    step="0.000000000001"/>
                        <Form.Input name='version' label='Version' placeholder='Version'/>
                        <Form.Input name='requirements' label='Requirements'
                                    placeholder='Requirements'/>
                        <Form.Input name='resources' label='Resources' placeholder='Resources'/>
                    </Form.Field>
                    <Form.Button content='Submit'/>
                </Form>
            </Accordion.Content>

            <Accordion.Title active={props.activeAccordion === 2} index={2}
                             onClick={props.onClick}>
                <Icon name='dropdown'/>
                Delete VNF package from repositiory
            </Accordion.Title>
            <Accordion.Content active={props.activeAccordion === 2}>
                <Form name="delete" onSubmit={props.onSubmit}>
                    <Form.Field>
                        <Dropdown
                            placeholder='Select package to delete'
                            fluid
                            selection
                            options={props.repository.filter(vnf => vnf.author === props.account).map(function (vnf) {
                                return {value: vnf.index, text: vnf.name};
                            })
                            }
                            onChange={props.onIndexChosen}
                        />
                    </Form.Field>
                    <Form.Button content='Submit'/>
                </Form>
            </Accordion.Content>
        </Accordion>

    </Segment>;
}

DeveloperSegment.propTypes = {
    activeAccordion: PropTypes.any,
    onClick: PropTypes.func,
    onSubmit: PropTypes.func,
    repository: PropTypes.func,
    onIndexChosen: PropTypes.func
};
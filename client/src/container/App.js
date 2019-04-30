import React, {Component} from "react";
import {Container, Header} from 'semantic-ui-react'

import VNFRepo from "../contracts/Repository.json";
import getWeb3 from "../utils/getWeb3";
import axios from 'axios'
// import sha256 from 'crypto-js/sha256';
import {sha256} from 'js-sha256';
import "./App.css";
import 'semantic-ui-css/semantic.min.css';
import {RepositorySegment} from "../components/Repository";
import AccountSegment from "../components/Account";
import {RepositoryMenu} from "../components/RepositoryMenu";
import {DeveloperSegment} from "../components/DeveloperSegment";


class App extends Component {
    state = {web3: null, accounts: null, contract: null, activeItem: 'repositiory', activeAccordion: -1};

    // handles the switch between tabs
    handleItemClick = async (e, {name}) => {
        this.setState({activeItem: name});
        let vnf_packages = await this.retrieve_repository(this.state.contract);
        this.setState({repository: vnf_packages});
    }

    // open and close functions in the accordion menu in the developer tab
    handleAccordionClick = (e, {index}) => this.setState({activeAccordion: index === this.state.activeAccordion ? -1 : index});

    // receives the information from the developer tabs functions
    handleSubmit = (e, {name}) => {
        console.log("submitted");
        let fields = e.target.children[0];

        switch (name) {
            case "new":
                let vnf = {
                    name: fields.children[0].children[1].children[0].value,
                    description: fields.children[1].children[1].children[0].value,
                    image_link: fields.children[2].children[1].children[0].value,
                    service_type: fields.children[3].children[1].children[0].value,
                    repository_link: fields.children[4].children[1].children[0].value,
                    price: fields.children[5].children[1].value,
                    version: fields.children[6].children[1].children[0].value,
                    requirements: fields.children[7].children[1].children[0].value,
                    resources: fields.children[8].children[1].children[0].value,
                };
                this.deployToRepo(vnf);

                break;

            case "update":
                let update_index = this.state.index_chosen;
                let vnf_update = {
                    name: fields.children[1].children[1].children[0].value,
                    description: fields.children[2].children[1].children[0].value,
                    image_link: fields.children[3].children[1].children[0].value,
                    service_type: fields.children[4].children[1].children[0].value,
                    repository_link: fields.children[5].children[1].children[0].value,
                    price: fields.children[6].children[1].value,
                    version: fields.children[7].children[1].children[0].value,
                    requirements: fields.children[8].children[1].children[0].value,
                    resources: fields.children[9].children[1].children[0].value,
                };

                this.updateRepo(update_index, vnf_update);
                break;

            case "delete":
                let delete_index = this.state.index_chosen;
                this.deleteInRepo(delete_index);
                break;

            default:
                break;
        }
    };

    // used by Register new VNF function
    deployToRepo = async (vnf) => {
        const {accounts, contract} = this.state;

        axios({
            url: `https://cors.io?${vnf.repository_link}`,
            crossDomain: 'true',
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            var a = new FileReader();
            debugger;
            a.readAsBinaryString(response.data);
            a.onloadend = function () {
                vnf["repository_hash"] = sha256(a.result);
                sendToRepo(vnf);
            };
        });

        // Ether to WEI
        vnf.price = (vnf.price * 1000000000000000000).toString();

        async function sendToRepo(vnf) {
            if (vnf) {
                await contract.methods.register_VNF(
                    vnf.name,
                    vnf.description,
                    vnf.image_link,
                    vnf.service_type,
                    vnf.repository_link,
                    vnf.price,
                    vnf.version,
                    vnf.requirements,
                    vnf.resources,
                    `0x${vnf.repository_hash}`).send({from: accounts[0]});
            }

        }

        await sendToRepo();
    };

    // used by Update VNF function
    updateRepo = async (index, vnf) => {
        const {accounts, contract} = this.state;

        axios({
            url: `https://cors.io?${vnf.repository_link}`,
            crossDomain: 'true',
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            var a = new FileReader();
            a.readAsBinaryString(response.data);
            a.onloadend = function () {
                vnf["repository_hash"] = sha256(a.result);
                sendUpdateToRepo(vnf);
            };
        });

        // Ether to WEI
        vnf.price = (vnf.price * 1000000000000000000).toString();

        async function sendUpdateToRepo(vnf) {
            if (vnf) {
                await contract.methods.update_VNF(
                    index,
                    vnf.name,
                    vnf.description,
                    vnf.image_link,
                    vnf.service_type,
                    vnf.repository_link,
                    vnf.price,
                    vnf.version,
                    vnf.requirements,
                    vnf.resources,
                    `0x${vnf.repository_hash}`).send({from: accounts[0]});
            }

        }

        await sendUpdateToRepo();

    };

    // used by the Delete VNF function
    deleteInRepo = async (index) => {
        const {accounts, contract} = this.state;

        await contract.methods.delete_VNF(
            index
        ).send({from: accounts[0]});
    };

    // is called once the application is loaded. Is responsible for setting up the web3 envirnoment and retrieves the
    // VNF repository constantly (when changes are detected)
    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VNFRepo.networks[networkId];
            const instance = new web3.eth.Contract(
                VNFRepo.abi,
                deployedNetwork && deployedNetwork.address,
            );

            var vnf_packages = await this.retrieve_repository(instance);

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({web3, accounts, contract: instance, repository: vnf_packages});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    // is used to retrieve the VNF packages
    async retrieve_repository(instance) {
        var index = await instance.methods.retrieve_numberOf_vnf().call();

        var vnf_packages = [];
        for (var i = 0; i < index.count; i++) {
            vnf_packages[i] = await instance.methods.retrieve_vnf(i).call();
            vnf_packages[i].index = i;
            vnf_packages[i].license = await instance.methods.has_VNF_license(i).call();
        }
        return vnf_packages;
    }

    // the Render Function is the core of the application, here, the components get rendered into the application
    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract... Please reload.</div>;
        }
        return (
            <div className="App">
                <Container fluid>
                    <Header as='h1'>VNF Repository</Header>

                    <RepositoryMenu activeItem={this.state.activeItem} onClick={this.handleItemClick}/>

                    {this.state.activeItem === 'repositiory' &&
                    <RepositorySegment
                        repository={this.state.repository}
                        contract={this.state.contract}
                        accounts={this.state.accounts}/>

                    }

                    {this.state.activeItem === 'dev' &&
                    <DeveloperSegment activeAccordion={this.state.activeAccordion} onClick={this.handleAccordionClick}
                                      onSubmit={this.handleSubmit} repository={this.state.repository} account={this.state.accounts[0]}
                                      onIndexChosen={(e, data) => this.setState({index_chosen: data.value})}/>

                    }

                    {this.state.activeItem === 'account' &&
                    <AccountSegment
                        repository={this.state.repository}
                        contract={this.state.contract}
                        accounts={this.state.accounts}/>

                    }
                </Container>
            </div>
        );
    }
}

export default App;

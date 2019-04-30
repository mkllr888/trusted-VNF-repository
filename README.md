# Blockchain-based Trusted VNF Package Repository

## Abstract
Network operators are under much pressure to improve their services:  On the one side,they  need  to  push  prices  down  for  customers,  on  the  other  side  they  need  to  invest  innew technologies and need to provide their services with great stability.  For this reason,operators are turning to Network Function Virtualization (NFV).

First, the current works of using blockchain technology to enhance the security of NFVenvironments are provided.  So far, there have been efforts to create blockchain-securedNFV Management and Orchestration systems as well as setting up trusted computing en-vironments.  These projects omit the repository of Virtualized Network Functions (VNF). However, the blockchain’s properties could enhance the security in this area by allowingto verify a package’s integrity without relying on a trusted third-party for remote attesta-tion or a secure database.  Thus, a design of a Trusted VNF repository using blockchainis proposed.  The repository back end is based on a Smart Contract which is accessed by the four systems of the front end.

The  proposed  design  was  then  implemented  in  the  Ethereum  network  as  a  Proof-of-Concept.  The Smart Contract was written in Solidity, the front end relies on the truffleframework.  The implementation relies on an external NFV environment to deploy, man-age and run the network functions.

The resulting implementation succeeds in enhancing the security of the VNF repositorywithout relying on external parties.  The system is without access control and thus repre-sents an open market for VNFs that anybody can access.  The transaction costs associatedwith the contract are reasonable and within useful boundaries.  However,  the open de-sign requires well-designed incentives.  Otherwise, Malicious participants could abuse thesystem for financial benefit.

This work shows that a blockchain-based Trusted Repository for VNF packages is feasibleand offers advantages over traditional techniques.  Even though there are still challengesconnected to it, it resolves a weak point in existing NFV systems and shows promise tobe integrated in already blockchain-based NFV systems.

## Requirements
- yarn & npm
- truffle
- Ganache application
- MetaMask browser extension

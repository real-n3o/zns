<pre>
 ______  ___   __    ______ 
/_____/\/__/\ /__/\ /_____/\
\:::__\/\::\_\\  \ \\::::_\/_
   /: /  \:. `-\  \ \\:\/___/\
  /::/___ \:. _    \ \\_::._\:\
 /_:/____/\\. \`-\  \ \ /____\:\
 \_______\/ \__\/ \__\/ \_____\/   

</pre>

# ZNS

Zer0 Name Service (ZNS) is the underlying set of Ethereum-based smart contracts responsible for 'Global Addressing' within Zero. Similar to DNS, Global Addressing enables users and communities to establish global identities and namespaces that map to addresses in peer-to-peer systems like Zero, or any part of the Internet. A global naming system is a necessary component for distributed systems, where system state resides across multiple parallel systems, and is not represented within a single centralized server or decentralized blockchain. Our goal is that modern browsers and projects across the web3 ecosystem adopt the ZNS protocol to create a more customizable, flexible, and decentralized alternative to modern DNS.

Addresses can be set to map to any type of arbitrary content source. Primary examples of Addresses include:

- **Networks** map to shared namespaces, such as a community, organization or DAO. 
- **Handles** map to individal user accounts, which can represent either humans or bots.
- **Resources** map to any type of resource, such as a binary file, url, or text blob. 
 
## Addressing

There are multiple namespaces in a typical address path:

- ```0://``` -> is used to signify a Zero Address
- ```0://rootaddr``` -> The first value in the address path is a pointer to the ref of the domain set by the domain's Registry Contract.
- ```0://rootaddr:subdomain``` -> The second value is a pointer to the sub-domain set by the Registries corresponding Registry entry. 
- ```0://rootaddr:subdomain:content``` -> The third value is a pointer to content within the Registry entry at that location. 

## How It Works

The following is a simple overview of how the ZNS protocol works: 

- Root domains in ZNS are defined by creating Registries. 

## Security

ZNS is still in alpha phase. We have done the best to create secure and tested code, however have no yet performed any external security audits. Please understand that we are not responsible for domain purchases or any implementations of the protocol. Please use common sense and proceed with caution. 

## Getting Started

### Requirements 

- Node.js is required
- [Truffle](https://github.com/ConsenSys/truffle) is required
- A blockchain explorer is required ([Ganache](https://www.trufflesuite.com/ganache) is recommended)

### Installing 

From the ZNS directory:

1. ```npm install```
2. Install and initialize truffle
   <code>
   npm install -g truffle
   mkdir ZNS && cd ZNs
   truffle
   </code>
3. Install the ZNS contracts package with: ```npm install zns```
4. Download, install and start Ganache with ```ganache-client```
5. Deploy the ZNS contracts with ```truffle deploy```

### Testing

```truffle test```

## License

Governed by the InnerSource License.
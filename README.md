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

Zer0 Name Service (ZNS) is the underlying set of Ethereum-based smart contracts responsible for 'Global Addressing' within Zero. Similar to DNS, Global Addressing enables users and communities to establish and own global identities and namespaces within Zero. 

Addresses can be set to map to any type of arbitrary content source, such as:

- **Networks** that map to shared namespaces, such as a community, organization or DAO. 
- **Handles** that map to individual user accounts, which can represent either humans or bots.
- **Resources** that map to any type of computational resource, such as a binary file, url, hash, or text blob. 

# Why ZNS?

A global naming system is a necessary component for distributed systems like Zero, where system state resides across multiple parallel systems and is not stored in a single central server or decentralized blockchain. Our goal is that modern browsers and projects across the web3 ecosystem will adopt the ZNS protocol to create a more customizable, flexible, and decentralized alternative to modern DNS.
 
## Addressing

There are multiple namespaces in a typical Zero Address path:

- ```0://``` -> is used to signify a Zero Address path.
- ```0://rootaddr``` -> The first value in the address is a ***domain*** that references a unique Registry.
- ```0://rootaddr:subdomain``` -> The second value in the address is a **subdomain** that references an Entry within the Registry (a Registry Entry).
- ```0://rootaddr:subdomain:content``` -> The third value in the address represents a ***path*** defined by the Registry Entry.

## How It Works

The following is a simple overview of how the ZNS protocol works: 

- Root domains in ZNS are defined by creating Registries. 

## Security

ZNS is still in alpha phase. We have done the best to create secure and tested code, however have not yet performed any external security audits. Please understand that we are not responsible for domain purchases or the result for any implementations of this protocol. Please use common sense and proceed with caution. 

## Getting Started

### Requirements 

- Node.js is required
- [Truffle](https://github.com/ConsenSys/truffle) is required
- A blockchain explorer is required ([Ganache](https://www.trufflesuite.com/ganache) is recommended)

### Installing 

From the ZNS directory:

1. ```npm install```
2. Install and initialize truffle
   ```sh
   npm install -g truffle
   mkdir ZNS && cd ZNs
   truffle
   ```
3. Install the ZNS contracts package with: ```npm install zns```
4. Download, install and start Ganache with ```ganache-client```
5. Deploy the ZNS contracts with ```truffle deploy

### Testing

```truffle test```

## License

Governed by the InnerSource License.
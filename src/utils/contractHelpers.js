export const loadContract = async (web3, artifact) => {
    try {
        const networkIdRaw = await web3.eth.getChainId();
        const networkId = networkIdRaw.toString();
        let networkData = artifact.networks[networkId];

        if (!networkData) {
            if (networkId === "1337") {
                console.warn(`Contract ${artifact.contractName || 'Unknown'} not found on 1337, trying fallback to 5777`);
                networkData = artifact.networks["5777"];
            } else if (networkId === "5777") {
                console.warn(`Contract ${artifact.contractName || 'Unknown'} not found on 5777, trying fallback to 1337`);
                networkData = artifact.networks["1337"];
            }
        }

        if (networkData) {
            return new web3.eth.Contract(artifact.abi, networkData.address);
        } else {
            console.error(`Contract ${artifact.contractName || 'Unknown'} not deployed on network ${networkId}`);
            console.log("Available networks:", Object.keys(artifact.networks));
            return null;
        }
    } catch (error) {
        console.error("Error loading contract:", error);
        return null;
    }
};

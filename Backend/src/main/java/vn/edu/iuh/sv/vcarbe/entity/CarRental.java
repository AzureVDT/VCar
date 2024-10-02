package vn.edu.iuh.sv.vcarbe.entity;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple9;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the
 * <a href="https://github.com/hyperledger/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.6.1.
 */
@SuppressWarnings("rawtypes")
public class CarRental extends Contract {
    public static final String BINARY = "6080604052348015600e575f80fd5b506118cc8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610055575f3560e01c80630e100a551461005957806364ecdf4f14610075578063c9caabbb146100a5578063d7a1f55e146100c1578063eb3a78dc146100f9575b5f80fd5b610073600480360381019061006e9190610d0f565b610129565b005b61008f600480360381019061008a9190610e38565b61025b565b60405161009c91906110aa565b60405180910390f35b6100bf60048036038101906100ba91906110f4565b610643565b005b6100db60048036038101906100d69190610d0f565b610838565b6040516100f099989796959493929190611297565b60405180910390f35b610113600480360381019061010e9190610d0f565b610b43565b6040516101209190611345565b60405180910390f35b5f80826040516101399190611398565b908152602001604051809103902090506001826040516101599190611398565b90815260200160405180910390205f9054906101000a900460ff166101b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101aa906113f8565b60405180910390fd5b806008015f9054906101000a900460ff1615610204576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101fb90611486565b60405180910390fd5b6001816008015f6101000a81548160ff0219169083151502179055507f634d7f4f45c83b39d090248f95833430f729a217e1ba31c5819518c1b4c51dae8260405161024f91906114a4565b60405180910390a15050565b60605f825190505f8167ffffffffffffffff81111561027d5761027c610beb565b5b6040519080825280602002602001820160405280156102b657816020015b6102a3610b78565b81526020019060019003908161029b5790505b5090505f5b82811015610638575f8582815181106102d7576102d66114c4565b5b60200260200101516040516102ec9190611398565b9081526020016040518091039020604051806101200160405290815f820180546103159061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546103419061151e565b801561038c5780601f106103635761010080835404028352916020019161038c565b820191905f5260205f20905b81548152906001019060200180831161036f57829003601f168201915b505050505081526020016001820180546103a59061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546103d19061151e565b801561041c5780601f106103f35761010080835404028352916020019161041c565b820191905f5260205f20905b8154815290600101906020018083116103ff57829003601f168201915b505050505081526020016002820180546104359061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546104619061151e565b80156104ac5780601f10610483576101008083540402835291602001916104ac565b820191905f5260205f20905b81548152906001019060200180831161048f57829003601f168201915b505050505081526020016003820180546104c59061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546104f19061151e565b801561053c5780601f106105135761010080835404028352916020019161053c565b820191905f5260205f20905b81548152906001019060200180831161051f57829003601f168201915b505050505081526020016004820180546105559061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546105819061151e565b80156105cc5780601f106105a3576101008083540402835291602001916105cc565b820191905f5260205f20905b8154815290600101906020018083116105af57829003601f168201915b50505050508152602001600582015481526020016006820154815260200160078201548152602001600882015f9054906101000a900460ff1615151515815250508282815181106106205761061f6114c4565b5b602002602001018190525080806001019150506102bb565b508092505050919050565b6001886040516106539190611398565b90815260200160405180910390205f9054906101000a900460ff16156106ae576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106a590611598565b60405180910390fd5b6040518061012001604052808981526020018881526020018781526020018681526020018581526020018481526020018381526020018281526020015f15158152505f896040516106ff9190611398565b90815260200160405180910390205f820151815f0190816107209190611753565b5060208201518160010190816107369190611753565b50604082015181600201908161074c9190611753565b5060608201518160030190816107629190611753565b5060808201518160040190816107789190611753565b5060a0820151816005015560c0820151816006015560e08201518160070155610100820151816008015f6101000a81548160ff021916908315150217905550905050600180896040516107cb9190611398565b90815260200160405180910390205f6101000a81548160ff0219169083151502179055507fadb338eb1f62123c65c8d052a5c8cdcd6303a82e02e02fdd7e4e8cacbd08b5718888888888604051610826959493929190611822565b60405180910390a15050505050505050565b5f818051602081018201805184825260208301602085012081835280955050505050505f91509050805f01805461086e9061151e565b80601f016020809104026020016040519081016040528092919081815260200182805461089a9061151e565b80156108e55780601f106108bc576101008083540402835291602001916108e5565b820191905f5260205f20905b8154815290600101906020018083116108c857829003601f168201915b5050505050908060010180546108fa9061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546109269061151e565b80156109715780601f1061094857610100808354040283529160200191610971565b820191905f5260205f20905b81548152906001019060200180831161095457829003601f168201915b5050505050908060020180546109869061151e565b80601f01602080910402602001604051908101604052809291908181526020018280546109b29061151e565b80156109fd5780601f106109d4576101008083540402835291602001916109fd565b820191905f5260205f20905b8154815290600101906020018083116109e057829003601f168201915b505050505090806003018054610a129061151e565b80601f0160208091040260200160405190810160405280929190818152602001828054610a3e9061151e565b8015610a895780601f10610a6057610100808354040283529160200191610a89565b820191905f5260205f20905b815481529060010190602001808311610a6c57829003601f168201915b505050505090806004018054610a9e9061151e565b80601f0160208091040260200160405190810160405280929190818152602001828054610aca9061151e565b8015610b155780601f10610aec57610100808354040283529160200191610b15565b820191905f5260205f20905b815481529060010190602001808311610af857829003601f168201915b505050505090806005015490806006015490806007015490806008015f9054906101000a900460ff16905089565b6001818051602081018201805184825260208301602085012081835280955050505050505f915054906101000a900460ff1681565b60405180610120016040528060608152602001606081526020016060815260200160608152602001606081526020015f81526020015f81526020015f81526020015f151581525090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610c2182610bdb565b810181811067ffffffffffffffff82111715610c4057610c3f610beb565b5b80604052505050565b5f610c52610bc2565b9050610c5e8282610c18565b919050565b5f67ffffffffffffffff821115610c7d57610c7c610beb565b5b610c8682610bdb565b9050602081019050919050565b828183375f83830152505050565b5f610cb3610cae84610c63565b610c49565b905082815260208101848484011115610ccf57610cce610bd7565b5b610cda848285610c93565b509392505050565b5f82601f830112610cf657610cf5610bd3565b5b8135610d06848260208601610ca1565b91505092915050565b5f60208284031215610d2457610d23610bcb565b5b5f82013567ffffffffffffffff811115610d4157610d40610bcf565b5b610d4d84828501610ce2565b91505092915050565b5f67ffffffffffffffff821115610d7057610d6f610beb565b5b602082029050602081019050919050565b5f80fd5b5f610d97610d9284610d56565b610c49565b90508083825260208201905060208402830185811115610dba57610db9610d81565b5b835b81811015610e0157803567ffffffffffffffff811115610ddf57610dde610bd3565b5b808601610dec8982610ce2565b85526020850194505050602081019050610dbc565b5050509392505050565b5f82601f830112610e1f57610e1e610bd3565b5b8135610e2f848260208601610d85565b91505092915050565b5f60208284031215610e4d57610e4c610bcb565b5b5f82013567ffffffffffffffff811115610e6a57610e69610bcf565b5b610e7684828501610e0b565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f610eda82610ea8565b610ee48185610eb2565b9350610ef4818560208601610ec2565b610efd81610bdb565b840191505092915050565b5f819050919050565b610f1a81610f08565b82525050565b5f8115159050919050565b610f3481610f20565b82525050565b5f61012083015f8301518482035f860152610f558282610ed0565b91505060208301518482036020860152610f6f8282610ed0565b91505060408301518482036040860152610f898282610ed0565b91505060608301518482036060860152610fa38282610ed0565b91505060808301518482036080860152610fbd8282610ed0565b91505060a0830151610fd260a0860182610f11565b5060c0830151610fe560c0860182610f11565b5060e0830151610ff860e0860182610f11565b5061010083015161100d610100860182610f2b565b508091505092915050565b5f6110238383610f3a565b905092915050565b5f602082019050919050565b5f61104182610e7f565b61104b8185610e89565b93508360208202850161105d85610e99565b805f5b8581101561109857848403895281516110798582611018565b94506110848361102b565b925060208a01995050600181019050611060565b50829750879550505050505092915050565b5f6020820190508181035f8301526110c28184611037565b905092915050565b6110d381610f08565b81146110dd575f80fd5b50565b5f813590506110ee816110ca565b92915050565b5f805f805f805f80610100898b03121561111157611110610bcb565b5b5f89013567ffffffffffffffff81111561112e5761112d610bcf565b5b61113a8b828c01610ce2565b985050602089013567ffffffffffffffff81111561115b5761115a610bcf565b5b6111678b828c01610ce2565b975050604089013567ffffffffffffffff81111561118857611187610bcf565b5b6111948b828c01610ce2565b965050606089013567ffffffffffffffff8111156111b5576111b4610bcf565b5b6111c18b828c01610ce2565b955050608089013567ffffffffffffffff8111156111e2576111e1610bcf565b5b6111ee8b828c01610ce2565b94505060a06111ff8b828c016110e0565b93505060c06112108b828c016110e0565b92505060e06112218b828c016110e0565b9150509295985092959890939650565b5f82825260208201905092915050565b5f61124b82610ea8565b6112558185611231565b9350611265818560208601610ec2565b61126e81610bdb565b840191505092915050565b61128281610f08565b82525050565b61129181610f20565b82525050565b5f610120820190508181035f8301526112b0818c611241565b905081810360208301526112c4818b611241565b905081810360408301526112d8818a611241565b905081810360608301526112ec8189611241565b905081810360808301526113008188611241565b905061130f60a0830187611279565b61131c60c0830186611279565b61132960e0830185611279565b611337610100830184611288565b9a9950505050505050505050565b5f6020820190506113585f830184611288565b92915050565b5f81905092915050565b5f61137282610ea8565b61137c818561135e565b935061138c818560208601610ec2565b80840191505092915050565b5f6113a38284611368565b915081905092915050565b7f436f6e747261637420646f6573206e6f742065786973740000000000000000005f82015250565b5f6113e2601783611231565b91506113ed826113ae565b602082019050919050565b5f6020820190508181035f83015261140f816113d6565b9050919050565b7f436f6e747261637420616c726561647920617070726f766564206279206c65735f8201527f7365650000000000000000000000000000000000000000000000000000000000602082015250565b5f611470602383611231565b915061147b82611416565b604082019050919050565b5f6020820190508181035f83015261149d81611464565b9050919050565b5f6020820190508181035f8301526114bc8184611241565b905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061153557607f821691505b602082108103611548576115476114f1565b5b50919050565b7f436f6e747261637420616c7265616479206578697374730000000000000000005f82015250565b5f611582601783611231565b915061158d8261154e565b602082019050919050565b5f6020820190508181035f8301526115af81611576565b9050919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026116127fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826115d7565b61161c86836115d7565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61165761165261164d84610f08565b611634565b610f08565b9050919050565b5f819050919050565b6116708361163d565b61168461167c8261165e565b8484546115e3565b825550505050565b5f90565b61169861168c565b6116a3818484611667565b505050565b5b818110156116c6576116bb5f82611690565b6001810190506116a9565b5050565b601f82111561170b576116dc816115b6565b6116e5846115c8565b810160208510156116f4578190505b611708611700856115c8565b8301826116a8565b50505b505050565b5f82821c905092915050565b5f61172b5f1984600802611710565b1980831691505092915050565b5f611743838361171c565b9150826002028217905092915050565b61175c82610ea8565b67ffffffffffffffff81111561177557611774610beb565b5b61177f825461151e565b61178a8282856116ca565b5f60209050601f8311600181146117bb575f84156117a9578287015190505b6117b38582611738565b86555061181a565b601f1984166117c9866115b6565b5f5b828110156117f0578489015182556001820191506020850194506020810190506117cb565b8683101561180d5784890151611809601f89168261171c565b8355505b6001600288020188555050505b505050505050565b5f60a0820190508181035f83015261183a8188611241565b9050818103602083015261184e8187611241565b905081810360408301526118628186611241565b905081810360608301526118768185611241565b9050818103608083015261188a8184611241565b9050969550505050505056fea264697066735822122086fa60d7b824185e0f305b2540445d9cad23e1355b40c9d0c5aaa29a47ee274d64736f6c634300081a0033";

    private static String librariesLinkedBinary;

    public static final String FUNC_APPROVECONTRACT = "approveContract";

    public static final String FUNC_CREATECONTRACT = "createContract";

    public static final String FUNC_CONTRACTSTATUS = "contractStatus";

    public static final String FUNC_GETCONTRACTSBYIDS = "getContractsByIds";

    public static final String FUNC_RENTALCONTRACTS = "rentalContracts";

    public static final Event CONTRACTCREATED_EVENT = new Event("ContractCreated",
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}));
    ;

    public static final Event LESSEEAPPROVED_EVENT = new Event("LesseeApproved",
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
    ;

    @Deprecated
    protected CarRental(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected CarRental(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected CarRental(String contractAddress, Web3j web3j, TransactionManager transactionManager,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected CarRental(String contractAddress, Web3j web3j, TransactionManager transactionManager,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<TransactionReceipt> approveContract(String _contractId) {
        final Function function = new Function(
                FUNC_APPROVECONTRACT,
                Arrays.<Type>asList(new Utf8String(_contractId)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public static List<ContractCreatedEventResponse> getContractCreatedEvents(TransactionReceipt transactionReceipt) {
        List<ContractCreatedEventResponse> responses = new ArrayList<>();

        for (Log log : transactionReceipt.getLogs()) {
            EventValuesWithLog eventValues = staticExtractEventParametersWithLog(CONTRACTCREATED_EVENT, log);
            if (eventValues != null) {
                vn.edu.iuh.sv.vcarbe.entity.CarRental.ContractCreatedEventResponse typedResponse = new vn.edu.iuh.sv.vcarbe.entity.CarRental.ContractCreatedEventResponse();
                typedResponse.log = eventValues.getLog();
                typedResponse.contractId = (String) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.requestId = (String) eventValues.getNonIndexedValues().get(1).getValue();
                typedResponse.carId = (String) eventValues.getNonIndexedValues().get(2).getValue();
                typedResponse.lessorId = (String) eventValues.getNonIndexedValues().get(3).getValue();
                typedResponse.lesseeId = (String) eventValues.getNonIndexedValues().get(4).getValue();
                responses.add(typedResponse);
            }
        }

        return responses;
    }

    public static ContractCreatedEventResponse getContractCreatedEventFromLog(Log log) {
        EventValuesWithLog eventValues = staticExtractEventParametersWithLog(CONTRACTCREATED_EVENT, log);
        ContractCreatedEventResponse typedResponse = new ContractCreatedEventResponse();
        typedResponse.log = log;
        typedResponse.contractId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.requestId = (String) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.carId = (String) eventValues.getNonIndexedValues().get(2).getValue();
        typedResponse.lessorId = (String) eventValues.getNonIndexedValues().get(3).getValue();
        typedResponse.lesseeId = (String) eventValues.getNonIndexedValues().get(4).getValue();
        return typedResponse;
    }

    public Flowable<ContractCreatedEventResponse> contractCreatedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getContractCreatedEventFromLog(log));
    }

    public Flowable<ContractCreatedEventResponse> contractCreatedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CONTRACTCREATED_EVENT));
        return contractCreatedEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> createContract(String _contractId,
            String _requestId, String _carId, String _lessorId, String _lesseeId,
            BigInteger _rentalStartTime, BigInteger _rentalEndTime, BigInteger _depositAmount) {
        final Function function = new Function(
                FUNC_CREATECONTRACT,
                Arrays.<Type>asList(new Utf8String(_contractId),
                new Utf8String(_requestId),
                new Utf8String(_carId),
                new Utf8String(_lessorId),
                new Utf8String(_lesseeId),
                new Uint256(_rentalStartTime),
                new Uint256(_rentalEndTime),
                new Uint256(_depositAmount)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public static List<LesseeApprovedEventResponse> getLesseeApprovedEvents(TransactionReceipt transactionReceipt) {
        List<LesseeApprovedEventResponse> responses = new ArrayList<>();
        List<Log> logs = transactionReceipt.getLogs();

        for (Log log : logs) {
            EventValuesWithLog eventValues = staticExtractEventParametersWithLog(LESSEEAPPROVED_EVENT, log);
            if (eventValues != null) {
                LesseeApprovedEventResponse typedResponse = new LesseeApprovedEventResponse();
                typedResponse.log = eventValues.getLog();
                typedResponse.contractId = (String) eventValues.getNonIndexedValues().get(0).getValue();
                responses.add(typedResponse);
            }
        }

        return responses;
    }

    public static LesseeApprovedEventResponse getLesseeApprovedEventFromLog(Log log) {
        EventValuesWithLog eventValues = staticExtractEventParametersWithLog(LESSEEAPPROVED_EVENT, log);
        LesseeApprovedEventResponse typedResponse = new LesseeApprovedEventResponse();
        typedResponse.log = log;
        typedResponse.contractId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<LesseeApprovedEventResponse> lesseeApprovedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getLesseeApprovedEventFromLog(log));
    }

    public Flowable<LesseeApprovedEventResponse> lesseeApprovedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(LESSEEAPPROVED_EVENT));
        return lesseeApprovedEventFlowable(filter);
    }

    public RemoteFunctionCall<Boolean> contractStatus(String param0) {
        final Function function = new Function(FUNC_CONTRACTSTATUS,
                Arrays.<Type>asList(new Utf8String(param0)),
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<List> getContractsByIds(List<String> _contractIds) {
        final Function function = new Function(FUNC_GETCONTRACTSBYIDS,
                Arrays.<Type>asList(new DynamicArray<Utf8String>(
                        Utf8String.class,
                        org.web3j.abi.Utils.typeMap(_contractIds, Utf8String.class))),
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<RentalContract>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>> rentalContracts(
            String param0) {
        final Function function = new Function(FUNC_RENTALCONTRACTS,
                Arrays.<Type>asList(new Utf8String(param0)),
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Bool>() {}));
        return new RemoteFunctionCall<Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>>(function,
                new Callable<Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>>() {
                    @Override
                    public Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> call(
                            ) throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>(
                                (String) results.get(0).getValue(),
                                (String) results.get(1).getValue(),
                                (String) results.get(2).getValue(),
                                (String) results.get(3).getValue(),
                                (String) results.get(4).getValue(),
                                (BigInteger) results.get(5).getValue(),
                                (BigInteger) results.get(6).getValue(),
                                (BigInteger) results.get(7).getValue(),
                                (Boolean) results.get(8).getValue());
                    }
                });
    }

    @Deprecated
    public static CarRental load(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return new CarRental(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static CarRental load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new CarRental(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static CarRental load(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return new CarRental(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static CarRental load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new CarRental(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<CarRental> deploy(Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CarRental.class, web3j, credentials, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<CarRental> deploy(Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CarRental.class, web3j, credentials, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

    public static RemoteCall<CarRental> deploy(Web3j web3j, TransactionManager transactionManager,
            ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CarRental.class, web3j, transactionManager, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<CarRental> deploy(Web3j web3j, TransactionManager transactionManager,
            BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CarRental.class, web3j, transactionManager, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

//    public static void linkLibraries(List<Contract.LinkReference> references) {
//        librariesLinkedBinary = linkBinaryWithReferences(BINARY, references);
//    }

    private static String getDeploymentBinary() {
        if (librariesLinkedBinary != null) {
            return librariesLinkedBinary;
        } else {
            return BINARY;
        }
    }

    public static class RentalContract extends DynamicStruct {
        public String contractId;

        public String requestId;

        public String carId;

        public String lessorId;

        public String lesseeId;

        public BigInteger rentalStartTime;

        public BigInteger rentalEndTime;

        public BigInteger depositAmount;

        public Boolean lesseeApproved;

        public RentalContract(String contractId, String requestId, String carId, String lessorId,
                String lesseeId, BigInteger rentalStartTime, BigInteger rentalEndTime,
                BigInteger depositAmount, Boolean lesseeApproved) {
            super(new Utf8String(contractId),
                    new Utf8String(requestId),
                    new Utf8String(carId),
                    new Utf8String(lessorId),
                    new Utf8String(lesseeId),
                    new Uint256(rentalStartTime),
                    new Uint256(rentalEndTime),
                    new Uint256(depositAmount),
                    new Bool(lesseeApproved));
            this.contractId = contractId;
            this.requestId = requestId;
            this.carId = carId;
            this.lessorId = lessorId;
            this.lesseeId = lesseeId;
            this.rentalStartTime = rentalStartTime;
            this.rentalEndTime = rentalEndTime;
            this.depositAmount = depositAmount;
            this.lesseeApproved = lesseeApproved;
        }

        public RentalContract(Utf8String contractId, Utf8String requestId, Utf8String carId,
                Utf8String lessorId, Utf8String lesseeId, Uint256 rentalStartTime,
                Uint256 rentalEndTime, Uint256 depositAmount, Bool lesseeApproved) {
            super(contractId, requestId, carId, lessorId, lesseeId, rentalStartTime, rentalEndTime, depositAmount, lesseeApproved);
            this.contractId = contractId.getValue();
            this.requestId = requestId.getValue();
            this.carId = carId.getValue();
            this.lessorId = lessorId.getValue();
            this.lesseeId = lesseeId.getValue();
            this.rentalStartTime = rentalStartTime.getValue();
            this.rentalEndTime = rentalEndTime.getValue();
            this.depositAmount = depositAmount.getValue();
            this.lesseeApproved = lesseeApproved.getValue();
        }
    }

    public static class ContractCreatedEventResponse extends BaseEventResponse {
        public String contractId;

        public String requestId;

        public String carId;

        public String lessorId;

        public String lesseeId;
    }

    public static class LesseeApprovedEventResponse extends BaseEventResponse {
        public String contractId;
    }
}

package vn.edu.iuh.sv.vcarbe.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.StaticGasProvider;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import vn.edu.iuh.sv.vcarbe.entity.CarRental;
import org.web3j.tuples.generated.Tuple9;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.exception.AppException;

import java.math.BigInteger;
import java.util.List;

@Component
public class BlockchainUtils {
    @Value("${blockchain.contractAddress}")
    private String contractAddress;
    @Value("${blockchain.infuraUrl}")
    private String infuraUrl;
    @Value("${blockchain.privateKey}")
    private String privateKey;

    public CarRental loadCarRentalContract() {
        return CarRental.load(
                contractAddress,
                Web3j.build(new HttpService(infuraUrl)),
                Credentials.create(privateKey),
                new StaticGasProvider(BigInteger.valueOf(20000000000L), BigInteger.valueOf(6721975L))
        );
    }

    public Mono<TransactionReceipt> createRentalContract(RentalContract rentalContract) {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<TransactionReceipt> transactionReceipt = carRentalContract.createContract(
                rentalContract.getId().toHexString(),
                rentalContract.getRentalRequestId().toHexString(),
                rentalContract.getCarId().toHexString(),
                rentalContract.getLessorId().toHexString(),
                rentalContract.getLesseeId().toHexString(),
                BigInteger.valueOf(rentalContract.getRentalStartDate().getTime()),
                BigInteger.valueOf(rentalContract.getRentalEndDate().getTime()),
                BigInteger.valueOf((long) rentalContract.getTotalRentalValue())
        );

        return Mono.fromCallable(() -> {
            try {
                return executeTransaction(transactionReceipt);
            } catch (Exception e) {
                throw new AppException(500, e.getMessage());
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }


    public void approveRentalContract(String contractId) {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<TransactionReceipt> transactionCall = carRentalContract.approveContract(contractId);
        executeTransaction(transactionCall);
    }


    public List getContractsByIds(List<String> contractIds) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<List> contractCall = carRentalContract.getContractsByIds(contractIds);
        return contractCall.send();
    }

    public Boolean isContractApproved(String contractId) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<Boolean> statusCall = carRentalContract.contractStatus(contractId);
        return statusCall.send();
    }

    public Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> getRentalContractDetails(String contractId) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>> contractCall = carRentalContract.rentalContracts(contractId);
        return contractCall.send();
    }

    public TransactionReceipt executeTransaction(RemoteFunctionCall<TransactionReceipt> transactionCall) {
        TransactionReceipt receipt = null;
        try {
            receipt = transactionCall.send();
        } catch (Exception e) {
            throw new AppException(500, e.getMessage());
        }
        if (!receipt.isStatusOK()) {
            throw new AppException(500, "Transaction failed with status " + receipt.getStatus());
        }
        return receipt;
    }
}

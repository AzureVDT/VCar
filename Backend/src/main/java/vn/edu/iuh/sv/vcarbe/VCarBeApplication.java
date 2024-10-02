package vn.edu.iuh.sv.vcarbe;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VCarBeApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().ignoreIfMalformed().load();

        System.setProperty("INFURA_URL", dotenv.get("INFURA_URL"));
        System.setProperty("PRIVATE_KEY", dotenv.get("PRIVATE_KEY"));
        System.setProperty("CONTRACT_ADDRESS", dotenv.get("CONTRACT_ADDRESS"));
        System.setProperty("VNP_SECRET_KEY", dotenv.get("VNP_SECRET_KEY"));
        System.setProperty("VNP_VERSION", dotenv.get("VNP_VERSION"));
        System.setProperty("VNP_TMN", dotenv.get("VNP_TMN"));
        System.setProperty("VNP_URL", dotenv.get("VNP_URL"));
        System.setProperty("VNP_RETURN_URL", dotenv.get("VNP_RETURN_URL"));
        System.setProperty("VNP_API_URL", dotenv.get("VNP_API_URL"));
        System.setProperty("VNP_COMMAND", dotenv.get("VNP_COMMAND"));
        System.setProperty("REDIS_HOST", dotenv.get("REDIS_HOST"));
        System.setProperty("REDIS_PORT", dotenv.get("REDIS_PORT"));
        System.setProperty("REDIS_PASSWORD", dotenv.get("REDIS_PASSWORD"));
        System.setProperty("TIMEZONE_OFFSET", dotenv.get("TIMEZONE_OFFSET"));
        System.setProperty("VCAR_ICON", dotenv.get("VCAR_ICON"));

        SpringApplication.run(VCarBeApplication.class, args);
    }

}

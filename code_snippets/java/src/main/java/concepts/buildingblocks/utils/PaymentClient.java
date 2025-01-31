package concepts.buildingblocks.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class PaymentClient {
    private static final Logger logger = LogManager.getLogger(PaymentClient.class);

    static public boolean charge(String id, String token, double amount) {
        logger.info(String.format("[%s] Executing payment with token %s for %.2f", id, token, amount));
        // ... do the call ...
        return true;
    }
}

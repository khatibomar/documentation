package develop

// <start_here>
import dev.restate.sdk.http.vertx.RestateHttpEndpointBuilder

fun main() {
    RestateHttpEndpointBuilder.builder()
        .bind(MyService())
        .bind(MyVirtualObject())
        .buildAndListen()
}
// <end_here>


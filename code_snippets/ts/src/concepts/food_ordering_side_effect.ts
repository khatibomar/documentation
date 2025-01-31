import * as restate from "@restatedev/restate-sdk";
import {ObjectContext} from "@restatedev/restate-sdk";
import {deliveryManager, Order, paymentClnt, restaurant, Status} from "./utils";

// <start_here>
async function process(ctx: ObjectContext, order: Order) {

    // 1. Set status
    ctx.set("status", Status.CREATED);

    // 2. Handle payment
    const token = ctx.rand.uuidv4();
    // focus
    const paid = await ctx.run(() =>
        // focus
        paymentClnt.charge(order.id, token, order.totalCost)
        // focus
    );

    if (!paid) {
        ctx.set("status", Status.REJECTED);
        return;
    }

    // 3. Wait until the requested preparation time
    ctx.set("status", Status.SCHEDULED);
    await ctx.sleep(order.deliveryDelay);

    // 4. Trigger preparation
    const preparationPromise = ctx.awakeable();
    // focus
    await ctx.run(() =>
        // focus
        restaurant.prepare(order.id, preparationPromise.id)
        // focus
    );
    ctx.set("status", Status.IN_PREPARATION);

    await preparationPromise.promise;
    ctx.set("status", Status.SCHEDULING_DELIVERY);

    // 5. Find a driver and start delivery
    await ctx.objectClient(deliveryManager, order.id)
        .startDelivery(order);
    ctx.set("status", Status.DELIVERED);
}
// <end_here>
import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { DatabaseModule } from "src/database/database.module";
import { ordersProviders } from "./orders.provider";

@Module({
  imports:[DatabaseModule], 
  controllers:[OrdersController],
  providers:[OrdersService, ...ordersProviders],
  exports:[OrdersService]
})

export class OrdersModule{}

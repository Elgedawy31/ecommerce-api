import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { CartsProviders } from "./cart.provider";
import { DatabaseModule } from "src/database/database.module";

@Module({
imports:[DatabaseModule] ,
controllers:[CartController] ,
providers:[CartService , ...CartsProviders] ,
exports:[...CartsProviders]
})

export class CartModule{}
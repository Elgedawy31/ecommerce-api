import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ProductsProvider } from "./products.provider";
import { DatabaseModule } from "../database/database.module";
import { CloudinaryModule } from "../common/providers/cloudinary.module";

@Module({
imports:[DatabaseModule, CloudinaryModule] ,
providers:[ProductsService , ...ProductsProvider] ,
controllers:[ProductsController ] ,
exports:[...ProductsProvider]
})

export class ProductsModule{}

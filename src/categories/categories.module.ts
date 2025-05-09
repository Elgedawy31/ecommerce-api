import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CateogirsProviders } from "./categories.provider";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports:[DatabaseModule] ,
  controllers:[CategoriesController] ,
  providers:[CategoriesService , ...CateogirsProviders] ,
  exports:[]
})

export class CategoriesModule{}
import { Module } from "@nestjs/common";
import { DataController } from "./data.controller";
import { DataService } from "./data.service";

@Module({
    providers: [ DataService],
    controllers: [DataController]
})
export class DataModule{};
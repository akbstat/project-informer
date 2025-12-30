import * as dotenv from "dotenv";
import { ChatModel } from "./service/model";

let modelService: ChatModel;

declare global {
    var __modelService__: ChatModel | undefined;
}

function initializeModelService(): ChatModel {
    dotenv.config();
    const model = new ChatModel({
        baseURL: process.env.MODEL_URL ?? "",
        apiKey: process.env.MODEL_API_KEY ?? "",
        model: process.env.MODEL ?? "",
    });
    return model;
}

export function getModelService() {
    if (!global.__modelService__) {
        global.__modelService__ = initializeModelService();
        modelService = global.__modelService__;
    }
    return modelService
}
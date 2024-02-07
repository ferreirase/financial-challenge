import { DataSource } from "typeorm";
import { getConfig } from "./dataSource";

const datasource = new DataSource(getConfig());

datasource.initialize();

export default datasource;

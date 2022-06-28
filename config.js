
import path from 'path';

const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=arquivosod;AccountKey=QMS+Zp5Lz66l3/cpn+VIi2gS9NnNTWI4G2nRq8Rp4PUhZI8pZouxTAijgoVGafPO/6GvGEHGEtqF+AStN+FWFQ==;EndpointSuffix=core.windows.net";
const token_xml = "sp=rac&st=2022-06-28T02:51:02Z&se=2022-06-28T10:51:02Z&spr=https&sv=2021-06-08&sr=c&sig=tOcBe9Xv9PvxEBLULaFu%2BjFcyi3WsZ3jhHlYhYAf7PM%3D";
const CONTAINER_JSON = `https://arquivosod.blob.core.windows.net/contoso-json?${token_xml}`;
const CONTAINER_XML = "https://arquivosod.blob.core.windows.net/contoso-xml?sp=rc&st=2022-06-21T23:47:52Z&se=2022-06-22T07:47:52Z&spr=https&sv=2021-06-08&sr=c&sig=MFpQf1n6vbo4p%2BTJo2zDrxXfGwsB6nRvSN9vgSJnHkM%3D";
const PASTA_JSON = path.resolve(process.cwd(), "json");
const PASTA_XML = path.resolve(process.cwd(), "xml");


export {
    AZURE_STORAGE_CONNECTION_STRING, 
    CONTAINER_JSON, 
    CONTAINER_XML,
    PASTA_JSON,
    PASTA_XML
};

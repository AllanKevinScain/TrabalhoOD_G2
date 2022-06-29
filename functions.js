import { PASTA_XML, CONTAINER_XML, PASTA_JSON, CONTAINER_JSON, AZURE_STORAGE_CONNECTION_STRING } from "./config.js";
import { execSync, exec } from "child_process";
import * as fs from "fs";
import path from 'path';
import conversor from 'xml-js';
import * as storageBlob from '@azure/storage-blob';
import { info } from "console";

function criarJSON(nome, data) {
  fs.writeFileSync(path.resolve(PASTA_JSON, nome), data);
  return { caminho: path.resolve(PASTA_JSON, nome), filename: nome };
}

function xml2json(data) {
  return conversor.xml2json(data);
}

function base642json(data) {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
}

async function uploadXML() {
  let arrayArquivos = fs.readdirSync(PASTA_XML);
  let blobServiceClient = storageBlob.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  let containerClient = blobServiceClient.getContainerClient("contoso-xml");
  for (const filename of arrayArquivos) {
    let caminho = path.resolve(PASTA_XML, filename);
    let infoFile = fs.statSync(caminho);
    let blobClient = containerClient.getBlockBlobClient(filename);
    let bufferSize = (1 * 1024 * 1024) / 2;
    let file = fs.createReadStream(caminho);

    try {
      blobClient.uploadStream(file, bufferSize, 5, {
        onProgress: (ev) => {
          console.log("Progresso do upload do arquivo", filename, " ", Math.round((ev.loadedBytes / infoFile.size)*100), "%");
        }
      })
    } catch (e) {
      console.log(e);
    }
  }
}

async function uploadJSON(stream, filename) {

  let blobServiceClient = storageBlob.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  let containerClient = blobServiceClient.getContainerClient("contoso-json");

  let blobClient = containerClient.getBlockBlobClient(filename);
  let bufferSize = (1 * 1024 * 1024) / 2;

  try {
    await blobClient.uploadStream(stream, bufferSize, 5, {
      onProgress: (ev) => {
      }
    })
  } catch (e) {
    console.log(e);
  }

};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  sleep,
  uploadJSON,
  uploadXML,
  criarJSON,
  xml2json,
  base642json
}
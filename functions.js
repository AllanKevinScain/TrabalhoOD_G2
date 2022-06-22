import { PASTA_XML, CONTAINER_XML, PASTA_JSON, CONTAINER_JSON } from "./config.js";
import { execSync } from "child_process";
import * as fs from "fs";
import path from 'path';
import conversor from 'xml-js';

function criarJSON(nome, data) {
  fs.writeFileSync(path.resolve(PASTA_JSON,nome), data);
}

function xml2json(data){
  return conversor.xml2json(data);
}

function base642json(data){
  return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
}

function uploadXML() {
  let arrayArquivos = fs.readdirSync(PASTA_XML);

  arrayArquivos.forEach(filename=>{
    execSync(`azcopy copy "${path.resolve(PASTA_XML, filename)}" "${CONTAINER_XML}"`);
  })

  
}

function uploadJSON(){

  let arrayArquivos = fs.readdirSync(PASTA_JSON);

  arrayArquivos.forEach(filename=>{
    let caminho = path.resolve(PASTA_JSON, filename);
    execSync(`azcopy copy "${caminho}" "${CONTAINER_JSON}"`);
    fs.unlinkSync(caminho);
  });

}

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